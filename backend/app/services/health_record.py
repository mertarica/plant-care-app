from app.database import health_records_collection
from app.schemas.health_record import HealthRecordCreate, HealthRecordInDB
from bson import ObjectId
from datetime import datetime, timedelta
from typing import List, Optional


async def create_health_record(record: HealthRecordCreate):
    record_dict = record.model_dump()
    record_dict["created_at"] = datetime.now()

    result = await health_records_collection.insert_one(record_dict)
    created_record = await health_records_collection.find_one({"_id": result.inserted_id})
    return created_record


async def get_plant_health_records(plant_id: str, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
    query = {"plant_id": plant_id}

    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = start_date
        if end_date:
            date_query["$lte"] = end_date

        if date_query:
            query["date"] = date_query

    records = await health_records_collection.find(query).sort("date", -1).to_list(1000)
    return records
