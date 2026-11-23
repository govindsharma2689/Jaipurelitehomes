from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import PlainTextResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta, timezone
import shutil
from jose import JWTError, jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'jaipur_elite_homes')]

# JWT Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Admin credentials (from environment)
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Create the main app without a prefix
app = FastAPI(title="Jaipur Elite Homes API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Ensure upload directory exists
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Production URL for SEO
SITE_URL = os.environ.get('SITE_URL', 'https://jaipurelitehomes.com')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Helper function to generate SEO-friendly slugs
def generate_slug(title: str, location: str, property_type: str, property_id: str) -> str:
    """Generate SEO-friendly slug from property details"""
    # Combine title, location, and type for a descriptive slug
    text = f"{property_type}-{title}-{location}".lower()
    # Remove special characters and replace spaces with hyphens
    slug = re.sub(r'[^\w\s-]', '', text)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    # Add property ID at the end for uniqueness
    return f"{slug}-{property_id}"


# Authentication Models
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = JWT_EXPIRATION_HOURS * 3600


# Auth helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=JWT_EXPIRATION_HOURS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return payload


# Define Models
class PropertyBase(BaseModel):
    title: str
    location: str
    area: str
    city: str = "Jaipur"
    price: str
    description: str
    full_description: Optional[str] = None
    type: str  # "Plot", "Villas", "House", "Apartment", "Shop", "Office", "Projects"
    category: Optional[str] = "Residential"  # "Residential", "Commercial", "Agriculture"
    sub_category: Optional[str] = None  # For Projects: "Residential Townships", "Plotting Projects", etc.
    featured: bool = False
    status: str = "Sales"  # "Sales" or "Rentals"
    sold: bool = False
    image: Optional[str] = None
    images: Optional[List[str]] = []
    map_link: Optional[str] = None
    amenities: Optional[List[str]] = []


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    price: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
    sold: Optional[bool] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    map_link: Optional[str] = None
    amenities: Optional[List[str]] = None


class Property(PropertyBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    city: Optional[str] = None
    subject: Optional[str] = None
    message: str
    property_id: Optional[str] = None
    property_title: Optional[str] = None
    source: str = "contact_form"  # contact_form, property_inquiry, schedule_meeting
    status: str = "new"  # new, contacted, converted, closed
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContactInquiryCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    city: Optional[str] = None
    subject: Optional[str] = None
    message: str
    property_id: Optional[str] = None
    property_title: Optional[str] = None
    source: Optional[str] = "contact_form"


class LeadStatusUpdate(BaseModel):
    status: str  # new, contacted, converted, closed


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# API Routes
@api_router.get("/")
async def root():
    return {"message": "Jaipur Elite Homes API", "status": "running"}


# Authentication Routes
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """Login with username and password to get access token"""
    if login_data.username != ADMIN_USERNAME or login_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": login_data.username, "role": "admin"})
    return TokenResponse(access_token=access_token)


@api_router.get("/auth/verify")
async def verify_auth(current_user: dict = Depends(get_current_user)):
    """Verify if the current token is valid"""
    return {"valid": True, "user": current_user.get("sub"), "role": current_user.get("role")}


@api_router.post("/auth/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """Change admin password - requires authentication"""
    global ADMIN_PASSWORD
    
    # Verify current password
    if password_data.current_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    
    if password_data.current_password == password_data.new_password:
        raise HTTPException(status_code=400, detail="New password must be different from current password")
    
    # Update password in memory
    ADMIN_PASSWORD = password_data.new_password
    
    # Also update in environment file for persistence
    try:
        env_path = ROOT_DIR / '.env'
        with open(env_path, 'r') as f:
            lines = f.readlines()
        
        with open(env_path, 'w') as f:
            for line in lines:
                if line.startswith('ADMIN_PASSWORD='):
                    f.write(f'ADMIN_PASSWORD="{password_data.new_password}"\n')
                else:
                    f.write(line)
        
        logger.info(f"Admin password changed by user: {current_user.get('sub')}")
    except Exception as e:
        logger.error(f"Failed to persist password change: {e}")
    
    return {"message": "Password changed successfully"}


# Properties CRUD
@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    featured: Optional[bool] = None,
    area: Optional[str] = None,
    sold: Optional[bool] = None,
    limit: int = 100
):
    query = {}
    if type:
        query["type"] = type
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    if featured is not None:
        query["featured"] = featured
    if area:
        query["area"] = {"$regex": area, "$options": "i"}
    if sold is not None:
        query["sold"] = sold
    
    properties = await db.properties.find(query).sort("created_at", -1).to_list(limit)
    result = []
    for prop in properties:
        property_obj = Property(**prop)
        # Generate slug if not present
        if not property_obj.slug:
            property_obj.slug = generate_slug(
                property_obj.title, 
                property_obj.location, 
                property_obj.type,
                str(property_obj.id)
            )
        result.append(property_obj)
    return result


@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    # Try to find by id field first
    property = await db.properties.find_one({"id": property_id})
    if not property:
        # Also try numeric id for backward compatibility
        try:
            numeric_id = int(property_id)
            property = await db.properties.find_one({"id": numeric_id})
        except ValueError:
            pass
    if not property:
        # Try finding by slug (check if property_id ends with a valid id pattern)
        all_props = await db.properties.find().to_list(100)
        for prop in all_props:
            prop_slug = generate_slug(prop.get('title', ''), prop.get('location', ''), prop.get('type', ''), str(prop.get('id', '')))
            if prop_slug == property_id or property_id.endswith(f"-{prop.get('id')}"):
                property = prop
                break
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    property_obj = Property(**property)
    # Generate slug if not present
    if not property_obj.slug:
        property_obj.slug = generate_slug(
            property_obj.title, 
            property_obj.location, 
            property_obj.type,
            str(property_obj.id)
        )
    return property_obj


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
        # Try numeric id
        try:
            numeric_id = int(property_id)
            existing = await db.properties.find_one({"id": numeric_id})
        except ValueError:
            pass
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = {k: v for k, v in property_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.properties.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated = await db.properties.find_one({"id": existing["id"]})
    return Property(**updated)


@api_router.patch("/properties/{property_id}/sold")
async def mark_property_sold(property_id: str, sold: bool = True):
    """Mark a property as sold or unsold"""
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        try:
            numeric_id = int(property_id)
            existing = await db.properties.find_one({"id": numeric_id})
        except ValueError:
            pass
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    await db.properties.update_one(
        {"id": existing["id"]},
        {"$set": {"sold": sold, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": f"Property marked as {'sold' if sold else 'available'}"}


@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        # Try numeric id
        try:
            numeric_id = int(property_id)
            result = await db.properties.delete_one({"id": numeric_id})
        except ValueError:
            pass
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


# Contact Inquiries / Leads
@api_router.post("/inquiries", response_model=ContactInquiry)
async def create_inquiry(inquiry: ContactInquiryCreate):
    inquiry_dict = inquiry.dict()
    inquiry_obj = ContactInquiry(**inquiry_dict)
    await db.inquiries.insert_one(inquiry_obj.dict())
    logger.info(f"New inquiry created: {inquiry_obj.id} from {inquiry_obj.email}")
    return inquiry_obj


@api_router.get("/inquiries", response_model=List[ContactInquiry])
async def get_inquiries(
    status: Optional[str] = None,
    source: Optional[str] = None,
    limit: int = 100
):
    query = {}
    if status:
        query["status"] = status
    if source:
        query["source"] = source
    
    inquiries = await db.inquiries.find(query).sort("created_at", -1).to_list(limit)
    return [ContactInquiry(**inq) for inq in inquiries]


@api_router.get("/inquiries/{inquiry_id}", response_model=ContactInquiry)
async def get_inquiry(inquiry_id: str):
    inquiry = await db.inquiries.find_one({"id": inquiry_id})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return ContactInquiry(**inquiry)


@api_router.patch("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status_update: LeadStatusUpdate):
    """Update the status of a lead/inquiry"""
    existing = await db.inquiries.find_one({"id": inquiry_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": status_update.status}}
    )
    
    return {"message": f"Inquiry status updated to {status_update.status}"}


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
    total_houses = await db.properties.count_documents({"type": "House"})
    total_apartments = await db.properties.count_documents({"type": "Apartment"})
    total_shops = await db.properties.count_documents({"type": "Shop"})
    total_offices = await db.properties.count_documents({"type": "Office"})
    total_projects = await db.properties.count_documents({"type": "Projects"})
    featured_count = await db.properties.count_documents({"featured": True})
    sold_count = await db.properties.count_documents({"sold": True})
    total_inquiries = await db.inquiries.count_documents({})
    new_inquiries = await db.inquiries.count_documents({"status": "new"})
    
    return {
        "total_properties": total_properties,
        "total_villas": total_villas,
        "total_plots": total_plots,
        "total_houses": total_houses,
        "total_apartments": total_apartments,
        "total_shops": total_shops,
        "total_offices": total_offices,
        "total_projects": total_projects,
        "featured_count": featured_count,
        "sold_count": sold_count,
        "total_inquiries": total_inquiries,
        "new_inquiries": new_inquiries
    }


# Seed data endpoint (for initial migration)
@api_router.post("/seed-properties")
async def seed_properties(properties: List[PropertyCreate]):
    """Seed multiple properties at once"""
    created = []
    for prop_data in properties:
        property_dict = prop_data.dict()
        property_obj = Property(**property_dict)
        await db.properties.insert_one(property_obj.dict())
        created.append(property_obj)
    return {"message": f"Created {len(created)} properties", "count": len(created)}


# SEO Endpoints
@api_router.get("/seo/robots.txt", response_class=PlainTextResponse)
async def get_robots():
    """Generate robots.txt"""
    robots_content = f"""# Robots.txt for Jaipur Elite Homes
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Sitemap
Sitemap: {SITE_URL}/api/seo/sitemap.xml

# Crawl-delay
Crawl-delay: 1
"""
    return robots_content


@api_router.get("/seo/sitemap.xml")
async def get_sitemap():
    """Generate dynamic XML sitemap"""
    properties = await db.properties.find().to_list(1000)
    
    # Build sitemap XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Static pages
    static_pages = [
        {'loc': '/', 'changefreq': 'daily', 'priority': '1.0'},
        {'loc': '/properties', 'changefreq': 'daily', 'priority': '0.9'},
        {'loc': '/contact', 'changefreq': 'monthly', 'priority': '0.7'},
    ]
    
    for page in static_pages:
        xml_content += f'''  <url>
    <loc>{SITE_URL}{page['loc']}</loc>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>\n'''
    
    # Property pages with SEO-friendly slugs
    for prop in properties:
        slug = generate_slug(prop.get('title', ''), prop.get('location', ''), prop.get('type', ''), str(prop.get('id', '')))
        updated_at = prop.get('updated_at', datetime.utcnow())
        if isinstance(updated_at, str):
            lastmod = updated_at[:10]
        else:
            lastmod = updated_at.strftime('%Y-%m-%d')
        
        xml_content += f'''  <url>
    <loc>{SITE_URL}/property/{slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n'''
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")


# Site Settings (Cover Page / Hero Section)
class HeroSettings(BaseModel):
    title: str = "Jaipur Elite Homes"
    subtitle: str = "Where Dreams Meet Luxury"
    description: str = "We have 15+ years of experience in real estate. We are recognized for exceeding client expectations and delivering great results through dedication, ease of process, and extraordinary services to our clients."
    images: List[str] = []
    stats: Optional[List[dict]] = None


@api_router.get("/site-settings/hero")
async def get_hero_settings():
    settings = await db.site_settings.find_one({"key": "hero"}, {"_id": 0})
    if not settings:
        return {
            "key": "hero",
            "title": "Jaipur Elite Homes",
            "subtitle": "Where Dreams Meet Luxury",
            "description": "We have 15+ years of experience in real estate. We are recognized for exceeding client expectations and delivering great results through dedication, ease of process, and extraordinary services to our clients.",
            "images": [
                "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1920&q=80"
            ]
        }
    return settings


@api_router.put("/site-settings/hero")
async def update_hero_settings(settings: HeroSettings):
    update_data = settings.dict()
    update_data["key"] = "hero"
    await db.site_settings.update_one(
        {"key": "hero"},
        {"$set": update_data},
        upsert=True
    )
    return {"message": "Hero settings updated successfully"}


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
