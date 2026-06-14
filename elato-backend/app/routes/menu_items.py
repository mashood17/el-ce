from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..extensions import db
from ..models import MenuItem, Category, AdminUser
from ..utils.auth_helpers import admin_required

menu_items_bp = Blueprint("menu_items", __name__)


@menu_items_bp.route("/category/<category_id>", methods=["GET"])
def get_items_by_category(category_id):
    items = (
        MenuItem.query
        .filter_by(category_id=category_id, is_active=True)
        .order_by(MenuItem.sort_order)
        .all()
    )
    return jsonify([i.to_dict() for i in items]), 200


@menu_items_bp.route("/", methods=["POST"])
@admin_required
def create_item():
    admin = AdminUser.query.get(get_jwt_identity())
    data = request.get_json()

    required = ["name", "price", "category_id"]
    if not all(data.get(f) for f in required):
        return jsonify({"error": f"Missing required fields: {required}"}), 400

    # Verify category belongs to admin's restaurant
    category = Category.query.filter_by(
        id=data["category_id"],
        restaurant_id=admin.restaurant_id
    ).first()
    if not category:
        return jsonify({"error": "Invalid category"}), 400

    max_order = db.session.query(db.func.max(MenuItem.sort_order)).filter_by(
        category_id=data["category_id"]
    ).scalar() or 0

    item = MenuItem(
        restaurant_id=admin.restaurant_id,
        category_id=data["category_id"],
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        image_url=data.get("image_url"),
        is_veg=data.get("is_veg", True),
        sort_order=max_order + 1,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@menu_items_bp.route("/<item_id>", methods=["PUT"])
@admin_required
def update_item(item_id):
    admin = AdminUser.query.get(get_jwt_identity())
    item = MenuItem.query.filter_by(id=item_id, restaurant_id=admin.restaurant_id).first()
    if not item:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    for field in ["name", "description", "price", "image_url", "is_veg", "is_active", "category_id"]:
        if field in data:
            setattr(item, field, data[field])

    db.session.commit()
    return jsonify(item.to_dict()), 200


@menu_items_bp.route("/<item_id>", methods=["DELETE"])
@admin_required
def delete_item(item_id):
    admin = AdminUser.query.get(get_jwt_identity())
    item = MenuItem.query.filter_by(id=item_id, restaurant_id=admin.restaurant_id).first()
    if not item:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@menu_items_bp.route("/reorder", methods=["PATCH"])
@admin_required
def reorder_items():
    admin = AdminUser.query.get(get_jwt_identity())
    data = request.get_json()
    for item_data in data.get("order", []):
        MenuItem.query.filter_by(
            id=item_data["id"],
            restaurant_id=admin.restaurant_id
        ).update({"sort_order": item_data["sort_order"]})
    db.session.commit()
    return jsonify({"message": "Reordered"}), 200