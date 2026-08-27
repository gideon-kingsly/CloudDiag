from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ping import router as ping_router
from app.dns import router as dns_router
from app.port import router as port_router
from app.website import router as website_router
from app.history import router as history_router

from app.database import engine
from app.models import Base


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CloudDiag API",
    version="1.0.0"
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(ping_router)
app.include_router(dns_router)
app.include_router(port_router)
app.include_router(website_router)
app.include_router(history_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to CloudDiag API"
    }