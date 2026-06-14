from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..extensions import db
from ..models import Category, Restaurant, AdminUser
from ..utils.auth_helpers import admin_required

categories_bp = Blueprint("categories", __name__)


@categories_bp.route("/<slug>", methods=["GET"])
def get_categories(slug):
    restaurant = Restaurant.query.filter_by(slug=slug, is_active=True).first()
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    
    include_items = request.args.get("include_items", "false").lower() == "true"
    categories = (
        Category.query
        .filter_by(restaurant_id=restaurant.id, is_active=True)
        .order_by(Category.sort_order)
        .all()
    )
    return jsonify([c.to_dict(include_items=include_items) for c in categories]), 200


@categories_bp.route("/", methods=["POST"])
@admin_required
def create_category():
    admin = AdminUser.query.get(get_jwt_identity())
    data = request.get_json()

    if not data.get("name"):
        return jsonify({"error": "Name is required"}), 400

    # Get max sort_order
    max_order = db.session.query(db.func.max(Category.sort_order)).filter_by(
        restaurant_id=admin.restaurant_id
    ).scalar() or 0

    category = Category(
        restaurant_id=admin.restaurant_id,
        name=data["name"],
        description=data.get("description"),
        image_url=data.get("image_url"),
        sort_order=max_order + 1,
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@categories_bp.route("/<category_id>", methods=["PUT"])
@admin_required
def update_category(category_id):
    admin = AdminUser.query.get(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, restaurant_id=admin.restaurant_id).first()
    if not category:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    for field in ["name", "description", "image_url", "is_active"]:
        if field in data:
            setattr(category, field, data[field])

    db.session.commit()
    return jsonify(category.to_dict()), 200


@categories_bp.route("/<category_id>", methods=["DELETE"])
@admin_required
def delete_category(category_id):
    admin = AdminUser.query.get(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, restaurant_id=admin.restaurant_id).first()
    if not category:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@categories_bp.route("/reorder", methods=["PATCH"])
@admin_required
def reorder_categories():
    admin = AdminUser.query.get(get_jwt_identity())
    data = request.get_json()
    # Expects: [{ "id": "uuid", "sort_order": 1 }, ...]
    for item in data.get("order", []):
        Category.query.filter_by(
            id=item["id"],
            restaurant_id=admin.restaurant_id
        ).update({"sort_order": item["sort_order"]})
    db.session.commit()
    return jsonify({"message": "Reordered"}), 200