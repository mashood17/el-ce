import traceback
from flask import Blueprint, request, jsonify
from ..utils.auth_helpers import admin_required
from ..utils.supabase_storage import upload_image

upload_bp = Blueprint("upload", __name__)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "avif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route("/image", methods=["POST"])
@admin_required
def upload():
    print("=== UPLOAD REQUEST RECEIVED ===")
    print("Files in request:", list(request.files.keys()))
    print("Form data:", list(request.form.keys()))

    if "file" not in request.files:
        print("ERROR: No file key in request.files")
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    folder = request.form.get("folder", "general")
    print(f"File name: {file.filename}")
    print(f"File content type: {file.content_type}")
    print(f"Folder: {folder}")

    if not file.filename or not allowed_file(file.filename):
        print(f"ERROR: Invalid file type — {file.filename}")
        return jsonify({"error": "Invalid file type. Allowed: jpg, jpeg, png, webp, avif"}), 400

    file_bytes = file.read()
    print(f"File size: {len(file_bytes)} bytes")

    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Max 5MB"}), 400

    try:
        url = upload_image(file_bytes, file.filename, folder=folder)
        print(f"Upload success. URL: {url}")
        return jsonify({"url": url}), 200
    except Exception as e:
        print("=== UPLOAD ERROR ===")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500