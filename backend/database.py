from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os

from models import Site, CheckResult, User, SiteStats, DashboardStats, SiteStatus

class DatabaseService:
    def __init__(self, db):
        self.db = db
        self.sites_collection = db.sites
        self.checks_collection = db.checks
        self.users_collection = db.users
    
    # Методы для работы с сайтами
    async def create_site(self, site: Site) -> Site:
        """Создание нового сайта"""
        site_dict = site.dict()
        await self.sites_collection.insert_one(site_dict)
        return site
    
    async def get_site(self, site_id: str) -> Optional[Site]:
        """Получение сайта по ID"""
        site_data = await self.sites_collection.find_one({"id": site_id})
        return Site(**site_data) if site_data else None
    
    async def get_sites_by_user(self, user_id: str) -> List[Site]:
        """Получение всех сайтов пользователя"""
        cursor = self.sites_collection.find({"owner_id": user_id})
        sites = []
        async for site_data in cursor:
            sites.append(Site(**site_data))
        return sites
    
    async def get_all_sites(self) -> List[Site]:
        """Получение всех сайтов"""
        cursor = self.sites_collection.find({})
        sites = []
        async for site_data in cursor:
            sites.append(Site(**site_data))
        return sites
    
    async def update_site(self, site_id: str, update_data: dict) -> Optional[Site]:
        """Обновление сайта"""
        update_data["updated_at"] = datetime.utcnow()
        result = await self.sites_collection.find_one_and_update(
            {"id": site_id},
            {"$set": update_data},
            return_document=True
        )
        return Site(**result) if result else None
    
    async def delete_site(self, site_id: str) -> bool:
        """Удаление сайта"""
        result = await self.sites_collection.delete_one({"id": site_id})
        return result.deleted_count > 0
    
    # Методы для работы с проверками
    async def save_check_result(self, check_result: CheckResult) -> CheckResult:
        """Сохранение результата проверки"""
        check_dict = check_result.dict()
        await self.checks_collection.insert_one(check_dict)
        return check_result
    
    async def get_site_checks(self, site_id: str, limit: int = 100) -> List[CheckResult]:
        """Получение проверок для сайта"""
        cursor = self.checks_collection.find({"site_id": site_id}).sort("checked_at", -1).limit(limit)
        checks = []
        async for check_data in cursor:
            checks.append(CheckResult(**check_data))
        return checks
    
    async def get_recent_checks(self, site_id: str, hours: int = 24) -> List[CheckResult]:
        """Получение недавних проверок"""
        since = datetime.utcnow() - timedelta(hours=hours)
        cursor = self.checks_collection.find({
            "site_id": site_id,
            "checked_at": {"$gte": since}
        }).sort("checked_at", -1)
        
        checks = []
        async for check_data in cursor:
            checks.append(CheckResult(**check_data))
        return checks
    
    # Методы для работы с пользователями
    async def create_user(self, user: User) -> User:
        """Создание нового пользователя"""
        user_dict = user.dict()
        await self.users_collection.insert_one(user_dict)
        return user
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Получение пользователя по username"""
        user_data = await self.users_collection.find_one({"username": username})
        return User(**user_data) if user_data else None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Получение пользователя по email"""
        user_data = await self.users_collection.find_one({"email": email})
        return User(**user_data) if user_data else None
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Получение пользователя по ID"""
        user_data = await self.users_collection.find_one({"id": user_id})
        return User(**user_data) if user_data else None
    
    # Методы для статистики
    async def get_site_stats(self, site_id: str) -> SiteStats:
        """Получение статистики для сайта"""
        # Получаем все проверки для сайта
        checks = await self.get_site_checks(site_id, limit=1000)
        
        # Считаем статистику
        total_checks = len(checks)
        successful_checks = sum(1 for check in checks if check.status == SiteStatus.ONLINE)
        failed_checks = total_checks - successful_checks
        
        response_times = [check.response_time for check in checks if check.response_time is not None]
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        uptime_percentage = (successful_checks / total_checks * 100) if total_checks > 0 else 0
        
        # Получаем проверки за последние 24 часа
        last_24h_checks = await self.get_recent_checks(site_id, hours=24)
        
        # Создаем тренд uptime (последние 7 дней)
        uptime_trend = []
        for i in range(7):
            day_start = datetime.utcnow() - timedelta(days=i+1)
            day_end = datetime.utcnow() - timedelta(days=i)
            
            day_checks = [check for check in checks if day_start <= check.checked_at <= day_end]
            day_successful = sum(1 for check in day_checks if check.status == SiteStatus.ONLINE)
            day_uptime = (day_successful / len(day_checks) * 100) if day_checks else 0
            
            uptime_trend.append({
                "date": day_start.strftime("%Y-%m-%d"),
                "uptime": day_uptime
            })
        
        return SiteStats(
            site_id=site_id,
            total_checks=total_checks,
            successful_checks=successful_checks,
            failed_checks=failed_checks,
            average_response_time=avg_response_time,
            uptime_percentage=uptime_percentage,
            last_24h_checks=last_24h_checks,
            uptime_trend=uptime_trend
        )
    
    async def get_dashboard_stats(self, user_id: str) -> DashboardStats:
        """Получение статистики для дашборда"""
        sites = await self.get_sites_by_user(user_id)
        
        total_sites = len(sites)
        online_sites = 0
        offline_sites = 0
        warning_sites = 0
        
        # Получаем последние проверки для каждого сайта
        recent_incidents = []
        total_uptime = 0
        
        for site in sites:
            recent_checks = await self.get_recent_checks(site.id, hours=1)
            if recent_checks:
                latest_check = recent_checks[0]
                if latest_check.status == SiteStatus.ONLINE:
                    online_sites += 1
                elif latest_check.status == SiteStatus.OFFLINE:
                    offline_sites += 1
                    recent_incidents.append(latest_check)
                else:
                    warning_sites += 1
                
                # Считаем uptime для сайта
                site_stats = await self.get_site_stats(site.id)
                total_uptime += site_stats.uptime_percentage
        
        average_uptime = total_uptime / total_sites if total_sites > 0 else 0
        
        # Считаем общее количество проверок за сегодня
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_checks = await self.checks_collection.count_documents({
            "checked_at": {"$gte": today_start}
        })
        
        return DashboardStats(
            total_sites=total_sites,
            online_sites=online_sites,
            offline_sites=offline_sites,
            warning_sites=warning_sites,
            average_uptime=average_uptime,
            total_checks_today=today_checks,
            recent_incidents=recent_incidents[:10]  # Последние 10 инцидентов
        )