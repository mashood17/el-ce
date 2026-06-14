import uuid
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = db.Column(db.String(100), unique=True, nullable=False)  # e.g. "elato-celebre"
    name = db.Column(db.String(200), nullable=False)
    tagline = db.Column(db.String(500))
    address = db.Column(db.Text)
    phone_primary = db.Column(db.String(20))
    phone_secondary = db.Column(db.String(20))
    whatsapp = db.Column(db.String(20))
    instagram = db.Column(db.String(100))
    hours_weekday = db.Column(db.String(100))   # e.g. "11:00 AM – 11:00 PM"
    hours_weekend = db.Column(db.String(100))   # e.g. "11:00 AM – 10:00 PM"
    theme = db.Column(db.String(50), default="sand-luxury")
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    categories = db.relationship("Category", backref="restaurant", lazy="dynamic", cascade="all, delete-orphan")
    hero_slides = db.relationship("HeroSlide", backref="restaurant", lazy="dynamic", cascade="all, delete-orphan")
    admin_users = db.relationship("AdminUser", backref="restaurant", lazy="dynamic")

    def to_dict(self):
        return {
            "id": str(self.id),
            "slug": self.slug,
            "name": self.name,
            "tagline": self.tagline,
            "address": self.address,
            "phone_primary": self.phone_primary,
            "phone_secondary": self.phone_secondary,
            "whatsapp": self.whatsapp,
            "instagram": self.instagram,
            "hours_weekday": self.hours_weekday,
            "hours_weekend": self.hours_weekend,
            "theme": self.theme,
            "is_active": self.is_active,
        }