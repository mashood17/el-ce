from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..extensions import db
from ..models import HeroSlide, Restaurant, AdminUser
from ..utils.auth_helpers import admin_required

hero_slides_bp = Blueprint("hero_slides", __name__)


@hero_slides_bp.route("/<slug>", methods=["GET"])
def get_hero_slides(slug):
    restaurant = Restaurant.query.filter_by(slug=slug, is_active=True).first()
    if not restaurant:
        return jsonify({"error": "Not found"}), 404
    slides = (
        HeroSlide.query
        .filter_by(restaurant_id=restaurant.id, is_active=True)
        .order_by(HeroSlide.sort_order)
        .all()
    )
    return jsonify([s.to_dict() for s in slides]), 200


@hero_slides_bp.route("/", methods=["POST"])
@admin_required
def add_slide():
    admin = AdminUser.query.get(get_jwt_identity())
    data = request.get_json()

    if not data.get("image_url"):
        return jsonify({"error": "image_url required"}), 400

    max_order = db.session.query(db.func.max(HeroSlide.sort_order)).filter_by(
        restaurant_id=admin.restaurant_id
    ).scalar() or 0

    slide = HeroSlide(
        restaurant_id=admin.restaurant_id,
        image_url=data["image_url"],
        sort_order=max_order + 1,
    )
    db.session.add(slide)
    db.session.commit()
    return jsonify(slide.to_dict()), 201


@hero_slides_bp.route("/<slide_id>", methods=["DELETE"])
@admin_required
def delete_slide(slide_id):
    admin = AdminUser.query.get(get_jwt_identity())
    slide = HeroSlide.query.filter_by(id=slide_id, restaurant_id=admin.restaurant_id).first()
    if not slide:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(slide)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@hero_slides_bp.route("/reorder", methods=["PATCH"])
@admin_required
def reorder_slides():
    admin = AdminUser.query.get(get_jwt_identity())
    data = request.get_json()
    for item in data.get("order", []):
        HeroSlide.query.filter_by(
            id=item["id"],
            restaurant_id=admin.restaurant_id
        ).update({"sort_order": item["sort_order"]})
    db.session.commit()
    return jsonify({"message": "Reordered"}), 200