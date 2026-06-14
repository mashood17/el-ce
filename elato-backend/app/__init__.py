from flask import Flask
from .config import get_config
from .extensions import db, jwt, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": [
                app.config["FRONTEND_URL"],
                app.config["ADMIN_URL"],
            ],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    })

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.restaurants import restaurants_bp
    from .routes.categories import categories_bp
    from .routes.menu_items import menu_items_bp
    from .routes.hero_slides import hero_slides_bp
    from .routes.upload import upload_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(restaurants_bp, url_prefix="/api/restaurants")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(menu_items_bp, url_prefix="/api/items")
    app.register_blueprint(hero_slides_bp, url_prefix="/api/hero")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")

    return app