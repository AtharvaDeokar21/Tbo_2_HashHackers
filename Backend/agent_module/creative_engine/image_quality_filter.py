from PIL import Image
import requests
import io

def is_valid_image(url):

    try:
        response = requests.get(url, timeout=5)
        img = Image.open(io.BytesIO(response.content))

        width, height = img.size

        # Reject small images
        if width < 800 or height < 600:
            return False

        # Reject portrait orientation
        if height > width:
            return False

        return True

    except:
        return False