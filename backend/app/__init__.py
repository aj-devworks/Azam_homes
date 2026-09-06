import os

from flask import Flask, jsonify

from app.config import config_by_name
from app.extensions import cors, db, jwt, limiter, migrate, talisman


def create_app(config_name: str = None) -> Flask:
    config_name = config_name or os.environ.get("FLASK_ENV", "production")
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # --- Extensions ---
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # CORS: only the explicit allow-list from config, credentials off (we use
    # bearer tokens, not cookies, so no need for cross-site cookie exposure).
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=False,
    )

    limiter.init_app(app)

    # Security headers: HSTS, CSP, no-sniff, frame denial, etc.
    csp = {
        "default-src": "'self'",
        "img-src": ["'self'", "data:", "https:"],
    }
    talisman.init_app(
        app,
        content_security_policy=csp,
        force_https=(config_name == "production"),
        strict_transport_security=True,
        session_cookie_secure=(config_name == "production"),
    )

    # --- Blueprints ---
    from app.routes.auth import auth_bp
    from app.routes.properties import properties_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(properties_bp)
    app.register_blueprint(users_bp)

    _register_jwt_callbacks(app)
    _register_error_handlers(app)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


def _register_jwt_callbacks(app: Flask) -> None:
    from app.models import TokenBlocklist

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        return jsonify({"error": "Invalid token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(reason):
        return jsonify({"error": "Authorization token required"}), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has been revoked"}), 401


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(429)
    def rate_limited(e):
        return jsonify({"error": "Too many requests, please slow down"}), 429

    @app.errorhandler(500)
    def server_error(e):
        # Never leak stack traces or internals to the client.
        app.logger.exception("Unhandled server error")
        return jsonify({"error": "Internal server error"}), 500
