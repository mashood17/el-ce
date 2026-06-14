import uuid
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID


class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("restaurants.id"), nullable=False)
    category_id = db.Column(UUID(as_uuid=True), db.ForeignKey("categories.id"), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.Text)
    is_veg = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "restaurant_id": str(self.restaurant_id),
            "category_id": str(self.category_id),
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "image_url": self.image_url,
            "is_veg": self.is_veg,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
        }