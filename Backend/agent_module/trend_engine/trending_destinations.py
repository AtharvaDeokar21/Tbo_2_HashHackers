from serpapi import GoogleSearch
import os

SERP_API_KEY = os.getenv("SERP_API_KEY")


POPULAR_DESTINATIONS = {
    "Dubai": "Luxury destination known for iconic skyscrapers, desert safaris, and world-class shopping.",
    "Bali": "Tropical island paradise famous for beaches, temples, and vibrant culture.",
    "Thailand": "Popular Southeast Asian destination known for stunning islands, street food, and nightlife.",
    "Japan": "Blend of traditional culture and futuristic cities with temples, cherry blossoms, and cuisine.",
    "Switzerland": "Scenic European destination famous for the Alps, lakes, and picturesque villages.",
    "Maldives": "Luxury island getaway known for overwater villas, coral reefs, and crystal-clear waters.",
    "Vietnam": "Emerging travel hotspot with dramatic landscapes, rich history, and vibrant street food culture.",
    "Turkey": "Cultural crossroads offering historic cities, Mediterranean beaches, and Cappadocia landscapes."
}
LINKS = {
    "Dubai": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Burj_Khalifa_2021.jpg/250px-Burj_Khalifa_2021.jpg",
    "Bali": "https://www.outlooktravelmag.com/media/bali-1-1582544096.profileImage.2x-1536x884.webp",
    "Thailand": "https://www.travelandleisure.com/thmb/nDDNqO2EctQhiIfZrxeXTF47zhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-koh-phi-phi-PLACESTHAILAND1023-09b9d347b3cd4844b4ae19e4e06a9a6d.jpg",
    "Japan": "https://www.japan-guide.com/thumb/XYZeXYZe2157_375.jpg",
    "Switzerland": "https://res.klook.com/image/upload/q_85/c_fill,w_750/v1659887118/blog/cmkyiqmnxlynhchzkyb0.jpg",
    "Maldives": "https://thetravelexpert.ie/wp-content/uploads/2021/03/10.-Soneva-Jani.-1.jpg",
    "Vietnam": "https://cdn.tourradar.com/s3/serp/1500x800/5032_Gia44gKW.jpg",
    "Turkey": "https://media.cntraveller.com/photos/611befd2ae2ff768cb25326d/16:9/w_3200,h_1800,c_limit/turkey.jpg"
}

def get_trending_destinations():

    destinations = []

    for place, description in POPULAR_DESTINATIONS.items():

        
        image = None
        if place in LINKS:
            image = LINKS[place]

        

        destinations.append({
            "destination": place,
            "description": description,
            "image": image
        })

    return destinations