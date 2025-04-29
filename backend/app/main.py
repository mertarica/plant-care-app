from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import plants

app = FastAPI(
    title="Plant Care API",
    description="Plant Care API for managing plant care tasks",
    version="0.1.0"
)

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:80",
    "http://frontend",
    "http://frontend:80"
]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(plants.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Plant Care API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
