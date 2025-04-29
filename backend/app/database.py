from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongo:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "plant_care_db")

client = AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]

# Collection referansları
plants_collection = database.plants
health_records_collection = database.health_records