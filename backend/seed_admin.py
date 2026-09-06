"""
Run this ONCE to create the very first admin account, since /api/auth/register
requires an existing admin to be logged in. After this, log in as this admin
and use /api/auth/register to create further admin/manager accounts.

Usage:
    python seed_admin.py
"""
import os

from app import create_app
from app.extensions import db
from app.models import Role, User

app = create_app()

with app.app_context():
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]

    if User.query.filter_by(email=email).first():
        print(f"Admin '{email}' already exists — nothing to do.")
    else:
        admin = User(name="Site Admin", email=email, role=Role.ADMIN)
        admin.set_password(password)  # raises ValueError if password is too weak
        db.session.add(admin)
        db.session.commit()
        print(f"Created admin account: {email}")
