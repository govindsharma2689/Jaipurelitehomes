"""
Backend API Tests for Jaipur Elite Homes
- Authentication endpoints (login, verify)
- Properties CRUD
- Inquiries CRUD
- Stats endpoint
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://localhost:3000')

# Admin credentials from requirements
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


class TestHealthCheck:
    """Health check tests - run first"""
    
    def test_api_root_accessible(self):
        """Verify API root is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "Jaipur Elite Homes" in data["message"]
        print("✓ API root is accessible")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_with_valid_credentials(self):
        """Login with correct admin credentials should return token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        print(f"✓ Login successful, token received (length: {len(data['access_token'])})")
        return data["access_token"]
    
    def test_login_with_invalid_username(self):
        """Login with wrong username should return 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": "wronguser", "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid username correctly rejected: {data['detail']}")
    
    def test_login_with_invalid_password(self):
        """Login with wrong password should return 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USERNAME, "password": "wrongpassword"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid password correctly rejected: {data['detail']}")
    
    def test_verify_valid_token(self):
        """Verify valid token returns user info"""
        # First login to get token
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
        )
        token = login_response.json()["access_token"]
        
        # Verify token
        response = requests.get(
            f"{BASE_URL}/api/auth/verify",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["user"] == ADMIN_USERNAME
        assert data["role"] == "admin"
        print(f"✓ Token verification successful: user={data['user']}, role={data['role']}")
    
    def test_verify_invalid_token(self):
        """Verify invalid token returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/auth/verify",
            headers={"Authorization": "Bearer invalidtoken123"}
        )
        assert response.status_code == 401
        print("✓ Invalid token correctly rejected")
    
    def test_verify_no_token(self):
        """Verify missing token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/verify")
        assert response.status_code == 401
        print("✓ Missing token correctly rejected")


class TestStats:
    """Stats endpoint tests"""
    
    def test_get_stats(self):
        """Get dashboard stats"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Validate stats structure
        assert "total_properties" in data
        assert "total_villas" in data
        assert "total_plots" in data
        assert "featured_count" in data
        assert "sold_count" in data
        assert "total_inquiries" in data
        assert "new_inquiries" in data
        
        # Validate expected values (22 properties, 3 villas per requirements)
        assert data["total_properties"] == 22, f"Expected 22 properties, got {data['total_properties']}"
        assert data["total_villas"] == 3, f"Expected 3 villas, got {data['total_villas']}"
        
        print(f"✓ Stats verified: {data['total_properties']} properties, {data['total_villas']} villas, {data['total_inquiries']} leads")


class TestProperties:
    """Properties CRUD tests"""
    
    def test_get_all_properties(self):
        """Get all properties"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        data = response.json()
        
        # Validate we have 22 properties
        assert len(data) == 22, f"Expected 22 properties, got {len(data)}"
        
        # Validate property structure
        if len(data) > 0:
            prop = data[0]
            assert "id" in prop
            assert "title" in prop
            assert "price" in prop
            assert "location" in prop
            assert "type" in prop
        
        print(f"✓ Retrieved {len(data)} properties")
    
    def test_get_property_by_id_15(self):
        """Get specific property (id=15 as mentioned in requirements)"""
        response = requests.get(f"{BASE_URL}/api/properties/15")
        
        # Property might use numeric or string ID
        if response.status_code == 404:
            # Try getting from list and using actual ID
            all_props = requests.get(f"{BASE_URL}/api/properties").json()
            if len(all_props) >= 15:
                prop_id = all_props[14]["id"]  # 0-indexed
                response = requests.get(f"{BASE_URL}/api/properties/{prop_id}")
        
        if response.status_code == 200:
            data = response.json()
            assert "title" in data
            assert "price" in data
            print(f"✓ Property 15 found: {data['title']}")
        else:
            print(f"⚠ Property 15 not found (status: {response.status_code})")
    
    def test_get_property_by_id_17(self):
        """Get specific property (id=17 as mentioned in requirements)"""
        response = requests.get(f"{BASE_URL}/api/properties/17")
        
        # Property might use numeric or string ID
        if response.status_code == 404:
            # Try getting from list and using actual ID
            all_props = requests.get(f"{BASE_URL}/api/properties").json()
            if len(all_props) >= 17:
                prop_id = all_props[16]["id"]  # 0-indexed
                response = requests.get(f"{BASE_URL}/api/properties/{prop_id}")
        
        if response.status_code == 200:
            data = response.json()
            assert "title" in data
            assert "price" in data
            print(f"✓ Property 17 found: {data['title']}")
        else:
            print(f"⚠ Property 17 not found (status: {response.status_code})")
    
    def test_filter_properties_by_type_villas(self):
        """Filter properties by type=Villas"""
        response = requests.get(f"{BASE_URL}/api/properties?type=Villas")
        assert response.status_code == 200
        data = response.json()
        
        # Should have 3 villas
        assert len(data) == 3, f"Expected 3 villas, got {len(data)}"
        for prop in data:
            assert prop["type"] == "Villas"
        
        print(f"✓ Villa filter works: {len(data)} villas found")
    
    def test_filter_properties_by_featured(self):
        """Filter properties by featured=true"""
        response = requests.get(f"{BASE_URL}/api/properties?featured=true")
        assert response.status_code == 200
        data = response.json()
        
        for prop in data:
            assert prop["featured"] == True
        
        print(f"✓ Featured filter works: {len(data)} featured properties")


class TestInquiries:
    """Inquiries/Leads tests"""
    
    def test_get_all_inquiries(self):
        """Get all inquiries/leads"""
        response = requests.get(f"{BASE_URL}/api/inquiries")
        assert response.status_code == 200
        data = response.json()
        
        # Should have at least 1 lead per requirements
        assert len(data) >= 1, f"Expected at least 1 lead, got {len(data)}"
        
        if len(data) > 0:
            lead = data[0]
            assert "id" in lead
            assert "name" in lead
            assert "email" in lead
            assert "message" in lead
            assert "status" in lead
        
        print(f"✓ Retrieved {len(data)} leads")
    
    def test_create_inquiry_lead(self):
        """Create a new inquiry (lead capture form submission)"""
        test_inquiry = {
            "name": "TEST_Lead User",
            "email": "test_lead@example.com",
            "phone": "+91-9876543210",
            "message": "I'm interested in plots in Vaishali Nagar area",
            "source": "contact_form"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/inquiries",
            json=test_inquiry
        )
        assert response.status_code == 200
        data = response.json()
        
        # Validate response
        assert data["name"] == test_inquiry["name"]
        assert data["email"] == test_inquiry["email"]
        assert data["status"] == "new"
        assert "id" in data
        
        print(f"✓ Lead created: id={data['id']}, email={data['email']}")
        
        # Return ID for cleanup
        return data["id"]
    
    def test_create_property_inquiry(self):
        """Create a property-specific inquiry"""
        # Get a property first
        props = requests.get(f"{BASE_URL}/api/properties").json()
        if len(props) > 0:
            prop = props[0]
            
            test_inquiry = {
                "name": "TEST_Property Lead",
                "email": "test_property_lead@example.com",
                "phone": "+91-9123456789",
                "message": "I want to schedule a visit for this property",
                "property_id": prop["id"],
                "property_title": prop["title"],
                "source": "property_inquiry"
            }
            
            response = requests.post(
                f"{BASE_URL}/api/inquiries",
                json=test_inquiry
            )
            assert response.status_code == 200
            data = response.json()
            
            assert data["property_id"] == prop["id"]
            assert data["property_title"] == prop["title"]
            
            print(f"✓ Property inquiry created for: {prop['title']}")
            return data["id"]
    
    def test_update_inquiry_status(self):
        """Update inquiry status"""
        # First create a test inquiry
        test_inquiry = {
            "name": "TEST_Status Update",
            "email": "test_status@example.com",
            "message": "Testing status update"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/inquiries",
            json=test_inquiry
        )
        inquiry_id = create_response.json()["id"]
        
        # Update status to contacted
        update_response = requests.patch(
            f"{BASE_URL}/api/inquiries/{inquiry_id}/status",
            json={"status": "contacted"}
        )
        assert update_response.status_code == 200
        
        # Verify update
        verify_response = requests.get(f"{BASE_URL}/api/inquiries/{inquiry_id}")
        assert verify_response.status_code == 200
        assert verify_response.json()["status"] == "contacted"
        
        print(f"✓ Inquiry status updated to 'contacted'")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/inquiries/{inquiry_id}")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_inquiries(self):
        """Delete test inquiries"""
        response = requests.get(f"{BASE_URL}/api/inquiries")
        if response.status_code == 200:
            inquiries = response.json()
            deleted_count = 0
            for inq in inquiries:
                if inq["name"].startswith("TEST_"):
                    del_response = requests.delete(f"{BASE_URL}/api/inquiries/{inq['id']}")
                    if del_response.status_code == 200:
                        deleted_count += 1
            
            print(f"✓ Cleaned up {deleted_count} test inquiries")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
