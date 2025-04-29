from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from bson import ObjectId

class HealthRecordBase(BaseModel):
    plant_id: str
    date: datetime = Field(default_factory=datetime.now)
    actual_rainfall: float
    actual_humidity: float
    health_score: float = Field(..., ge=0, le=100)

class HealthRecordCreate(HealthRecordBase):
    pass

class HealthRecordInDB(HealthRecordBase):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class HealthRecordResponse(HealthRecordBase):
    id: str
    created_at: datetime

    @field_validator("id", mode="before")
    def convert_objectid_to_str(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    class Config:
        populate_by_name = True