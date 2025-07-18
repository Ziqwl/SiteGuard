import aiohttp
import asyncio
import ssl
import socket
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
import time
import certifi

from models import Site, CheckResult, SiteStatus, SiteStats, DashboardStats

class MonitoringService:
    def __init__(self):
        self.timeout = aiohttp.ClientTimeout(total=30)
        
    async def check_site(self, site: Site) -> CheckResult:
        """Проверка доступности сайта"""
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                async with session.get(str(site.url), ssl=False) as response:
                    response_time = (time.time() - start_time) * 1000  # в миллисекундах
                    
                    if response.status == 200:
                        status = SiteStatus.ONLINE
                    elif 200 <= response.status < 400:
                        status = SiteStatus.ONLINE
                    elif 400 <= response.status < 500:
                        status = SiteStatus.WARNING
                    else:
                        status = SiteStatus.OFFLINE
                    
                    # Проверка SSL сертификата
                    ssl_info = await self._check_ssl_certificate(site.url)
                    
                    return CheckResult(
                        site_id=site.id,
                        status=status,
                        response_time=response_time,
                        status_code=response.status,
                        checked_at=datetime.utcnow(),
                        ssl_info=ssl_info
                    )
                    
        except aiohttp.ClientError as e:
            return CheckResult(
                site_id=site.id,
                status=SiteStatus.OFFLINE,
                response_time=None,
                status_code=None,
                error_message=str(e),
                checked_at=datetime.utcnow()
            )
        except Exception as e:
            return CheckResult(
                site_id=site.id,
                status=SiteStatus.UNKNOWN,
                response_time=None,
                status_code=None,
                error_message=f"Unexpected error: {str(e)}",
                checked_at=datetime.utcnow()
            )
    
    async def _check_ssl_certificate(self, url: str) -> Optional[Dict[str, Any]]:
        """Проверка SSL сертификата"""
        try:
            parsed_url = urlparse(str(url))
            if parsed_url.scheme != 'https':
                return None
                
            hostname = parsed_url.hostname
            port = parsed_url.port or 443
            
            # Создаем SSL контекст
            context = ssl.create_default_context()
            
            # Подключаемся к серверу
            with socket.create_connection((hostname, port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Парсим дату истечения
                    expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    
                    return {
                        'issuer': dict(x[0] for x in cert['issuer']),
                        'subject': dict(x[0] for x in cert['subject']),
                        'serial_number': cert['serialNumber'],
                        'not_before': datetime.strptime(cert['notBefore'], '%b %d %H:%M:%S %Y %Z').isoformat(),
                        'not_after': expiry_date.isoformat(),
                        'expires_in_days': (expiry_date - datetime.utcnow()).days
                    }
        except Exception as e:
            return {'error': str(e)}
    
    async def check_multiple_sites(self, sites: List[Site]) -> List[CheckResult]:
        """Проверка нескольких сайтов одновременно"""
        tasks = [self.check_site(site) for site in sites]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Фильтруем исключения
        valid_results = []
        for result in results:
            if isinstance(result, CheckResult):
                valid_results.append(result)
        
        return valid_results
    
    def calculate_uptime_percentage(self, checks: List[CheckResult]) -> float:
        """Расчет процента uptime"""
        if not checks:
            return 0.0
        
        successful_checks = sum(1 for check in checks if check.status == SiteStatus.ONLINE)
        return (successful_checks / len(checks)) * 100
    
    def get_average_response_time(self, checks: List[CheckResult]) -> float:
        """Получение среднего времени ответа"""
        response_times = [check.response_time for check in checks if check.response_time is not None]
        if not response_times:
            return 0.0
        return sum(response_times) / len(response_times)