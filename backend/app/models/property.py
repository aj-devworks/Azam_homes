import uuid
from datetime import datetime, timezone

from app.extensions import db


class PropertyStatus:
    PENDING = "pending"      # newly submitted by a manager, awaiting admin review
    APPROVED = "approved"    # visible on the public site
    REJECTED = "rejected"    # admin declined it
    SOLD = "sold"
    ALL = (PENDING, APPROVED, REJECTED, SOLD)


class PropertyType:
    HOUSE = "house"
    APARTMENT = "apartment"
    LAND = "land"
    COMMERCIAL = "commercial"
    ALL = (HOUSE, APARTMENT, LAND, COMMERCIAL)


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(14, 2), nullable=False)
    location = db.Column(db.String(200), nullable=False, index=True)
    bedrooms = db.Column(db.Integer, nullable=True)
    bathrooms = db.Column(db.Integer, nullable=True)
    area_sqft = db.Column(db.Integer, nullable=True)
    property_type = db.Column(db.String(20), nullable=False, default=PropertyType.HOUSE)
    status = db.Column(db.String(20), nullable=False, default=PropertyStatus.PENDING)

    manager_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    images = db.relationship(
        "PropertyImage", backref="property", lazy="joined", cascade="all, delete-orphan"
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": float(self.price) if self.price is not None else None,
            "location": self.location,
            "bedrooms": self.bedrooms,
            "bathrooms": self.bathrooms,
            "area_sqft": self.area_sqft,
            "property_type": self.property_type,
            "status": self.status,
            "manager_id": self.manager_id,
            "manager_name": self.manager.name if self.manager else None,
            "images": [img.url for img in self.images],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class PropertyImage(db.Model):
    __tablename__ = "property_images"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = db.Column(
        db.String(36), db.ForeignKey("properties.id"), nullable=False
    )
    url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, nullable=False, default=False)
