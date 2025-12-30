"""
Script to migrate existing properties from mockData.js to MongoDB
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv('/app/backend/.env')

# Property data from mockData.js
PROPERTIES = [
    {
        "id": "1",
        "title": "Shikha Vihar, Jaipur",
        "location": "Shikha Vihar, Jaipur",
        "area": "Shikha Vihar",
        "city": "Jaipur",
        "price": "₹ 2.35 crore",
        "description": "This luxury villa located in the prestigious Shikha Vihar area offers an exceptional blend of comfort, modern design, and premium amenities. Built on a 20×60 (1200 sq ft) plot with excellent construction quality.",
        "type": "Villas",
        "featured": True,
        "status": "Sales",
        "images": [f"/images/properties/prop-1/image-{i}.png" if i != 5 else "/images/properties/prop-1/image-5.jpg" for i in range(1, 32)]
    },
    {
        "id": "2",
        "title": "Arihant Greens Colony, Near Mahima Panache",
        "location": "Arihant Greens Villa Scheme, Jaipur",
        "area": "Arihant Greens Villa Scheme",
        "city": "Jaipur",
        "price": "₹ 1.95 crore",
        "description": "A premium west-facing villa in Arihant Greens, offering modern living with spacious interiors and top-quality amenities. Perfect for families seeking comfort, elegance and connectivity.",
        "type": "Villas",
        "featured": True,
        "status": "Sales",
        "images": [
            "/images/properties/prop-2/image-1.jpg",
            "/images/properties/prop-2/image-2.jpg",
            "/images/properties/prop-2/image-3.png",
            "/images/properties/prop-2/image-4.jpg",
            "/images/properties/prop-2/image-5.png",
            "/images/properties/prop-2/image-6.jpg",
            "/images/properties/prop-2/image-7.jpg",
            "/images/properties/prop-2/image-8.jpg",
            "/images/properties/prop-2/image-9.png",
            "/images/properties/prop-2/image-10.png"
        ]
    },
    {
        "id": "3",
        "title": "Plot No. 17-A, Jai Ambe Colony, Tilawala, Jagatpura",
        "location": "Jagatpura, Jaipur",
        "area": "Jagatpura",
        "city": "Jaipur",
        "price": "₹ 1.25 crore",
        "description": "This residential plot located in Jai Ambe Colony, Tilawala, Jagatpura, offers an excellent opportunity for constructing a spacious modern home in one of Jaipur's fastest developing areas.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": ["/images/properties/default-plot.jpg"]
    },
    {
        "id": "4",
        "title": "Villa in Adinath Nagar",
        "location": "Sanganer, Jaipur",
        "area": "Sanganer",
        "city": "Jaipur",
        "price": "₹ 1.2 crore",
        "description": "This beautifully located villa in Adinath Nagar, Sanganer, offers comfortable and premium living in one of Jaipur's most connected areas. Situated near Airport Road.",
        "type": "Villas",
        "featured": True,
        "status": "Sales",
        "images": [
            "/images/properties/prop-4/image-1.jpg",
            "/images/properties/prop-4/image-2.png",
            "/images/properties/prop-4/image-3.png",
            "/images/properties/prop-4/image-4.png",
            "/images/properties/prop-4/image-5.png"
        ]
    },
    {
        "id": "5",
        "title": "Plot No. C-5, Scheme: Suman Enclave, Block H",
        "location": "Dantli, Sanganer, Suman Enclave, Jaipur",
        "area": "Suman Enclave",
        "city": "Jaipur",
        "price": "₹ 1.1 crore",
        "description": "This west-facing commercial plot is located in Suman Enclave, Block H, within the rapidly developing area of Village Dantli, Sanganer, Jaipur.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-5/image-1.png",
            "/images/properties/prop-5/image-2.png",
            "/images/properties/prop-5/image-3.jpg",
            "/images/properties/prop-5/image-4.png",
            "/images/properties/prop-5/image-5.png"
        ]
    },
    {
        "id": "6",
        "title": "Plot No. D-182, Scheme Mahal",
        "location": "Scheme Mahal, Jaipur",
        "area": "Scheme Mahal",
        "city": "Jaipur",
        "price": "₹ 86 lakh",
        "description": "This residential plot in Scheme Mahal offers an excellent opportunity for building a compact home or making a secure investment in a rapidly developing locality.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-6/image-1.png",
            "/images/properties/prop-6/image-2.png",
            "/images/properties/prop-6/image-3.jpg",
            "/images/properties/prop-6/image-4.png",
            "/images/properties/prop-6/image-5.png"
        ]
    },
    {
        "id": "7",
        "title": "Plot No. 411, Scheme: Mangalam City, Vatika",
        "location": "Mangalam City, Tonk Road, Vatika, Jaipur",
        "area": "Mangalam City",
        "city": "Jaipur",
        "price": "₹ 13.5 lakh",
        "description": "This east-facing residential plot is located in the well-developed Mangalam City, Vatika, along Tonk Road—one of Jaipur's most prominent and fast-growing corridors. Front road size: 30 ft.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-7/image-1.png",
            "/images/properties/prop-7/image-2.png",
            "/images/properties/prop-7/image-3.jpg",
            "/images/properties/prop-7/image-4.png",
            "/images/properties/prop-7/image-5.png"
        ]
    },
    {
        "id": "8",
        "title": "Plot No. 234, Ravindra Nagar",
        "location": "Ravindra Nagar, Jaipur",
        "area": "Ravindra Nagar",
        "city": "Jaipur",
        "price": "₹ 78,000 per sq. yard",
        "description": "A well-shaped residential plot in Ravindra Nagar, ideal for building a premium home. Located in a peaceful and developed neighborhood with easy access to daily amenities.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-8/image-1.png",
            "/images/properties/prop-8/image-2.png",
            "/images/properties/prop-8/image-3.jpg",
            "/images/properties/prop-8/image-4.png",
            "/images/properties/prop-8/image-5.png"
        ]
    },
    {
        "id": "9",
        "title": "Plot No. 166, Krishna Sagar Colony",
        "location": "Krishna Sagar Colony, Jaipur",
        "area": "Krishna Sagar Colony",
        "city": "Jaipur",
        "price": "₹ 75,000 per sq. yard",
        "description": "A premium residential plot located in the well-developed Krishna Sagar Colony, one of the most sought-after areas near Patrakar Colony, Jaipur.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-9/image-1.png",
            "/images/properties/prop-9/image-2.png",
            "/images/properties/prop-9/image-3.jpg",
            "/images/properties/prop-9/image-4.png",
            "/images/properties/prop-9/image-5.png"
        ]
    },
    {
        "id": "10",
        "title": "PLOT NO. 112 (NORTH PART), DWARKAPURI",
        "location": "Chak Getor, Dwarkapuri, Sanganer, Jaipur",
        "area": "Dwarkapuri",
        "city": "Jaipur",
        "price": "₹ 72,000 per sq. yard",
        "description": "This west-facing residential plot is located in the peaceful and developing locality of Dwarkapuri, Village Chak Getor, Sanganer, Jaipur.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-10/image-1.png",
            "/images/properties/prop-10/image-2.png",
            "/images/properties/prop-10/image-3.jpg",
            "/images/properties/prop-10/image-4.png",
            "/images/properties/prop-10/image-5.png"
        ]
    },
    {
        "id": "11",
        "title": "Plot No. 67, Gayatri Enclave, Goner Road",
        "location": "Gayatri Enclave, Goner Road, Jaipur",
        "area": "Goner Road",
        "city": "Jaipur",
        "price": "₹ 65,000 per sq. yard",
        "description": "Prime corner residential plot in Gayatri Enclave on Goner Road. Ideal for premium home construction with excellent connectivity and a wide open frontage.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-11/image-1.png",
            "/images/properties/prop-11/image-2.png",
            "/images/properties/prop-11/image-3.jpg",
            "/images/properties/prop-11/image-4.png",
            "/images/properties/prop-11/image-5.png"
        ]
    },
    {
        "id": "12",
        "title": "Plot no. 51, Royal Enclave – B Block",
        "location": "Royal Enclave, Jaipur",
        "area": "Royal Enclave",
        "city": "Jaipur",
        "price": "₹ 55,000 per sq. yard",
        "description": "This residential plot in Royal Enclave, B-Block offers a prime opportunity for building a spacious home in a well-planned and fast-developing locality.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-12/image-1.png",
            "/images/properties/prop-12/image-2.png",
            "/images/properties/prop-12/image-3.jpg",
            "/images/properties/prop-12/image-4.png",
            "/images/properties/prop-12/image-5.png"
        ]
    },
    {
        "id": "13",
        "title": "Plot no. 199, Shriram Nikunj, B-Block",
        "location": "Sanganer, Shriram Nikunj, Jaipur",
        "area": "Shriram Nikunj",
        "city": "Jaipur",
        "price": "₹ 45,000 per sq. yard",
        "description": "A spacious east-facing residential plot in Shriram Nikunj, B-Block. Ideal for building a premium home with excellent vastu and a peaceful, well-connected neighborhood.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-13/image-1.png",
            "/images/properties/prop-13/image-2.png",
            "/images/properties/prop-13/image-3.jpg",
            "/images/properties/prop-13/image-4.png",
            "/images/properties/prop-13/image-5.png"
        ]
    },
    {
        "id": "14",
        "title": "Plot no. 367, Sachivalaya Nagar, Chokhi Dhani",
        "location": "Sachivalaya Nagar, Jaipur",
        "area": "Chokhi Dhani",
        "city": "Jaipur",
        "price": "₹ 45,000 per sq. yard",
        "description": "A well-located residential plot in Sachivalaya Nagar near Chokhi Dhani, ideal for building a spacious home. The area is peaceful, well-connected, and highly suitable for families.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-14/image-1.png",
            "/images/properties/prop-14/image-2.png",
            "/images/properties/prop-14/image-3.jpg",
            "/images/properties/prop-14/image-4.png",
            "/images/properties/prop-14/image-5.png"
        ]
    },
    {
        "id": "15",
        "title": "Sanguine Officers Campus, Block D",
        "location": "Vatika, Jaipur",
        "area": "Vatika",
        "city": "Jaipur",
        "price": "₹ 33,000 per sq. yard",
        "description": "A premium North-East corner residential plot located in the prestigious Sanguine Officers Campus, Block D, near Ring Road in Vatika, Jaipur.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-15/image-1.png",
            "/images/properties/prop-15/image-2.png",
            "/images/properties/prop-15/image-3.jpg",
            "/images/properties/prop-15/image-4.png",
            "/images/properties/prop-15/image-5.png"
        ]
    },
    {
        "id": "16",
        "title": "Plot no. A-231, Sanguine Officers, Ring Road Vatika",
        "location": "Sanguine Officers, Jaipur",
        "area": "Ring Road",
        "city": "Jaipur",
        "price": "₹ 33,000 per sq. yard",
        "description": "Prime North-West corner plot in the premium Sanguine Officers area near Ring Road, ideal for a luxury home or investment with excellent connectivity.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-16/image-1.png",
            "/images/properties/prop-16/image-2.png",
            "/images/properties/prop-16/image-3.jpg",
            "/images/properties/prop-16/image-4.png",
            "/images/properties/prop-16/image-5.png"
        ]
    },
    {
        "id": "17",
        "title": "Plot No. 1 & 2, Nandpuri 1st, Village Chak Getor",
        "location": "Sanganer, Jaipur",
        "area": "Sanganer",
        "city": "Jaipur",
        "price": "Contact for Price",
        "description": "This south-facing residential plot is located in the peaceful and developing locality of Nandpuri 1st, Chak Getor, in Sanganer Tehsil, Jaipur. With a 100-ft. wide road.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-17/image-1.png",
            "/images/properties/prop-17/image-2.png",
            "/images/properties/prop-17/image-3.png",
            "/images/properties/prop-17/image-4.png",
            "/images/properties/prop-17/image-5.jpg"
        ]
    },
    {
        "id": "18",
        "title": "PLOT NO 212, SCHEME ROHINI NAGAR, Page 1st",
        "location": "Rohini Nagar, Jaipur",
        "area": "Rohini Nagar",
        "city": "Jaipur",
        "price": "Contact for Price",
        "description": "This residential plot in Rohini Nagar offers a spacious area ideal for constructing a premium home or for long-term investment. With a total area of 600 sq. meters.",
        "type": "Plot",
        "featured": False,
        "status": "Sales",
        "images": [
            "/images/properties/prop-18/image-1.png",
            "/images/properties/prop-18/image-2.png",
            "/images/properties/prop-18/image-3.jpg",
            "/images/properties/prop-18/image-4.png",
            "/images/properties/prop-18/image-5.png"
        ]
    }
]


async def migrate():
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Clear existing properties
    await db.properties.delete_many({})
    print("Cleared existing properties from database")
    
    # Insert all properties
    now = datetime.now(timezone.utc)
    for prop in PROPERTIES:
        prop['created_at'] = now
        prop['updated_at'] = now
        prop['image'] = prop['images'][0] if prop['images'] else None
        prop['images_count'] = len(prop['images'])
        await db.properties.insert_one(prop)
        print(f"Inserted: {prop['title']}")
    
    # Verify
    count = await db.properties.count_documents({})
    print(f"\n✅ Migration complete! Total properties in database: {count}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(migrate())
