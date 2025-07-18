import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from ..models import User, UserCreate, UserLogin, Token

class AuthService:
    def __init__(self, secret_key: str = "your-secret-key-here"):
        self.secret_key = secret_key
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30 * 24 * 60  # 30 дней
    
    def hash_password(self, password: str) -> str:
        """Хеширование пароля"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Проверка пароля"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    def create_access_token(self, user_id: str, username: str) -> str:
        """Создание JWT токена"""
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode = {
            "user_id": user_id,
            "username": username,
            "exp": expire
        }
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[dict]:
        """Проверка JWT токена"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.PyJWTError:
            return None
    
    def create_user(self, user_data: UserCreate) -> User:
        """Создание нового пользователя"""
        hashed_password = self.hash_password(user_data.password)
        
        user = User(
            email=user_data.email,
            username=user_data.username,
            password_hash=hashed_password
        )
        
        return user