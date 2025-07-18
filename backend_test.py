#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for SiteGuard Pro+
Tests all authentication, site management, and monitoring endpoints
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from frontend .env file
def get_backend_url():
    """Get the backend URL from frontend .env file"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url() + "/api"

class SiteGuardAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = None
        self.auth_token = None
        self.test_user_data = {
            "username": "testuser_siteguard",
            "email": "testuser@siteguard.com", 
            "password": "SecurePassword123!"
        }
        self.test_site_data = {
            "name": "Test Site - HTTPBin",
            "url": "https://httpbin.org/status/200"
        }
        self.created_site_id = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, status: str, details: str = ""):
        """Log test results"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"[{timestamp}] {status_symbol} {test_name}: {status}")
        if details:
            print(f"    Details: {details}")
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, 
                          headers: Dict = None, expect_status: int = 200) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        
        # Add auth header if token exists
        if self.auth_token and headers is None:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
        elif self.auth_token and headers:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            async with self.session.request(method, url, json=data, headers=headers) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                success = response.status == expect_status
                return success, response_data, response.status
                
        except Exception as e:
            return False, str(e), 0
    
    async def test_root_endpoint(self):
        """Test root API endpoint"""
        success, data, status = await self.make_request("GET", "/")
        
        if success and isinstance(data, dict) and "message" in data:
            self.log_test("Root Endpoint", "PASS", f"Message: {data['message']}")
            return True
        else:
            self.log_test("Root Endpoint", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_user_registration(self):
        """Test user registration"""
        success, data, status = await self.make_request(
            "POST", "/auth/register", self.test_user_data
        )
        
        if success and isinstance(data, dict) and "access_token" in data:
            self.auth_token = data["access_token"]
            self.log_test("User Registration", "PASS", "User registered and token received")
            return True
        elif status == 400 and "already registered" in str(data):
            # User already exists, try to login
            self.log_test("User Registration", "SKIP", "User already exists, will try login")
            return await self.test_user_login()
        else:
            self.log_test("User Registration", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_user_login(self):
        """Test user login"""
        login_data = {
            "username": self.test_user_data["username"],
            "password": self.test_user_data["password"]
        }
        
        success, data, status = await self.make_request(
            "POST", "/auth/login", login_data
        )
        
        if success and isinstance(data, dict) and "access_token" in data:
            self.auth_token = data["access_token"]
            self.log_test("User Login", "PASS", "Login successful and token received")
            return True
        else:
            self.log_test("User Login", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_token_validation(self):
        """Test token validation"""
        if not self.auth_token:
            self.log_test("Token Validation", "SKIP", "No auth token available")
            return False
            
        success, data, status = await self.make_request("GET", "/auth/validate")
        
        if success and isinstance(data, dict) and "user_id" in data:
            self.log_test("Token Validation", "PASS", f"User ID: {data['user_id']}")
            return True
        else:
            self.log_test("Token Validation", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_unauthorized_access(self):
        """Test accessing protected endpoint without token"""
        # Temporarily remove token
        temp_token = self.auth_token
        self.auth_token = None
        
        success, data, status = await self.make_request(
            "GET", "/sites", expect_status=401
        )
        
        # Restore token
        self.auth_token = temp_token
        
        if status == 401:
            self.log_test("Unauthorized Access", "PASS", "Correctly rejected unauthorized request")
            return True
        else:
            self.log_test("Unauthorized Access", "FAIL", f"Expected 401, got {status}")
            return False
    
    async def test_add_site(self):
        """Test adding a new site"""
        if not self.auth_token:
            self.log_test("Add Site", "SKIP", "No auth token available")
            return False
            
        success, data, status = await self.make_request(
            "POST", "/add-site", self.test_site_data
        )
        
        if success and isinstance(data, dict) and "id" in data:
            self.created_site_id = data["id"]
            self.log_test("Add Site", "PASS", f"Site created with ID: {self.created_site_id}")
            return True
        else:
            self.log_test("Add Site", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_get_sites(self):
        """Test getting user's sites"""
        if not self.auth_token:
            self.log_test("Get Sites", "SKIP", "No auth token available")
            return False
            
        success, data, status = await self.make_request("GET", "/sites")
        
        if success and isinstance(data, list):
            site_count = len(data)
            self.log_test("Get Sites", "PASS", f"Retrieved {site_count} sites")
            return True
        else:
            self.log_test("Get Sites", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_get_specific_site(self):
        """Test getting a specific site"""
        if not self.auth_token or not self.created_site_id:
            self.log_test("Get Specific Site", "SKIP", "No auth token or site ID available")
            return False
            
        success, data, status = await self.make_request(
            "GET", f"/sites/{self.created_site_id}"
        )
        
        if success and isinstance(data, dict) and data.get("id") == self.created_site_id:
            self.log_test("Get Specific Site", "PASS", f"Retrieved site: {data.get('name')}")
            return True
        else:
            self.log_test("Get Specific Site", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_update_site(self):
        """Test updating a site"""
        if not self.auth_token or not self.created_site_id:
            self.log_test("Update Site", "SKIP", "No auth token or site ID available")
            return False
            
        update_data = {"name": "Updated Test Site - HTTPBin"}
        success, data, status = await self.make_request(
            "PUT", f"/sites/{self.created_site_id}", update_data
        )
        
        if success and isinstance(data, dict) and data.get("name") == update_data["name"]:
            self.log_test("Update Site", "PASS", f"Site updated: {data.get('name')}")
            return True
        else:
            self.log_test("Update Site", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_check_sites(self):
        """Test site monitoring check"""
        if not self.auth_token:
            self.log_test("Check Sites", "SKIP", "No auth token available")
            return False
            
        success, data, status = await self.make_request("POST", "/check-sites")
        
        if success and isinstance(data, dict) and "message" in data:
            results_count = len(data.get("results", []))
            self.log_test("Check Sites", "PASS", f"Checked sites: {data['message']}, Results: {results_count}")
            return True
        else:
            self.log_test("Check Sites", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_site_stats(self):
        """Test getting site statistics"""
        if not self.auth_token or not self.created_site_id:
            self.log_test("Site Stats", "SKIP", "No auth token or site ID available")
            return False
            
        success, data, status = await self.make_request(
            "GET", f"/stats/{self.created_site_id}"
        )
        
        if success and isinstance(data, dict) and "site_id" in data:
            uptime = data.get("uptime_percentage", 0)
            total_checks = data.get("total_checks", 0)
            self.log_test("Site Stats", "PASS", f"Uptime: {uptime}%, Total checks: {total_checks}")
            return True
        else:
            self.log_test("Site Stats", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_dashboard_stats(self):
        """Test getting dashboard statistics"""
        if not self.auth_token:
            self.log_test("Dashboard Stats", "SKIP", "No auth token available")
            return False
            
        success, data, status = await self.make_request("GET", "/dashboard")
        
        if success and isinstance(data, dict) and "total_sites" in data:
            total_sites = data.get("total_sites", 0)
            online_sites = data.get("online_sites", 0)
            self.log_test("Dashboard Stats", "PASS", f"Total sites: {total_sites}, Online: {online_sites}")
            return True
        else:
            self.log_test("Dashboard Stats", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_site_checks_history(self):
        """Test getting site check history"""
        if not self.auth_token or not self.created_site_id:
            self.log_test("Site Checks History", "SKIP", "No auth token or site ID available")
            return False
            
        success, data, status = await self.make_request(
            "GET", f"/sites/{self.created_site_id}/checks"
        )
        
        if success and isinstance(data, list):
            checks_count = len(data)
            self.log_test("Site Checks History", "PASS", f"Retrieved {checks_count} check records")
            return True
        else:
            self.log_test("Site Checks History", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_invalid_site_access(self):
        """Test accessing non-existent site"""
        if not self.auth_token:
            self.log_test("Invalid Site Access", "SKIP", "No auth token available")
            return False
            
        fake_site_id = "non-existent-site-id"
        success, data, status = await self.make_request(
            "GET", f"/sites/{fake_site_id}", expect_status=404
        )
        
        if status == 404:
            self.log_test("Invalid Site Access", "PASS", "Correctly returned 404 for non-existent site")
            return True
        else:
            self.log_test("Invalid Site Access", "FAIL", f"Expected 404, got {status}")
            return False
    
    async def test_legacy_endpoints(self):
        """Test legacy status endpoints for compatibility"""
        # Test legacy status creation
        legacy_data = {"client_name": "test_client_siteguard"}
        success, data, status = await self.make_request(
            "POST", "/status", legacy_data
        )
        
        if success and isinstance(data, dict) and "id" in data:
            self.log_test("Legacy Status Create", "PASS", f"Created status with ID: {data['id']}")
        else:
            self.log_test("Legacy Status Create", "FAIL", f"Status: {status}, Data: {data}")
            return False
        
        # Test legacy status retrieval
        success, data, status = await self.make_request("GET", "/status")
        
        if success and isinstance(data, list):
            self.log_test("Legacy Status Get", "PASS", f"Retrieved {len(data)} status records")
            return True
        else:
            self.log_test("Legacy Status Get", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def test_delete_site(self):
        """Test deleting a site (cleanup)"""
        if not self.auth_token or not self.created_site_id:
            self.log_test("Delete Site", "SKIP", "No auth token or site ID available")
            return False
            
        success, data, status = await self.make_request(
            "DELETE", f"/sites/{self.created_site_id}"
        )
        
        if success and isinstance(data, dict) and "message" in data:
            self.log_test("Delete Site", "PASS", f"Site deleted: {data['message']}")
            return True
        else:
            self.log_test("Delete Site", "FAIL", f"Status: {status}, Data: {data}")
            return False
    
    async def run_all_tests(self):
        """Run all backend API tests"""
        print(f"\n🚀 Starting SiteGuard Pro+ Backend API Tests")
        print(f"📍 Backend URL: {self.base_url}")
        print("=" * 60)
        
        test_results = []
        
        # Test sequence
        tests = [
            ("Root Endpoint", self.test_root_endpoint),
            ("User Registration", self.test_user_registration),
            ("Token Validation", self.test_token_validation),
            ("Unauthorized Access", self.test_unauthorized_access),
            ("Add Site", self.test_add_site),
            ("Get Sites", self.test_get_sites),
            ("Get Specific Site", self.test_get_specific_site),
            ("Update Site", self.test_update_site),
            ("Check Sites", self.test_check_sites),
            ("Site Stats", self.test_site_stats),
            ("Dashboard Stats", self.test_dashboard_stats),
            ("Site Checks History", self.test_site_checks_history),
            ("Invalid Site Access", self.test_invalid_site_access),
            ("Legacy Endpoints", self.test_legacy_endpoints),
            ("Delete Site", self.test_delete_site),
        ]
        
        for test_name, test_func in tests:
            try:
                result = await test_func()
                test_results.append((test_name, result))
            except Exception as e:
                self.log_test(test_name, "ERROR", str(e))
                test_results.append((test_name, False))
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for _, result in test_results if result)
        total = len(test_results)
        
        for test_name, result in test_results:
            status_symbol = "✅" if result else "❌"
            print(f"{status_symbol} {test_name}")
        
        print(f"\n🎯 Results: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
            return False

async def main():
    """Main test runner"""
    async with SiteGuardAPITester() as tester:
        success = await tester.run_all_tests()
        return success

if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n❌ Tests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n💥 Test runner error: {e}")
        exit(1)