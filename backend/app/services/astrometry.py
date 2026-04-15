import os
import requests
import time

class AstrometryService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://nova.astrometry.net/api"
        self.session_token = None

    def login(self):
        try:
            r = requests.post(f"{self.base_url}/login", data={"request-json": f'{{"apikey": "{self.api_key}"}}'})
            if r.status_code == 200:
                resp = r.json()
                if resp.get("status") == "success":
                    self.session_token = resp.get("session")
                    return True
        except Exception:
            pass
        return False
        
    def upload_and_solve(self, file_path: str):
        """Mock method for MVP. Real one would upload multipart form-data to astrometry."""
        if not self.session_token:
            self.login()
            
        print(f"Submitting {file_path} to Astrometry...")
        time.sleep(2) # simulate network
        
        # Returning mock solved coordinates for testing (e.g. slightly off M42)
        return {
            "status": "success",
            "solved_ra": 83.9,
            "solved_dec": -5.5
        }
