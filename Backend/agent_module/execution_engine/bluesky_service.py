from atproto import Client
import os
from dotenv import load_dotenv

load_dotenv()

HANDLE = os.getenv("BLUESKY_HANDLE")
PASSWORD = os.getenv("BLUESKY_APP_PASSWORD")


def post_to_bluesky(text, image_path=None):
    print("HANDLE:", HANDLE)
    print("PASSWORD:", PASSWORD)

    client = Client()
    client.login(HANDLE.strip(), PASSWORD.strip())
    embed = None

    if image_path:
        with open(image_path, "rb") as f:
            img_bytes = f.read()

        upload = client.upload_blob(img_bytes)

        embed = {
            "$type": "app.bsky.embed.images",
            "images": [
                {
                    "image": upload.blob,
                    "alt": "Travel Campaign Image"
                }
            ]
        }

    post = client.send_post(
        text=text,
        embed=embed
    )

    return {
        "uri": post.uri,
        "cid": post.cid
    }