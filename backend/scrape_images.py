import os
import re
import requests
import json
from urllib.parse import urlparse

# Mapping of property IDs to their WordPress slugs
PROPERTY_SLUGS = {
    1: "shikha-vihar-jaipur",
    2: "arihant-greens-colonynear-mahima-panache",
    3: "jai-ambe-colony-tilawala-jagatpura",
    4: "villa-in-adinath-nagar",
    5: "scheme-c-5suman-enclave-block-h",
    6: "scheme-mahal-plot-no-d-182",
    7: "scheme-mangalam-city-vatika",
    8: "plot-no-234-ravindra-nagar",
    9: "plot-no-166-krishna-sagar-colony",
    10: "plot-no-112-north-part-dwarkapuri-village-chak-getor-tehsil-sanganer-dist-jaipur",
    11: "plot-no-67-gayatri-enclave-goner-road",
    12: "plot-no-51-royal-enclave-b-block",
    13: "plot-no-199-shriram-nikunj-b-block",
    14: "plot-no-367-sachivalaya-nagar-chokhi-dhani",
    15: "sanguine-officers-campus-block-d",
    16: "plot-no-a-231-sanguine-officers-ring-road-vatika",
    17: "plot-no-1-2-nandpuri-1st-village-chak-getor",
    18: "plot-no-212-scheme-rohini-nagar-page-1st",
}

BASE_URL = "https://jaipurelitehomes.com/properties/"
OUTPUT_DIR = "/app/frontend/public/images/properties"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def extract_images_from_html(html_content):
    """Extract all unique full-res image URLs from HTML"""
    # Pattern to match WordPress image URLs in the page
    pattern = r'https://jaipurelitehomes\.com/wp-content/uploads/[^"\s]+\.(?:png|jpg|jpeg)'
    all_matches = re.findall(pattern, html_content)
    
    # Remove duplicates and thumbnails
    unique_images = set()
    for url in all_matches:
        # Skip thumbnails (small variants)
        if any(x in url for x in ['-143x83', '-105x70', '-525x328', '-478x328']):
            continue
        # Get full resolution version by removing size suffix
        clean_url = re.sub(r'-\d+x\d+', '', url)
        unique_images.add(clean_url)
    
    return list(unique_images)

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

def scrape_property(prop_id, slug):
    """Scrape all images for a property"""
    url = f"{BASE_URL}{slug}/"
    print(f"\n[{prop_id}] Scraping: {url}")
    
    try:
        response = requests.get(url, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code != 200:
            print(f"  Failed to fetch page: {response.status_code}")
            return []
        
        images = extract_images_from_html(response.text)
        print(f"  Found {len(images)} unique images")
        
        # Create property-specific directory
        prop_dir = os.path.join(OUTPUT_DIR, f"prop-{prop_id}")
        ensure_dir(prop_dir)
        
        downloaded = []
        for i, img_url in enumerate(images):
            ext = img_url.split('.')[-1].split('?')[0]
            filename = f"image-{i+1}.{ext}"
            output_path = os.path.join(prop_dir, filename)
            
            if download_image(img_url, output_path):
                # Return path relative to public folder
                rel_path = f"/images/properties/prop-{prop_id}/{filename}"
                downloaded.append(rel_path)
                print(f"  Downloaded: {filename}")
            
        return downloaded
    except Exception as e:
        print(f"  Error: {e}")
        return []

def main():
    ensure_dir(OUTPUT_DIR)
    all_results = {}
    
    for prop_id, slug in PROPERTY_SLUGS.items():
        images = scrape_property(prop_id, slug)
        all_results[prop_id] = images
    
    # Save results as JSON for later use
    with open('/app/backend/property_images.json', 'w') as f:
        json.dump(all_results, f, indent=2)
    
    print(f"\n\nCompleted! Results saved to property_images.json")
    for prop_id, images in all_results.items():
        print(f"Property {prop_id}: {len(images)} images")

if __name__ == "__main__":
    main()
