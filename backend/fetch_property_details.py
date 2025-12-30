import json
import re
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://jaipurelitehomes-com-579428.hostingersite.com"

PROPERTY_URLS = {
    "1": "/properties/shikha-vihar-jaipur/",
    "2": "/properties/arihant-greens-colonynear-mahima-panache/",
    "3": "/properties/17-a-jai-ambe-colony-tilawala-jagatpura/",
    "4": "/properties/villa-in-adinath-nagar/",
    "5": "/properties/scheme-c-5suman-enclave-block-h/",
    "6": "/properties/scheme-mahal-plot-no-d-182/",
    "7": "/properties/scheme-mangalam-city-vatika/",
    "8": "/properties/plot-no-234-ravindra-nagar/",
    "9": "/properties/plot-no-166-krishna-sagar-colony/",
    "10": "/properties/plot-no-112-north-part-dwarkapuri-village-chak-getor-tehsil-sanganer-dist-jaipur/",
    "11": "/properties/plot-no-67-gayatri-enclave-goner-road/",
    "12": "/properties/plot-no-51-royal-enclave-b-block/",
    "13": "/properties/plot-no-199-shriram-nikunj-b-block/",
    "14": "/properties/plot-no-367-sachivalaya-nagar-chokhi-dhani/",
    "15": "/properties/sanguine-officers-campus-block-d/",
    "16": "/properties/plot-no-a-231-sanguine-officers-ring-road-vatika/",
    "17": "/properties/plot-no-1-2-nandpuri-1st-village-chak-getor-teh-sanganer-jaipur/",
    "18": "/properties/plot-no-212-scheme-rohini-nagar-page-1st/",
}

def fetch_property_details(url):
    """Fetch property description and address from WordPress site"""
    try:
        response = requests.get(url, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code != 200:
            return None
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find description section
        desc_section = soup.find('div', id='wpestate_property_description_section')
        description = ""
        if desc_section:
            # Get all text content
            paragraphs = desc_section.find_all(['p', 'li'])
            description = "\n".join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
        
        # Find address section
        address_section = soup.find('div', id='accordion_property_address')
        address_data = {}
        if address_section:
            address_items = address_section.find_all('div', class_='property_custom_detail_wrapper')
            for item in address_items:
                label_el = item.find('div', class_='listing_detail')
                if label_el:
                    text = label_el.get_text()
                    if 'Address:' in text:
                        address_data['address'] = text.replace('Address:', '').strip()
                    elif 'City:' in text:
                        address_data['city'] = text.replace('City:', '').strip()
                    elif 'Area:' in text:
                        address_data['area_name'] = text.replace('Area:', '').strip()
                    elif 'State' in text:
                        address_data['state'] = text.replace('State/County:', '').strip()
                    elif 'Zip:' in text:
                        address_data['zip'] = text.replace('Zip:', '').strip()
                    elif 'Country:' in text:
                        address_data['country'] = text.replace('Country:', '').strip()
        
        # Find map link
        map_link = ""
        map_links = soup.find_all('a', href=True)
        for link in map_links:
            if 'maps.app.goo.gl' in link.get('href', '') or 'maps.google.com' in link.get('href', ''):
                map_link = link.get('href')
                break
        
        return {
            'description': description,
            'address': address_data,
            'map_link': map_link
        }
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    # Load existing properties
    with open('/app/frontend/public/data/properties.json', 'r') as f:
        properties = json.load(f)
    
    # Fetch and update each property
    for prop in properties:
        prop_id = str(prop['id'])
        if prop_id in PROPERTY_URLS:
            url = BASE_URL + PROPERTY_URLS[prop_id]
            print(f"Fetching property {prop_id}: {prop['title']}...")
            
            details = fetch_property_details(url)
            if details:
                if details['description']:
                    prop['full_description'] = details['description']
                if details['address']:
                    prop['address_details'] = details['address']
                if details['map_link']:
                    prop['map_link'] = details['map_link']
                print(f"  Updated with {len(details['description'])} chars description")
            else:
                print(f"  Failed to fetch details")
    
    # Save updated properties
    with open('/app/frontend/public/data/properties.json', 'w') as f:
        json.dump(properties, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Properties updated successfully!")

if __name__ == "__main__":
    main()
