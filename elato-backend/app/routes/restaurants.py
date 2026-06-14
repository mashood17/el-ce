from flask import Blueprint, jsonify
from ..models import Restaurant

restaurants_bp = Blueprint("restaurants", __name__)


@restaurants_bp.route("/<slug>", methods=["GET"])
def get_restaurant(slug):
    restaurant = Restaurant.query.filter_by(slug=slug, is_active=True).first()
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    return jsonify(restaurant.to_dict()), 200