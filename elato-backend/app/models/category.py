import uuid
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("restaurants.id"), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.Text)
    sort_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    items = db.relationship(
        "MenuItem",
        backref="category",
        lazy="dynamic",
        cascade="all, delete-orphan",
        order_by="MenuItem.sort_order"
    )

    def to_dict(self, include_items=False):
        data = {
            "id": str(self.id),
            "restaurant_id": str(self.restaurant_id),
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
        }
        if include_items:
            data["items"] = [item.to_dict() for item in self.items.filter_by(is_active=True).order_by("sort_order")]
        return data