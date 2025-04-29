from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from datetime import datetime

from app.models.plant import PlantCreate, PlantUpdate, PlantResponse
from app.models.health_record import HealthRecordResponse, HealthRecordCreate
from app.services import plant as plant_service
from app.services import weather as weather_service
from app.services import health_record as health_service

router = APIRouter(prefix="/plants", tags=["plants"])


@router.get("/", response_model=List[PlantResponse])
async def get_plants():
    """Returns all plants"""
    plants = await plant_service.get_all_plants()
    return plants


@router.get("/{plant_id}", response_model=PlantResponse)
async def get_plant(plant_id: str):
    """Returns a plant by ID"""
    plant = await plant_service.get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


@router.post("/", response_model=PlantResponse, status_code=201)
async def create_plant(plant: PlantCreate):
    """Creates a new plant"""
    created_plant = await plant_service.create_plant(plant)
    return created_plant


@router.put("/{plant_id}", response_model=PlantResponse)
async def update_plant(plant_id: str, plant_update: PlantUpdate):
    """Updates an existing plant"""
    updated_plant = await plant_service.update_plant(plant_id, plant_update)
    if not updated_plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return updated_plant


@router.delete("/{plant_id}", status_code=204)
async def delete_plant(plant_id: str):
    """Deletes a plant"""
    deleted = await plant_service.delete_plant(plant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Plant not found")
    return None


@router.get("/{plant_id}/health", response_model=List[HealthRecordResponse])
async def get_plant_health_history(
    plant_id: str,
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None)
):
    """Returns the health history of a plant"""
    # First check if the plant exists
    plant = await plant_service.get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    health_records = await health_service.get_plant_health_records(
        plant_id=plant_id,
        start_date=start_date,
        end_date=end_date
    )

    return health_records


@router.post("/{plant_id}/health/calculate", response_model=HealthRecordResponse)
async def calculate_plant_health(plant_id: str):
    """Calculates and records the current health status of a plant"""
    plant = await plant_service.get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    health_data = await weather_service.calculate_plant_health(
        weekly_water_need=plant["weekly_water_need"],
        expected_humidity=plant["expected_humidity"],
        location=plant["location"]
    )

    # Create health record
    health_record = HealthRecordCreate(
        plant_id=plant_id,
        date=health_data["date"],
        actual_rainfall=health_data["actual_precipitation"],
        actual_humidity=health_data["actual_humidity"],
        health_score=health_data["health_score"]
    )

    # Save record to database
    created_record = await health_service.create_health_record(health_record)

    return created_record
