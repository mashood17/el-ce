import uuid
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID


class HeroSlide(db.Model):
    __tablename__ = "hero_slides"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("restaurants.id"), nullable=False)
    image_url = db.Column(db.Text, nullable=False)
    sort_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "restaurant_id": str(self.restaurant_id),
            "image_url": self.image_url,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
        }