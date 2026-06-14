import uuid
import hashlib
import secrets
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("restaurants.id"), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def set_password(self, password: str):
        salt = secrets.token_hex(32)
        hash_val = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000)
        self.password_hash = f"{salt}:{hash_val.hex()}"

    def check_password(self, password: str) -> bool:
        try:
            salt, stored_hash = self.password_hash.split(":")
            hash_val = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000)
            return hash_val.hex() == stored_hash
        except Exception:
            return False

    def to_dict(self):
        return {
            "id": str(self.id),
            "restaurant_id": str(self.restaurant_id),
            "email": self.email,
            "is_active": self.is_active,
        }