from pydantic import BaseModel
from typing import Optional

# Request model
class FactoryCreate(BaseModel):
    factory_code: str   # now primary key
    factory_name: str
    location: Optional[str] = None

# Response model
class FactoryResponse(BaseModel):
    factory_code: str   # primary key
    factory_name: str
    location: Optional[str] = None
    is_active: Optional[bool] = True
    created_at: Optional[str] = None
