from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity

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
    if user.id == get_jwt_identity():
        return jsonify({"error": "You cannot deactivate your own account"}), 400
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


@users_bp.patch("/<string:user_id>/reset-password")
@admin_required
def reset_user_password(user_id):
    """Admin-only: set a new password for any account directly — no email
    needed. Useful when a manager forgets their password and can't recover
    it themselves."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    payload = request.get_json(force=True, silent=True) or {}
    new_password = payload.get("password", "")

    try:
        user.set_password(new_password)
    except ValueError as err:
        return jsonify({"error": str(err)}), 400

    user.failed_login_attempts = 0
    user.locked_until = None
    db.session.commit()
    return jsonify({"message": "Password reset"}), 200


@users_bp.delete("/<string:user_id>")
@admin_required
def delete_user(user_id):
    """Permanently deletes an account. For a manager, this also deletes all
    of their listings (cascade). Blocked for: deleting yourself, or deleting
    the last remaining admin (the system must always have at least one)."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.id == get_jwt_identity():
        return jsonify({"error": "You cannot delete your own account"}), 400

    if user.role == Role.ADMIN:
        remaining_admins = User.query.filter_by(role=Role.ADMIN).count()
        if remaining_admins <= 1:
            return jsonify({"error": "Cannot delete the last remaining admin"}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
