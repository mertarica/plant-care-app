from app.database import plants_collection
from app.models.plant import PlantCreate, PlantUpdate
from bson import ObjectId
from datetime import datetime
from typing import List, Optional


async def get_all_plants():
    plants = await plants_collection.find().to_list(1000)
    return plants


async def get_plant_by_id(plant_id: str):
    if not ObjectId.is_valid(plant_id):
        return None
    plant = await plants_collection.find_one({"_id": ObjectId(plant_id)})
    return plant


async def create_plant(plant: PlantCreate):
    plant_dict = plant.model_dump()
    plant_dict["created_at"] = datetime.now()
    plant_dict["updated_at"] = datetime.now()

    result = await plants_collection.insert_one(plant_dict)
    created_plant = await plants_collection.find_one({"_id": result.inserted_id})
    return created_plant


async def update_plant(plant_id: str, plant_update: PlantUpdate):
    if not ObjectId.is_valid(plant_id):
        return None

    update_data = {k: v for k, v in plant_update.model_dump().items()
                   if v is not None}
    if not update_data:
        return await get_plant_by_id(plant_id)

    update_data["updated_at"] = datetime.now()

    await plants_collection.update_one(
        {"_id": ObjectId(plant_id)},
        {"$set": update_data}
    )

    return await get_plant_by_id(plant_id)


async def delete_plant(plant_id: str):
    if not ObjectId.is_valid(plant_id):
        return False

    delete_result = await plants_collection.delete_one({"_id": ObjectId(plant_id)})
    return delete_result.deleted_count > 0
