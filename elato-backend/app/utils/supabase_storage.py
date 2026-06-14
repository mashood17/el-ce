import os
import uuid
from supabase import create_client
from flask import current_app


def get_supabase():
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_SERVICE_KEY"]
    )


def upload_image(file_bytes: bytes, filename: str, folder: str = "general") -> str:
    """
    Upload image to Supabase Storage.
    Returns the public URL of the uploaded file.
    """
    supabase = get_supabase()
    bucket = current_app.config["SUPABASE_BUCKET"]
    
    ext = filename.rsplit(".", 1)[-1].lower()
    unique_name = f"{folder}/{uuid.uuid4()}.{ext}"
    
    supabase.storage.from_(bucket).upload(
        path=unique_name,
        file=file_bytes,
        file_options={"content-type": f"image/{ext}"}
    )
    
    public_url = supabase.storage.from_(bucket).get_public_url(unique_name)
    return public_url


def delete_image(url: str) -> bool:
    """Delete image from Supabase Storage by its public URL."""
    try:
        supabase = get_supabase()
        bucket = current_app.config["SUPABASE_BUCKET"]
        
        # Extract path from URL
        # URL format: https://[ref].supabase.co/storage/v1/object/public/[bucket]/[path]
        base = f"/storage/v1/object/public/{bucket}/"
        if base in url:
            path = url.split(base)[-1]
            supabase.storage.from_(bucket).remove([path])
            return True
        return False
    except Exception:
        return False