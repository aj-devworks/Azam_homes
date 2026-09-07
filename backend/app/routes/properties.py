from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from marshmallow import ValidationError

from app.extensions import db
from app.models import Property, PropertyImage, Role
from app.schemas import PropertyCreateSchema, PropertyUpdateSchema
from app.utils.decorators import roles_required

properties_bp = Blueprint("properties", __name__, url_prefix="/api/properties")


@properties_bp.get("")
def list_properties():
    """Public: anyone can browse listings. Supports basic filtering + pagination."""
    query = Property.query

    location = request.args.get("location")
    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    property_type = request.args.get("property_type")
    if property_type:
        query = query.filter_by(property_type=property_type)

    min_price = request.args.get("min_price", type=float)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)

    max_price = request.args.get("max_price", type=float)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)

    page = request.args.get("page", default=1, type=int)
    per_page = min(request.args.get("per_page", default=20, type=int), 100)

    pagination = query.order_by(Property.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify(
        {
            "items": [p.to_dict() for p in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }
    ), 200


@properties_bp.get("/<string:property_id>")
def get_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    return jsonify(prop.to_dict()), 200


@properties_bp.post("")
@roles_required(Role.ADMIN, Role.MANAGER)
def create_property():
    try:
        data = PropertyCreateSchema().load(request.get_json(force=True, silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    images = data.pop("images", [])
    prop = Property(**data, manager_id=get_jwt_identity())
    prop.images = [PropertyImage(url=url, is_primary=(i == 0)) for i, url in enumerate(images)]

    db.session.add(prop)
    db.session.commit()
    return jsonify(prop.to_dict()), 201


def _can_modify(prop: Property) -> bool:
    claims = get_jwt()
    if claims.get("role") == Role.ADMIN:
        return True
    return prop.manager_id == get_jwt_identity()


@properties_bp.patch("/<string:property_id>")
@roles_required(Role.ADMIN, Role.MANAGER)
def update_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404

    # Managers may only edit their own listings; admins may edit any.
    if not _can_modify(prop):
        return jsonify({"error": "You do not have permission to edit this listing"}), 403

    try:
        data = PropertyUpdateSchema().load(
            request.get_json(force=True, silent=True) or {}, partial=True
        )
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    images = data.pop("images", None)
    for key, value in data.items():
        setattr(prop, key, value)

    if images is not None:
        prop.images = [PropertyImage(url=url, is_primary=(i == 0)) for i, url in enumerate(images)]

    db.session.commit()
    return jsonify(prop.to_dict()), 200


@properties_bp.patch("/<string:property_id>/approve")
@roles_required(Role.ADMIN)
def approve_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    prop.status = "approved"
    db.session.commit()
    return jsonify(prop.to_dict()), 200


@properties_bp.patch("/<string:property_id>/reject")
@roles_required(Role.ADMIN)
def reject_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    prop.status = "rejected"
    db.session.commit()
    return jsonify(prop.to_dict()), 200


@properties_bp.delete("/<string:property_id>")
@roles_required(Role.ADMIN, Role.MANAGER)
def delete_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404

    if not _can_modify(prop):
        return jsonify({"error": "You do not have permission to delete this listing"}), 403

    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": "Property deleted"}), 200
