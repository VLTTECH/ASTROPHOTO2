from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
import os
from app.services.celestial import CelestialMath
from app.services.astrometry import AstrometryService

app = FastAPI(title="VLTTECH API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "/app/data/settings.json"

def get_db():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_db(data):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

class CityRequest(BaseModel):
    city_name: str

class TargetRequest(BaseModel):
    target_name: str
    lat: float
    lon: float

class PlateSolveRequest(BaseModel):
    api_key: str
    target_ra: float
    target_dec: float
    mag_dec: float

@app.get("/api/settings")
def load_settings():
    return get_db()

@app.post("/api/settings")
def update_settings(req: dict):
    save_db(req)
    return {"status": "saved"}

@app.post("/api/location/search")
def search_location(req: CityRequest):
    data = CelestialMath.get_city_location(req.city_name)
    if isinstance(data, dict) and "error" in data:
        raise HTTPException(status_code=500, detail=data["error"])
    if not data:
        raise HTTPException(status_code=404, detail="City not found")
    return data

@app.post("/api/target/calculate")
def calculate_target(req: TargetRequest):
    data = CelestialMath.get_target_coordinates(req.target_name, req.lat, req.lon)
    if isinstance(data, dict) and "error" in data:
        raise HTTPException(status_code=500, detail=data["error"])
    if not data:
        raise HTTPException(status_code=404, detail="Target not found in Simbad")
    return data

@app.post("/api/hardware/platesolve")
def platesolve(req: PlateSolveRequest):
    # Mocking capture integration
    astro = AstrometryService(req.api_key)
    result = astro.upload_and_solve("/tmp/mock.jpg")
    
    correction = CelestialMath.calculate_equatorial_correction(
        result["solved_ra"], result["solved_dec"], req.target_ra, req.target_dec, req.mag_dec
    )
    
    return {
        "solved_position": result,
        "correction": correction
    }

@app.get("/api/hardware/scan")
def scan_hardware():
    return {
        "dslr": [{"id": "mock_dslr_1", "name": "Canon EOS 60D (Mock)"}],
        "webcams": [{"id": "mock_webcam_1", "name": "Logitech C920 (Mock)"}]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
