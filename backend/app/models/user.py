import re
import uuid
from datetime import datetime, timezone

import bcrypt
from app.extensions import db


class Role:
    ADMIN = "admin"
    MANAGER = "manager"
    ALL = (ADMIN, MANAGER)


PASSWORD_RULE = re.compile(
    r"^(?=.*[a-z]).{4,}$"
)  # 4+ chars, at least one  letter


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default=Role.MANAGER)
    phone = db.Column(db.String(30), unique=True, nullable=True, index=True)
    building = db.Column(db.String(200), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    failed_login_attempts = db.Column(db.Integer, nullable=False, default=0)
    locked_until = db.Column(db.DateTime(timezone=True), nullable=True)

    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    properties = db.relationship(
        "Property",
        backref="manager",
        lazy="dynamic",
        foreign_keys="Property.manager_id",
        cascade="all, delete-orphan",
    )

    # Without this, deleting a user whose old tokens were ever revoked
    # (logout) fails with a foreign-key violation on token_blocklist.
    blocklisted_tokens = db.relationship(
        "TokenBlocklist",
        backref="user",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    @staticmethod
    def validate_password_strength(raw_password: str) -> bool:
        return bool(PASSWORD_RULE.match(raw_password))

    def set_password(self, raw_password: str) -> None:
        if not self.validate_password_strength(raw_password):
            raise ValueError(
                "Password must be 8+ characters and include at least one uppercase letter."
            )
        hashed = bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt(rounds=12))
        self.password_hash = hashed.decode("utf-8")

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(
            raw_password.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    def is_locked(self) -> bool:
        return bool(self.locked_until and self.locked_until > datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "building": self.building,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"
