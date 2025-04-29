from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from datetime import datetime

from app.schemas.plant import PlantCreate, PlantUpdate, PlantResponse
from app.services import plant as plant_service

router = APIRouter(prefix="/plants", tags=["plants"])


@router.get("/", response_model=List[PlantResponse], response_model_by_alias=False)
async def get_plants():
    """Returns all plants"""
    plants = await plant_service.get_all_plants()
    return plants


@router.get("/search", response_model=List[PlantResponse], response_model_by_alias=False)
async def search_plants_endpoint(
    q: str = Query(None, description="Search term"),
):
    plants = await plant_service.search_plants(search_term=q)
    return plants


@router.get("/{plant_id}", response_model=PlantResponse, response_model_by_alias=False)
async def get_plant(plant_id: str):
    """Returns a plant by ID"""
    plant = await plant_service.get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


@router.post("/", response_model=PlantResponse, response_model_by_alias=False, status_code=201)
async def create_plant(plant: PlantCreate):
    """Creates a new plant"""
    created_plant = await plant_service.create_plant(plant)
    return created_plant


@router.patch("/{plant_id}", response_model=PlantResponse, response_model_by_alias=False)
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
