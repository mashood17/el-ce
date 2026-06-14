from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from ..models import AdminUser


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        admin_id = get_jwt_identity()
        admin = AdminUser.query.get(admin_id)
        if not admin or not admin.is_active:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated