from datetime import datetime, timezone

from app.extensions import db


class TokenBlocklist(db.Model):
    """Stores JTI of revoked JWTs (used on logout) so they can't be reused."""

    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True, unique=True)
    type = db.Column(db.String(10), nullable=False)  # "access" or "refresh"
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
