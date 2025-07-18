from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import asyncio
from datetime import datetime

# Импортируем наши модели и сервисы
from models import (
    Site, SiteCreate, SiteUpdate, CheckResult, User, UserCreate, UserLogin, Token,
    SiteStats, DashboardStats, StatusCheck, StatusCheckCreate
)
from services.monitoring import MonitoringService
from services.auth import AuthService
from database import DatabaseService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Инициализация сервисов
db_service = DatabaseService(db)
monitoring_service = MonitoringService()
auth_service = AuthService(secret_key=os.environ.get('SECRET_KEY', 'your-secret-key-here'))

# Create the main app without a prefix
app = FastAPI(title="SiteGuard Pro+", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Получение текущего пользователя из JWT токена"""
    token_data = auth_service.verify_token(credentials.credentials)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = await db_service.get_user_by_id(token_data["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

# Auth endpoints
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Регистрация пользователя"""
    # Проверяем, что пользователь не существует
    existing_user = await db_service.get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    existing_email = await db_service.get_user_by_email(user_data.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Создаем пользователя
    user = auth_service.create_user(user_data)
    await db_service.create_user(user)
    
    # Создаем токен
    access_token = auth_service.create_access_token(user.id, user.username)
    return Token(access_token=access_token, token_type="bearer")

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Вход пользователя"""
    user = await db_service.get_user_by_username(user_data.username)
    if not user or not auth_service.verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = auth_service.create_access_token(user.id, user.username)
    return Token(access_token=access_token, token_type="bearer")

@api_router.get("/auth/validate")
async def validate_token(current_user: User = Depends(get_current_user)):
    """Валидация токена"""
    return {"user_id": current_user.id, "username": current_user.username}

# Sites endpoints
@api_router.post("/add-site", response_model=Site)
async def add_site(site_data: SiteCreate, current_user: User = Depends(get_current_user)):
    """Добавление нового сайта"""
    site = Site(
        name=site_data.name,
        url=site_data.url,
        owner_id=current_user.id
    )
    
    created_site = await db_service.create_site(site)
    return created_site

@api_router.get("/sites", response_model=List[Site])
async def get_sites(current_user: User = Depends(get_current_user)):
    """Получение всех сайтов пользователя"""
    sites = await db_service.get_sites_by_user(current_user.id)
    return sites

@api_router.get("/sites/{site_id}", response_model=Site)
async def get_site(site_id: str, current_user: User = Depends(get_current_user)):
    """Получение конкретного сайта"""
    site = await db_service.get_site(site_id)
    if not site or site.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    return site

@api_router.put("/sites/{site_id}", response_model=Site)
async def update_site(site_id: str, site_data: SiteUpdate, current_user: User = Depends(get_current_user)):
    """Обновление сайта"""
    site = await db_service.get_site(site_id)
    if not site or site.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    update_data = site_data.dict(exclude_unset=True)
    updated_site = await db_service.update_site(site_id, update_data)
    return updated_site

@api_router.delete("/sites/{site_id}")
async def delete_site(site_id: str, current_user: User = Depends(get_current_user)):
    """Удаление сайта"""
    site = await db_service.get_site(site_id)
    if not site or site.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    await db_service.delete_site(site_id)
    return {"message": "Site deleted successfully"}

# Monitoring endpoints
@api_router.post("/check-sites")
async def check_sites(current_user: User = Depends(get_current_user)):
    """Проверка всех сайтов пользователя"""
    sites = await db_service.get_sites_by_user(current_user.id)
    if not sites:
        return {"message": "No sites to check"}
    
    # Проверяем все сайты
    check_results = await monitoring_service.check_multiple_sites(sites)
    
    # Сохраняем результаты
    for result in check_results:
        await db_service.save_check_result(result)
        
        # Обновляем статус сайта
        await db_service.update_site(result.site_id, {
            "status": result.status,
            "last_check": result.checked_at,
            "response_time": result.response_time
        })
    
    return {"message": f"Checked {len(check_results)} sites", "results": check_results}

@api_router.get("/stats/{site_id}", response_model=SiteStats)
async def get_site_stats(site_id: str, current_user: User = Depends(get_current_user)):
    """Получение статистики сайта"""
    site = await db_service.get_site(site_id)
    if not site or site.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    stats = await db_service.get_site_stats(site_id)
    return stats

@api_router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    """Получение статистики для дашборда"""
    stats = await db_service.get_dashboard_stats(current_user.id)
    return stats

@api_router.get("/sites/{site_id}/checks", response_model=List[CheckResult])
async def get_site_checks(site_id: str, limit: int = 100, current_user: User = Depends(get_current_user)):
    """Получение истории проверок сайта"""
    site = await db_service.get_site(site_id)
    if not site or site.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    checks = await db_service.get_site_checks(site_id, limit)
    return checks

# Legacy endpoints for compatibility
@api_router.get("/")
async def root():
    return {"message": "SiteGuard Pro+ API v1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
