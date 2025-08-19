#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Renace Mi Edad Dorada NGO Application
Tests all endpoints with proper validation and error handling
"""

import requests
import json
import uuid
import time
from typing import Dict, Any, List, Optional

class BackendTester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Store created resources for cleanup
        self.created_activities = []
        self.created_videos = []
        self.created_messages = []
        
    def log_test(self, test_name: str, status: str, details: str = ""):
        """Log test results with consistent formatting"""
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return response and success status"""
        url = f"{self.base_url}{endpoint}" if endpoint.startswith('/') else f"{self.api_url}/{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, params=params)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, params=params)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, params=params)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, params=params)
            else:
                return None, False, f"Unsupported method: {method}"
            
            return response, True, ""
        except requests.exceptions.RequestException as e:
            return None, False, str(e)
    
    def test_base_endpoints(self):
        """Test base endpoints: /, /health, /api/"""
        print("🔍 Testing Base Endpoints...")
        
        # Test root endpoint
        response, success, error = self.make_request('GET', '/')
        if success and response.status_code == 200:
            try:
                data = response.json()
                if data.get('success') and 'Renace Mi Edad Dorada' in data.get('message', ''):
                    self.log_test("GET / - Root endpoint", "PASS", f"Message: {data.get('message')}")
                else:
                    self.log_test("GET / - Root endpoint", "FAIL", f"Invalid response structure: {data}")
            except json.JSONDecodeError:
                self.log_test("GET / - Root endpoint", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET / - Root endpoint", "FAIL", f"Status: {response.status_code if response else 'No response'}, Error: {error}")
        
        # Test health endpoint
        response, success, error = self.make_request('GET', '/health')
        if success and response.status_code == 200:
            try:
                data = response.json()
                if data.get('success') and 'healthy' in data.get('message', '').lower():
                    self.log_test("GET /health - Health check", "PASS", f"Uptime: {data.get('uptime', 'N/A')}s")
                else:
                    self.log_test("GET /health - Health check", "FAIL", f"Invalid response: {data}")
            except json.JSONDecodeError:
                self.log_test("GET /health - Health check", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET /health - Health check", "FAIL", f"Status: {response.status_code if response else 'No response'}, Error: {error}")
        
        # Test API root endpoint
        response, success, error = self.make_request('GET', '/api/')
        if success and response.status_code == 200:
            try:
                data = response.json()
                if data.get('success'):
                    self.log_test("GET /api/ - API root", "PASS", f"Message: {data.get('message')}")
                else:
                    self.log_test("GET /api/ - API root", "FAIL", f"Invalid response: {data}")
            except json.JSONDecodeError:
                self.log_test("GET /api/ - API root", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET /api/ - API root", "FAIL", f"Status: {response.status_code if response else 'No response'}, Error: {error}")
    
    def test_activities_endpoints(self):
        """Test all activities endpoints with validation"""
        print("🎯 Testing Activities Endpoints...")
        
        # Test GET activities (initially empty)
        response, success, error = self.make_request('GET', 'activities')
        if success and response.status_code == 200:
            try:
                data = response.json()
                if data.get('success') and isinstance(data.get('data'), list):
                    self.log_test("GET /api/activities - List activities", "PASS", f"Found {len(data['data'])} activities")
                else:
                    self.log_test("GET /api/activities - List activities", "FAIL", f"Invalid response structure: {data}")
            except json.JSONDecodeError:
                self.log_test("GET /api/activities - List activities", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET /api/activities - List activities", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test POST activity with valid data
        valid_activity = {
            "week": 1,
            "title": "Actividad de Ejercicios Matutinos",
            "description": "Rutina de ejercicios suaves para adultos mayores, incluyendo estiramientos y caminata ligera en el parque comunitario.",
            "images": ["https://example.com/exercise1.jpg", "https://example.com/exercise2.jpg"]
        }
        
        response, success, error = self.make_request('POST', 'activities', valid_activity)
        if success and response.status_code == 201:
            try:
                data = response.json()
                if data.get('success') and data.get('data', {}).get('id'):
                    activity_id = data['data']['id']
                    self.created_activities.append(activity_id)
                    self.log_test("POST /api/activities - Create activity", "PASS", f"Created activity with ID: {activity_id}")
                else:
                    self.log_test("POST /api/activities - Create activity", "FAIL", f"Invalid response: {data}")
            except json.JSONDecodeError:
                self.log_test("POST /api/activities - Create activity", "FAIL", "Invalid JSON response")
        else:
            self.log_test("POST /api/activities - Create activity", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test POST activity validation errors
        invalid_activities = [
            {"week": 6, "title": "Test", "description": "Test"},  # Invalid week
            {"week": 1, "title": "", "description": "Test"},  # Empty title
            {"week": 1, "title": "Test", "description": ""},  # Empty description
            {"week": 1, "title": "A" * 201, "description": "Test"},  # Title too long
            {"week": 1, "title": "Test", "description": "A" * 1001},  # Description too long
        ]
        
        for i, invalid_activity in enumerate(invalid_activities):
            response, success, error = self.make_request('POST', 'activities', invalid_activity)
            if success and response.status_code == 400:
                try:
                    data = response.json()
                    if not data.get('success') and data.get('error'):
                        self.log_test(f"POST /api/activities - Validation error {i+1}", "PASS", f"Correctly rejected: {data.get('error')}")
                    else:
                        self.log_test(f"POST /api/activities - Validation error {i+1}", "FAIL", f"Invalid error response: {data}")
                except json.JSONDecodeError:
                    self.log_test(f"POST /api/activities - Validation error {i+1}", "FAIL", "Invalid JSON response")
            else:
                self.log_test(f"POST /api/activities - Validation error {i+1}", "FAIL", f"Expected 400, got {response.status_code if response else 'No response'}")
        
        # Test duplicate week validation
        duplicate_activity = {
            "week": 1,  # Same week as created above
            "title": "Duplicate Week Activity",
            "description": "This should fail due to duplicate week"
        }
        
        response, success, error = self.make_request('POST', 'activities', duplicate_activity)
        if success and response.status_code == 400:
            try:
                data = response.json()
                if not data.get('success') and 'already exists' in data.get('message', ''):
                    self.log_test("POST /api/activities - Duplicate week validation", "PASS", "Correctly rejected duplicate week")
                else:
                    self.log_test("POST /api/activities - Duplicate week validation", "FAIL", f"Unexpected error message: {data}")
            except json.JSONDecodeError:
                self.log_test("POST /api/activities - Duplicate week validation", "FAIL", "Invalid JSON response")
        else:
            self.log_test("POST /api/activities - Duplicate week validation", "FAIL", f"Expected 400, got {response.status_code if response else 'No response'}")
        
        # Test PUT activity (update)
        if self.created_activities:
            activity_id = self.created_activities[0]
            update_data = {
                "title": "Actividad de Ejercicios Matutinos - Actualizada",
                "description": "Rutina actualizada con nuevos ejercicios de flexibilidad"
            }
            
            response, success, error = self.make_request('PUT', f'activities/{activity_id}', update_data)
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    if data.get('success') and data.get('data', {}).get('title') == update_data['title']:
                        self.log_test("PUT /api/activities/:id - Update activity", "PASS", "Activity updated successfully")
                    else:
                        self.log_test("PUT /api/activities/:id - Update activity", "FAIL", f"Update not reflected: {data}")
                except json.JSONDecodeError:
                    self.log_test("PUT /api/activities/:id - Update activity", "FAIL", "Invalid JSON response")
            else:
                self.log_test("PUT /api/activities/:id - Update activity", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test PUT non-existent activity
        fake_id = str(uuid.uuid4())
        response, success, error = self.make_request('PUT', f'activities/{fake_id}', {"title": "Test"})
        if success and response.status_code == 404:
            self.log_test("PUT /api/activities/:id - Non-existent activity", "PASS", "Correctly returned 404")
        else:
            self.log_test("PUT /api/activities/:id - Non-existent activity", "FAIL", f"Expected 404, got {response.status_code if response else 'No response'}")
        
        # Test DELETE activity (soft delete)
        if self.created_activities:
            activity_id = self.created_activities[0]
            
            response, success, error = self.make_request('DELETE', f'activities/{activity_id}')
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    if data.get('success'):
                        self.log_test("DELETE /api/activities/:id - Soft delete", "PASS", "Activity soft deleted successfully")
                        
                        # Verify it's no longer in active list
                        response, success, error = self.make_request('GET', 'activities')
                        if success and response.status_code == 200:
                            data = response.json()
                            active_ids = [act.get('id') for act in data.get('data', [])]
                            if activity_id not in active_ids:
                                self.log_test("DELETE /api/activities/:id - Verify soft delete", "PASS", "Activity no longer in active list")
                            else:
                                self.log_test("DELETE /api/activities/:id - Verify soft delete", "FAIL", "Activity still in active list")
                    else:
                        self.log_test("DELETE /api/activities/:id - Soft delete", "FAIL", f"Delete failed: {data}")
                except json.JSONDecodeError:
                    self.log_test("DELETE /api/activities/:id - Soft delete", "FAIL", "Invalid JSON response")
            else:
                self.log_test("DELETE /api/activities/:id - Soft delete", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test DELETE non-existent activity
        fake_id = str(uuid.uuid4())
        response, success, error = self.make_request('DELETE', f'activities/{fake_id}')
        if success and response.status_code == 404:
            self.log_test("DELETE /api/activities/:id - Non-existent activity", "PASS", "Correctly returned 404")
        else:
            self.log_test("DELETE /api/activities/:id - Non-existent activity", "FAIL", f"Expected 404, got {response.status_code if response else 'No response'}")
    
    def test_news_videos_endpoints(self):
        """Test all news videos endpoints with validation"""
        print("🎥 Testing News Videos Endpoints...")
        
        # Test GET news videos (initially empty)
        response, success, error = self.make_request('GET', 'news-videos')
        if success and response.status_code == 200:
            try:
                data = response.json()
                if data.get('success') and isinstance(data.get('data'), list):
                    self.log_test("GET /api/news-videos - List videos", "PASS", f"Found {len(data['data'])} videos")
                else:
                    self.log_test("GET /api/news-videos - List videos", "FAIL", f"Invalid response structure: {data}")
            except json.JSONDecodeError:
                self.log_test("GET /api/news-videos - List videos", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET /api/news-videos - List videos", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test POST news video with valid data
        valid_video = {
            "title": "Noticias Semanales - Actividades Comunitarias",
            "video_id": "dQw4w9WgXcQ",  # Valid YouTube ID format
            "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            "week": "2024-W03"
        }
        
        response, success, error = self.make_request('POST', 'news-videos', valid_video)
        if success and response.status_code == 201:
            try:
                data = response.json()
                if data.get('success') and data.get('data', {}).get('id'):
                    video_id = data['data']['id']
                    self.created_videos.append(video_id)
                    self.log_test("POST /api/news-videos - Create video", "PASS", f"Created video with ID: {video_id}")
                else:
                    self.log_test("POST /api/news-videos - Create video", "FAIL", f"Invalid response: {data}")
            except json.JSONDecodeError:
                self.log_test("POST /api/news-videos - Create video", "FAIL", "Invalid JSON response")
        else:
            self.log_test("POST /api/news-videos - Create video", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test POST news video validation errors
        invalid_videos = [
            {"title": "", "video_id": "dQw4w9WgXcQ", "thumbnail": "https://example.com/thumb.jpg", "week": "2024-W04"},  # Empty title
            {"title": "Test", "video_id": "invalid", "thumbnail": "https://example.com/thumb.jpg", "week": "2024-W04"},  # Invalid video_id
            {"title": "Test", "video_id": "dQw4w9WgXcQ", "thumbnail": "invalid-url", "week": "2024-W04"},  # Invalid thumbnail URL
            {"title": "Test", "video_id": "dQw4w9WgXcQ", "thumbnail": "https://example.com/thumb.jpg", "week": "invalid"},  # Invalid week format
            {"title": "A" * 201, "video_id": "dQw4w9WgXcQ", "thumbnail": "https://example.com/thumb.jpg", "week": "2024-W04"},  # Title too long
        ]
        
        for i, invalid_video in enumerate(invalid_videos):
            response, success, error = self.make_request('POST', 'news-videos', invalid_video)
            if success and response.status_code == 400:
                try:
                    data = response.json()
                    if not data.get('success') and data.get('error'):
                        self.log_test(f"POST /api/news-videos - Validation error {i+1}", "PASS", f"Correctly rejected: {data.get('error')}")
                    else:
                        self.log_test(f"POST /api/news-videos - Validation error {i+1}", "FAIL", f"Invalid error response: {data}")
                except json.JSONDecodeError:
                    self.log_test(f"POST /api/news-videos - Validation error {i+1}", "FAIL", "Invalid JSON response")
            else:
                self.log_test(f"POST /api/news-videos - Validation error {i+1}", "FAIL", f"Expected 400, got {response.status_code if response else 'No response'}")
        
        # Test PUT news video (update)
        if self.created_videos:
            video_id = self.created_videos[0]
            update_data = {
                "title": "Noticias Semanales - Actividades Comunitarias (Actualizado)",
                "week": "2024-W05"
            }
            
            response, success, error = self.make_request('PUT', f'news-videos/{video_id}', update_data)
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    if data.get('success') and data.get('data', {}).get('title') == update_data['title']:
                        self.log_test("PUT /api/news-videos/:id - Update video", "PASS", "Video updated successfully")
                    else:
                        self.log_test("PUT /api/news-videos/:id - Update video", "FAIL", f"Update not reflected: {data}")
                except json.JSONDecodeError:
                    self.log_test("PUT /api/news-videos/:id - Update video", "FAIL", "Invalid JSON response")
            else:
                self.log_test("PUT /api/news-videos/:id - Update video", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test DELETE news video (soft delete)
        if self.created_videos:
            video_id = self.created_videos[0]
            
            response, success, error = self.make_request('DELETE', f'news-videos/{video_id}')
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    if data.get('success'):
                        self.log_test("DELETE /api/news-videos/:id - Soft delete", "PASS", "Video soft deleted successfully")
                    else:
                        self.log_test("DELETE /api/news-videos/:id - Soft delete", "FAIL", f"Delete failed: {data}")
                except json.JSONDecodeError:
                    self.log_test("DELETE /api/news-videos/:id - Soft delete", "FAIL", "Invalid JSON response")
            else:
                self.log_test("DELETE /api/news-videos/:id - Soft delete", "FAIL", f"Status: {response.status_code if response else 'No response'}")
    
    def test_contact_endpoints(self):
        """Test all contact endpoints with validation"""
        print("📧 Testing Contact Endpoints...")
        
        # Test POST contact message with valid data
        valid_message = {
            "name": "María González",
            "email": "maria.gonzalez@email.com",
            "subject": "Consulta sobre actividades para adultos mayores",
            "message": "Hola, me gustaría obtener más información sobre las actividades que ofrecen para adultos mayores en nuestra comunidad. ¿Podrían enviarme el horario y los requisitos?"
        }
        
        response, success, error = self.make_request('POST', 'contact', valid_message)
        if success and response.status_code == 201:
            try:
                data = response.json()
                if data.get('success') and data.get('data', {}).get('id'):
                    message_id = data['data']['id']
                    self.created_messages.append(message_id)
                    self.log_test("POST /api/contact - Submit message", "PASS", f"Created message with ID: {message_id}")
                else:
                    self.log_test("POST /api/contact - Submit message", "FAIL", f"Invalid response: {data}")
            except json.JSONDecodeError:
                self.log_test("POST /api/contact - Submit message", "FAIL", "Invalid JSON response")
        else:
            self.log_test("POST /api/contact - Submit message", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test POST contact validation errors
        invalid_messages = [
            {"name": "", "email": "test@email.com", "subject": "Test", "message": "Test"},  # Empty name
            {"name": "Test", "email": "invalid-email", "subject": "Test", "message": "Test"},  # Invalid email
            {"name": "Test", "email": "test@email.com", "subject": "", "message": "Test"},  # Empty subject
            {"name": "Test", "email": "test@email.com", "subject": "Test", "message": ""},  # Empty message
            {"name": "A" * 201, "email": "test@email.com", "subject": "Test", "message": "Test"},  # Name too long
            {"name": "Test", "email": "test@email.com", "subject": "A" * 301, "message": "Test"},  # Subject too long
            {"name": "Test", "email": "test@email.com", "subject": "Test", "message": "A" * 2001},  # Message too long
        ]
        
        for i, invalid_message in enumerate(invalid_messages):
            response, success, error = self.make_request('POST', 'contact', invalid_message)
            if success and response.status_code == 400:
                try:
                    data = response.json()
                    if not data.get('success') and data.get('error'):
                        self.log_test(f"POST /api/contact - Validation error {i+1}", "PASS", f"Correctly rejected: {data.get('error')}")
                    else:
                        self.log_test(f"POST /api/contact - Validation error {i+1}", "FAIL", f"Invalid error response: {data}")
                except json.JSONDecodeError:
                    self.log_test(f"POST /api/contact - Validation error {i+1}", "FAIL", "Invalid JSON response")
            else:
                self.log_test(f"POST /api/contact - Validation error {i+1}", "FAIL", f"Expected 400, got {response.status_code if response else 'No response'}")
        
        # Test GET contact messages (admin endpoint)
        response, success, error = self.make_request('GET', 'contact/messages')
        if success and response.status_code == 200:
            try:
                data = response.json()
                if data.get('success') and isinstance(data.get('data'), list) and 'pagination' in data:
                    self.log_test("GET /api/contact/messages - List messages", "PASS", f"Found {len(data['data'])} messages")
                else:
                    self.log_test("GET /api/contact/messages - List messages", "FAIL", f"Invalid response structure: {data}")
            except json.JSONDecodeError:
                self.log_test("GET /api/contact/messages - List messages", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET /api/contact/messages - List messages", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test GET contact messages with pagination
        response, success, error = self.make_request('GET', 'contact/messages', params={'page': 1, 'limit': 10})
        if success and response.status_code == 200:
            try:
                data = response.json()
                pagination = data.get('pagination', {})
                if pagination.get('page') == 1 and pagination.get('limit') == 10:
                    self.log_test("GET /api/contact/messages - Pagination", "PASS", f"Page {pagination.get('page')} of {pagination.get('pages')}")
                else:
                    self.log_test("GET /api/contact/messages - Pagination", "FAIL", f"Invalid pagination: {pagination}")
            except json.JSONDecodeError:
                self.log_test("GET /api/contact/messages - Pagination", "FAIL", "Invalid JSON response")
        else:
            self.log_test("GET /api/contact/messages - Pagination", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test GET specific contact message
        if self.created_messages:
            message_id = self.created_messages[0]
            
            response, success, error = self.make_request('GET', f'contact/messages/{message_id}')
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    if data.get('success') and data.get('data', {}).get('id') == message_id:
                        self.log_test("GET /api/contact/messages/:id - Get specific message", "PASS", "Message retrieved successfully")
                    else:
                        self.log_test("GET /api/contact/messages/:id - Get specific message", "FAIL", f"Invalid response: {data}")
                except json.JSONDecodeError:
                    self.log_test("GET /api/contact/messages/:id - Get specific message", "FAIL", "Invalid JSON response")
            else:
                self.log_test("GET /api/contact/messages/:id - Get specific message", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test PUT contact message status update
        if self.created_messages:
            message_id = self.created_messages[0]
            update_data = {"status": "replied"}
            
            response, success, error = self.make_request('PUT', f'contact/messages/{message_id}', update_data)
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    if data.get('success') and data.get('data', {}).get('status') == 'replied':
                        self.log_test("PUT /api/contact/messages/:id - Update status", "PASS", "Status updated to replied")
                    else:
                        self.log_test("PUT /api/contact/messages/:id - Update status", "FAIL", f"Status not updated: {data}")
                except json.JSONDecodeError:
                    self.log_test("PUT /api/contact/messages/:id - Update status", "FAIL", "Invalid JSON response")
            else:
                self.log_test("PUT /api/contact/messages/:id - Update status", "FAIL", f"Status: {response.status_code if response else 'No response'}")
        
        # Test PUT with invalid status
        if self.created_messages:
            message_id = self.created_messages[0]
            invalid_update = {"status": "invalid_status"}
            
            response, success, error = self.make_request('PUT', f'contact/messages/{message_id}', invalid_update)
            if success and response.status_code == 400:
                self.log_test("PUT /api/contact/messages/:id - Invalid status", "PASS", "Correctly rejected invalid status")
            else:
                self.log_test("PUT /api/contact/messages/:id - Invalid status", "FAIL", f"Expected 400, got {response.status_code if response else 'No response'}")
        
        # Test GET/PUT non-existent message
        fake_id = str(uuid.uuid4())
        response, success, error = self.make_request('GET', f'contact/messages/{fake_id}')
        if success and response.status_code == 404:
            self.log_test("GET /api/contact/messages/:id - Non-existent message", "PASS", "Correctly returned 404")
        else:
            self.log_test("GET /api/contact/messages/:id - Non-existent message", "FAIL", f"Expected 404, got {response.status_code if response else 'No response'}")
    
    def test_database_persistence(self):
        """Test database connectivity and data persistence"""
        print("💾 Testing Database Persistence...")
        
        # Create a test activity and verify it persists
        test_activity = {
            "week": 2,
            "title": "Test Database Persistence",
            "description": "This activity tests database persistence functionality"
        }
        
        # Create activity
        response, success, error = self.make_request('POST', 'activities', test_activity)
        if success and response.status_code == 201:
            activity_id = response.json().get('data', {}).get('id')
            if activity_id:
                self.created_activities.append(activity_id)
                
                # Wait a moment and retrieve it
                time.sleep(0.5)
                response, success, error = self.make_request('GET', 'activities')
                if success and response.status_code == 200:
                    activities = response.json().get('data', [])
                    found_activity = next((act for act in activities if act.get('id') == activity_id), None)
                    if found_activity and found_activity.get('title') == test_activity['title']:
                        self.log_test("Database Persistence - Create and Retrieve", "PASS", "Data persisted correctly")
                    else:
                        self.log_test("Database Persistence - Create and Retrieve", "FAIL", "Created activity not found in list")
                else:
                    self.log_test("Database Persistence - Create and Retrieve", "FAIL", "Failed to retrieve activities")
            else:
                self.log_test("Database Persistence - Create and Retrieve", "FAIL", "No activity ID returned")
        else:
            self.log_test("Database Persistence - Create and Retrieve", "FAIL", "Failed to create test activity")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Comprehensive Backend API Tests for Renace Mi Edad Dorada")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 80)
        
        try:
            self.test_base_endpoints()
            self.test_activities_endpoints()
            self.test_news_videos_endpoints()
            self.test_contact_endpoints()
            self.test_database_persistence()
            
            print("=" * 80)
            print("✅ All tests completed!")
            print(f"📊 Created resources: {len(self.created_activities)} activities, {len(self.created_videos)} videos, {len(self.created_messages)} messages")
            
        except Exception as e:
            print(f"❌ Test suite failed with error: {str(e)}")
            import traceback
            traceback.print_exc()

def main():
    """Main function to run the tests"""
    # Use the external URL from frontend/.env
    base_url = "https://node-express-migrate.preview.emergentagent.com"
    
    print(f"🔍 Testing Node.js Backend at: {base_url}")
    print("📋 This will test all endpoints for the Renace Mi Edad Dorada NGO application")
    print()
    
    tester = BackendTester(base_url)
    tester.run_all_tests()

if __name__ == "__main__":
    main()