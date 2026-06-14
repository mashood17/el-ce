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
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    folder = request.form.get("folder", "general")  # hero, categories, items

    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Allowed: jpg, jpeg, png, webp, avif"}), 400

    file_bytes = file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Max 5MB"}), 400

    try:
        url = upload_image(file_bytes, file.filename, folder=folder)
        return jsonify({"url": url}), 200
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500