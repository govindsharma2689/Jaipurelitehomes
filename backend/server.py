from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import shutil
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Jaipur Elite Homes API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Ensure upload directory exists
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


# Define Models
class PropertyBase(BaseModel):
    title: str
    location: str
    area: str
    city: str = "Jaipur"
    price: str
    description: str
    type: str  # "Villas" or "Plot"
    featured: bool = False
    status: str = "Sales"  # "Sales" or "Rentals"
    image: Optional[str] = None
    images: Optional[List[str]] = []
    images_count: int = 1


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    price: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    images_count: Optional[int] = None


class Property(PropertyBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    property_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContactInquiryCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    property_id: Optional[str] = None


# API Routes
@api_router.get("/")
async def root():
    return {"message": "Jaipur Elite Homes API", "status": "running"}


# Properties CRUD
@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    type: Optional[str] = None,
    status: Optional[str] = None,
    featured: Optional[bool] = None,
    area: Optional[str] = None,
    limit: int = 100
):
    query = {}
    if type:
        query["type"] = type
    if status:
        query["status"] = status
    if featured is not None:
        query["featured"] = featured
    if area:
        query["area"] = {"$regex": area, "$options": "i"}
    
    properties = await db.properties.find(query).sort("created_at", -1).to_list(limit)
    return [Property(**prop) for prop in properties]


@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    property = await db.properties.find_one({"id": property_id})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return Property(**property)


@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    property_dict = property_data.dict()
    property_obj = Property(**property_dict)
    await db.properties.insert_one(property_obj.dict())
    return property_obj


@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, property_update: PropertyUpdate):
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = {k: v for k, v in property_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.properties.update_one(
        {"id": property_id},
        {"$set": update_data}
    )
    
    updated = await db.properties.find_one({"id": property_id})
    return Property(**updated)


@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}


# Image Upload
@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL path
    return {"url": f"/api/images/{unique_filename}", "filename": unique_filename}


@api_router.get("/images/{filename}")
async def get_image(filename: str):
    from fastapi.responses import FileResponse
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)


# Contact Inquiries
@api_router.post("/inquiries", response_model=ContactInquiry)
async def create_inquiry(inquiry: ContactInquiryCreate):
    inquiry_dict = inquiry.dict()
    inquiry_obj = ContactInquiry(**inquiry_dict)
    await db.inquiries.insert_one(inquiry_obj.dict())
    return inquiry_obj


@api_router.get("/inquiries", response_model=List[ContactInquiry])
async def get_inquiries(limit: int = 100):
    inquiries = await db.inquiries.find().sort("created_at", -1).to_list(limit)
    return [ContactInquiry(**inq) for inq in inquiries]


@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted successfully"}


# Dashboard Stats
@api_router.get("/stats")
async def get_stats():
    total_properties = await db.properties.count_documents({})
    total_villas = await db.properties.count_documents({"type": "Villas"})
    total_plots = await db.properties.count_documents({"type": "Plot"})
    featured_count = await db.properties.count_documents({"featured": True})
    total_inquiries = await db.inquiries.count_documents({})
    
    return {
        "total_properties": total_properties,
        "total_villas": total_villas,
        "total_plots": total_plots,
        "featured_count": featured_count,
        "total_inquiries": total_inquiries
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
