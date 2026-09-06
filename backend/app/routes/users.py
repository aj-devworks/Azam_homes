from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Role, User
from app.utils.decorators import admin_required

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.get("")
@admin_required
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200


@users_bp.patch("/<string:user_id>/deactivate")
@admin_required
def deactivate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.is_active = False
    db.session.commit()
    return jsonify(user.to_dict()), 200


@users_bp.patch("/<string:user_id>/activate")
@admin_required
def activate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.is_active = True
    user.failed_login_attempts = 0
    user.locked_until = None
    db.session.commit()
    return jsonify(user.to_dict()), 200
