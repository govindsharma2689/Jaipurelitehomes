"""
Script to download correct featured images and reorder the images array
"""
import asyncio
import os
import requests
import re
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

OUTPUT_DIR = "/app/frontend/public/images/properties"

# Correct image order based on original website thumbnail order
CORRECT_IMAGE_ORDER = {
    # Property 1: Shikha Vihar - thumbnail order shows image-17 first
    "1": [
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-17.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-10.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-1.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-2.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-4.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-3.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-5.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-7.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-8.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-9.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-11.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-12.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-13.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-14.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-15.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-16.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-18.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-19.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-20.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-21.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-22.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-6.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-23.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-24.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-25.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-26.png",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villas-Shikha-Vihar-jaipur-image-01-27.png",
    ],
    # Property 2: Arihant Greens - thumbnail order shows image-02 first
    "2": [
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Arihant-Greens-ColonyNear-Mahima-Panache-image-01-2.jpg",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Arihant-Greens-ColonyNear-Mahima-Panache-image-01-4.jpg",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Arihant-Greens-ColonyNear-Mahima-Panache-image-01-5.jpg",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Arihant-Greens-ColonyNear-Mahima-Panache-image-01-6.jpg",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Arihant-Greens-ColonyNear-Mahima-Panache-image-01-7.jpg",
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Arihant-Greens-ColonyNear-Mahima-Panache-image-01-3.jpg",
    ],
    # Property 4: Villa in Adinath Nagar
    "4": [
        "https://jaipurelitehomes.com/wp-content/uploads/2025/12/Villa-in-Adinath-Nagar-Photo-1.png",
    ],
}

def download_image(url, output_path):
    """Download image and save to path"""
    try:
        response = requests.get(url, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
    return False

async def fix_images():
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    for prop_id, image_urls in CORRECT_IMAGE_ORDER.items():
        print(f"\n[Property {prop_id}] Downloading {len(image_urls)} images in correct order...")
        
        # Create property-specific directory
        prop_dir = os.path.join(OUTPUT_DIR, f"prop-{prop_id}")
        os.makedirs(prop_dir, exist_ok=True)
        
        # Clear existing images in the directory
        import glob
        for f in glob.glob(os.path.join(prop_dir, "*")):
            os.remove(f)
        
        downloaded = []
        for i, img_url in enumerate(image_urls):
            ext = img_url.split('.')[-1].split('?')[0]
            filename = f"image-{i+1}.{ext}"
            output_path = os.path.join(prop_dir, filename)
            
            if download_image(img_url, output_path):
                rel_path = f"/images/properties/prop-{prop_id}/{filename}"
                downloaded.append(rel_path)
                print(f"  Downloaded: {filename}")
        
        # Update database
        if downloaded:
            await db.properties.update_one(
                {"id": prop_id},
                {"$set": {
                    "images": downloaded,
                    "image": downloaded[0],
                    "images_count": len(downloaded)
                }}
            )
            print(f"  Updated database with {len(downloaded)} images")
    
    client.close()
    print("\n✅ Image fix complete!")


if __name__ == "__main__":
    asyncio.run(fix_images())
