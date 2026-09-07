from marshmallow import Schema, fields, validate

from app.models.property import PropertyStatus, PropertyType


class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    # Only an existing admin can create another admin — enforced in the route,
    # not trusted from client input beyond this allow-list.
    role = fields.Str(
        required=False, validate=validate.OneOf(["admin", "manager"]), load_default="manager"
    )
    phone = fields.Str(required=False, allow_none=True, validate=validate.Length(max=30))
    building = fields.Str(required=False, allow_none=True, validate=validate.Length(max=200))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class PropertyCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=3, max=200))
    description = fields.Str(required=False, allow_none=True)
    price = fields.Decimal(required=True, validate=validate.Range(min=0))
    location = fields.Str(required=True, validate=validate.Length(min=2, max=200))
    bedrooms = fields.Int(required=False, allow_none=True, validate=validate.Range(min=0))
    bathrooms = fields.Int(required=False, allow_none=True, validate=validate.Range(min=0))
    area_sqft = fields.Int(required=False, allow_none=True, validate=validate.Range(min=0))
    property_type = fields.Str(
        required=False, validate=validate.OneOf(PropertyType.ALL), load_default=PropertyType.HOUSE
    )
    status = fields.Str(
        required=False, validate=validate.OneOf(PropertyStatus.ALL), load_default=PropertyStatus.PENDING
    )
    images = fields.List(fields.Url(), required=False, load_default=[])


class PropertyUpdateSchema(Schema):
    title = fields.Str(validate=validate.Length(min=3, max=200))
    description = fields.Str(allow_none=True)
    price = fields.Decimal(validate=validate.Range(min=0))
    location = fields.Str(validate=validate.Length(min=2, max=200))
    bedrooms = fields.Int(allow_none=True, validate=validate.Range(min=0))
    bathrooms = fields.Int(allow_none=True, validate=validate.Range(min=0))
    area_sqft = fields.Int(allow_none=True, validate=validate.Range(min=0))
    property_type = fields.Str(validate=validate.OneOf(PropertyType.ALL))
    status = fields.Str(validate=validate.OneOf(PropertyStatus.ALL))
    images = fields.List(fields.Url())
