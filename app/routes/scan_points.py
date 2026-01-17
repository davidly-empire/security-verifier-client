from fastapi import APIRouter, HTTPException, status
from app.database import supabase
from app.schemas.scan_point import ScanPointCreate, ScanPointUpdate, ScanPointResponse

router = APIRouter(
    prefix="/scan-points",
    tags=["Scan Points"]
)

# ---------------------------
# CREATE scan point
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=ScanPointResponse)
def create_scan_point(payload: ScanPointCreate):
    # Check if factory exists
    factory = supabase.table("factories").select("factory_code").eq("factory_code", payload.factory_id).execute()
    if not factory.data or len(factory.data) == 0:
        raise HTTPException(status_code=404, detail="Factory not found")

    # Check duplicate name
    existing = supabase.table("scan_points").select("*").eq("scan_point_name", payload.scan_point_name).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Scan Point with this name already exists")

    insert_data = {
        "factory_id": payload.factory_id,
        "scan_point_name": payload.scan_point_name,
        "scan_point_code": getattr(payload, "scan_point_code", payload.scan_point_name),
        "location": getattr(payload, "location", None),
        "scan_type": getattr(payload, "scan_type", None),
        "floor": getattr(payload, "floor", None),
        "area": getattr(payload, "area", None),
        "risk_level": getattr(payload, "risk_level", None)
    }

    # Insert and return the inserted row
    result = supabase.table("scan_points").insert(insert_data).select("*").execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create scan point")

    return result.data[0]


# ---------------------------
# GET all scan points
# ---------------------------
@router.get("", response_model=list[ScanPointResponse])
def get_scan_points():
    result = supabase.table("scan_points").select("*").execute()
    if result.data is None:
        raise HTTPException(status_code=500, detail="Failed to fetch scan points")
    return result.data


# ---------------------------
# GET scan point by ID
# ---------------------------
@router.get("/{scan_point_id}", response_model=ScanPointResponse)
def get_scan_point(scan_point_id: str):
    result = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Scan Point not found")
    return result.data[0]


# ---------------------------
# UPDATE scan point
# ---------------------------
@router.put("/{scan_point_id}", response_model=ScanPointResponse)
def update_scan_point(scan_point_id: str, payload: ScanPointUpdate):
    # Check if scan point exists
    existing = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(status_code=404, detail="Scan Point not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    result = supabase.table("scan_points").update(update_data).eq("id", scan_point_id).select("*").execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update scan point")

    return result.data[0]


# ---------------------------
# DELETE scan point
# ---------------------------
@router.delete("/{scan_point_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan_point(scan_point_id: str):
    existing = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(status_code=404, detail="Scan Point not found")

    supabase.table("scan_points").delete().eq("id", scan_point_id).execute()
    return None
