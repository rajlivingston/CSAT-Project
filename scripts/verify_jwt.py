
import sys
import os
import requests
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Ensure we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.main import app
from app.auth import create_token

client = TestClient(app)

def verify_jwt_flow():
    print("Verifying JWT Auth Flow...")
    
    # 1. Test Login to get token
    print("\n1. Testing Login...")
    login_payload = {"username": "admin", "password": "admin"}
    response = client.post("/admin/login", json=login_payload) # Assuming prefix is /admin or route is attached appropriately
    
    # Route discovery check: admin routes might be prefixed or not.
    # checking main.py content might be useful, but let's try direct first.
    # The previous admin.py showed router = APIRouter(). 
    # If main.py includes it with prefix, we need to know.
    # Let's assume standard /login or /admin/login. 
    # If 404, we'll debug.
    
    if response.status_code == 404:
        # Try without /admin prefix
        response = client.post("/login", json=login_payload)

    if response.status_code != 200:
        print(f"Login failed: {response.status_code} - {response.text}")
        return

    data = response.json()
    token = data.get("access_token")
    print(f"Login successful. Token received: {token[:10]}...")
    
    # 2. Test Report Access with Token
    print("\n2. Testing Report Access (Authenticated)...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Again check prefix
    report_response = client.get("/report", headers=headers) # Assuming reports router is included
    if report_response.status_code == 404:
       report_response = client.get("/admin/report", headers=headers)
       
    if report_response.status_code == 200:
        print("Report access successful!")
        print(report_response.json())
    else:
        print(f"Report access failed: {report_response.status_code} - {report_response.text}")

    # 3. Test Report Access without Token
    print("\n3. Testing Report Access (Unauthenticated)...")
    unauth_response = client.get("/report") 
    if unauth_response.status_code == 404:
        unauth_response = client.get("/admin/report")
        
    if unauth_response.status_code == 401:
        print("Unauthenticated access correctly denied (401).")
    else:
        print(f"Unexpected status for unauthenticated access: {unauth_response.status_code}")

if __name__ == "__main__":
    verify_jwt_flow()
