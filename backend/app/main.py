from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import plants

app = FastAPI(
    title="Plant Care API",
    description="Plant Care API for managing plant care tasks",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(plants.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Plant Care API"}
