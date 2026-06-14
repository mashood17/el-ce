from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from ..models import AdminUser

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    admin = AdminUser.query.filter_by(email=data["email"].lower().strip()).first()
    if not admin or not admin.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    if not admin.is_active:
        return jsonify({"error": "Account disabled"}), 403

    token = create_access_token(identity=str(admin.id))
    return jsonify({
        "access_token": token,
        "admin": admin.to_dict()
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    admin_id = get_jwt_identity()
    admin = AdminUser.query.get(admin_id)
    if not admin:
        return jsonify({"error": "Not found"}), 404
    return jsonify(admin.to_dict()), 200