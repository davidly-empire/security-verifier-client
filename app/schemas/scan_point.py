from pydantic import BaseModel
from typing import Optional

# ---------------------------
# For creating a scan point
# ---------------------------
class ScanPointCreate(BaseModel):
    factory_id: str
    scan_point_name: str
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str]

# ---------------------------
# For updating a scan point (all fields optional)
# ---------------------------
class ScanPointUpdate(BaseModel):
    factory_id: Optional[str]
    scan_point_name: Optional[str]
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str]

# ---------------------------
# For API responses
# ---------------------------
class ScanPointResponse(BaseModel):
    id: str
    factory_id: str
    scan_point_name: str
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str]

    class Config:
        from_attributes = True  # Updated for Pydantic v2
