from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PlantBase(BaseModel):
    name: str
    type: str
    weekly_water_need: float = Field(..., gt=0)
    expected_humidity: float = Field(..., ge=0, le=100)
    location: str

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    weekly_water_need: Optional[float] = Field(None, gt=0)
    expected_humidity: Optional[float] = Field(None, ge=0, le=100)
    location: Optional[str] = None

class PlantResponse(PlantBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    @field_validator("id", mode="before")
    def convert_objectid_to_str(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    model_config = {
        "populate_by_name": True
    }