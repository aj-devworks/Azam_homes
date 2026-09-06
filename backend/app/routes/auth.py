from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from marshmallow import ValidationError

from app.extensions import db, limiter
from app.models import Role, TokenBlocklist, User
from app.schemas import LoginSchema, RegisterSchema
from app.utils.decorators import admin_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


@auth_bp.post("/register")
@jwt_required()
@admin_required
def register():
    """Only an existing admin may create new accounts (admin or manager)."""
    try:
        data = RegisterSchema().load(request.get_json(force=True, silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    if User.query.filter_by(email=data["email"].lower()).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    user = User(name=data["name"], email=data["email"].lower(), role=data["role"])
    try:
        user.set_password(data["password"])
    except ValueError as err:
        return jsonify({"error": str(err)}), 400

    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@auth_bp.post("/login")
@limiter.limit("10 per minute")  # slow down credential-stuffing / brute force
def login():
    try:
        data = LoginSchema().load(request.get_json(force=True, silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    user = User.query.filter_by(email=data["email"].lower()).first()

    # Generic error message on purpose: never reveal whether the email exists.
    generic_error = ("Invalid email or password", 401)

    if not user or not user.is_active:
        return jsonify({"error": generic_error[0]}), generic_error[1]

    if user.is_locked():
        return jsonify({"error": "Account temporarily locked. Try again later."}), 423

    if not user.check_password(data["password"]):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)
            user.failed_login_attempts = 0
        db.session.commit()
        return jsonify({"error": generic_error[0]}), generic_error[1]

    user.failed_login_attempts = 0
    user.locked_until = None
    db.session.commit()

    extra_claims = {"role": user.role}
    access_token = create_access_token(identity=user.id, additional_claims=extra_claims)
    refresh_token = create_refresh_token(identity=user.id, additional_claims=extra_claims)

    return jsonify(
        {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict(),
        }
    ), 200


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user or not user.is_active:
        return jsonify({"error": "Account no longer active"}), 401

    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})
    return jsonify({"access_token": access_token}), 200


@auth_bp.post("/logout")
@jwt_required(verify_type=False)
def logout():
    token = get_jwt()
    jti = token["jti"]
    token_type = token["type"]
    db.session.add(TokenBlocklist(jti=jti, type=token_type, user_id=get_jwt_identity()))
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200
