import os
import uuid
import traceback
from flask import current_app


def get_supabase():
    from supabase import create_client
    url = current_app.config.get("SUPABASE_URL")
    key = current_app.config.get("SUPABASE_SERVICE_KEY")
    print(f"Supabase URL: {url}")
    print(f"Supabase Key present: {bool(key)}")
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_SERVICE_KEY is missing from config")
    return create_client(url, key)


def upload_image(file_bytes: bytes, filename: str, folder: str = "general") -> str:
    try:
        supabase = get_supabase()
        bucket = current_app.config.get("SUPABASE_BUCKET", "elato-media")
        print(f"Bucket: {bucket}")

        ext = filename.rsplit(".", 1)[-1].lower()
        unique_name = f"{folder}/{uuid.uuid4()}.{ext}"
        print(f"Uploading to path: {unique_name}")

        content_type_map = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "webp": "image/webp",
            "avif": "image/avif",
        }
        content_type = content_type_map.get(ext, "image/jpeg")
        print(f"Content type: {content_type}")

        response = supabase.storage.from_(bucket).upload(
            path=unique_name,
            file=file_bytes,
            file_options={"content-type": content_type}
        )
        print(f"Upload response: {response}")

        # Get public URL
        public_url = supabase.storage.from_(bucket).get_public_url(unique_name).rstrip("?")
        print(f"Public URL: {public_url}")

        return public_url

    except Exception as e:
        print("=== SUPABASE STORAGE ERROR ===")
        traceback.print_exc()
        raise


def delete_image(url: str) -> bool:
    try:
        supabase = get_supabase()
        bucket = current_app.config.get("SUPABASE_BUCKET", "elato-media")
        base = f"/storage/v1/object/public/{bucket}/"
        if base in url:
            path = url.split(base)[-1]
            supabase.storage.from_(bucket).remove([path])
            return True
        return False
    except Exception:
        traceback.print_exc()
        return False