from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class SiteStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    WARNING = "warning"
    UNKNOWN = "unknown"

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

# Legacy model for compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class Site(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    url: HttpUrl
    owner_id: str
    status: SiteStatus = SiteStatus.UNKNOWN
    last_check: Optional[datetime] = None
    uptime_percentage: float = 0.0
    response_time: Optional[float] = None
    ssl_expiry: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteCreate(BaseModel):
    name: str
    url: HttpUrl

class SiteUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[HttpUrl] = None

class CheckResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_id: str
    status: SiteStatus
    response_time: Optional[float] = None
    status_code: Optional[int] = None
    error_message: Optional[str] = None
    checked_at: datetime = Field(default_factory=datetime.utcnow)
    ssl_info: Optional[Dict[str, Any]] = None

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    password_hash: str
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class SiteStats(BaseModel):
    site_id: str
    total_checks: int
    successful_checks: int
    failed_checks: int
    average_response_time: float
    uptime_percentage: float
    last_24h_checks: List[CheckResult]
    uptime_trend: List[Dict[str, Any]]

class DashboardStats(BaseModel):
    total_sites: int
    online_sites: int
    offline_sites: int
    warning_sites: int
    average_uptime: float
    total_checks_today: int
    recent_incidents: List[CheckResult]