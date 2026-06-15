"""
Run this once to seed initial data for ELATŌ CELEBRÉ.
Usage: python seed.py
"""
from app import create_app
from app.extensions import db
from app.models import Restaurant, Category, MenuItem, HeroSlide, AdminUser

app = create_app()

with app.app_context():
    db.create_all()

    # ── Restaurant ──────────────────────────────────────────────
    existing = Restaurant.query.filter_by(slug="elato-celebre").first()
    if not existing:
        restaurant = Restaurant(
            slug="elato-celebre",
            name="ELATŌ CELEBRÉ",
            tagline="Where Every Scoop Is A Celebration Of Flavour And Finesse",
            address="ELATŌ CELEBRÉ, Panemangalore, Narikombu, Karnataka – 574231",
            phone_primary="9731400313",
            phone_secondary="9686077485",
            whatsapp="9731400313",
            instagram="@elato.in",
            hours_weekday="11:00 AM – 11:00 PM",
            hours_weekend="11:00 AM – 10:00 PM",
            theme="sand-luxury",
        )
        db.session.add(restaurant)
        db.session.flush()  # get restaurant.id

        # ── Admin User ───────────────────────────────────────────
        admin = AdminUser(
            restaurant_id=restaurant.id,
            email="admin@elato.in",
        )
        admin.set_password("Elato@1234")  # CHANGE THIS
        db.session.add(admin)

        # ── Hero Slides ──────────────────────────────────────────
        hero_images = [
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1400&q=80",
            "https://images.unsplash.com/photo-1567206563114-c179706a56b4?w=1400&q=80",
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1400&q=80",
            "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1400&q=80",
        ]
        for i, url in enumerate(hero_images):
            db.session.add(HeroSlide(restaurant_id=restaurant.id, image_url=url, sort_order=i))

        # ── Categories & Items ───────────────────────────────────
        seed_data = [
            {
                "name": "Special Ice Creams",
                "image_url": "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800&q=80",
                "items": [
                    ("Vanilla Bean Gelato", "Slow-churned with Madagascar vanilla", 149, True),
                    ("Dark Chocolate Truffle", "Belgian couverture, sea salt finish", 179, True),
                    ("Rose Lychee Sorbet", "Floral, refreshing, dairy-free", 169, True),
                    ("Pistachio Crème", "Stone-ground Sicilian pistachios", 189, True),
                    ("Salted Caramel Swirl", "House-made caramel, Himalayan salt", 159, True),
                ]
            },
            {
                "name": "Cakes",
                "image_url": "https://images.unsplash.com/photo-1535141192574-5f7bebe2ddb7?w=800&q=80",
                "items": [
                    ("Classic New York Cheesecake", "Biscuit base, vanilla cream", 249, True),
                    ("Dark Forest Gateau", "Layers of cherry and dark chocolate", 279, True),
                    ("Tiramisu Slice", "Espresso-soaked, mascarpone cream", 229, True),
                ]
            },
            {
                "name": "Fries & Sandwiches",
                "image_url": "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80",
                "items": [
                    ("Truffle Parmesan Fries", "Shaved parmesan, truffle oil", 199, True),
                    ("Classic Club Sandwich", "Triple-decker, toasted brioche", 229, False),
                    ("Smoked Chicken Wrap", "House sauce, fresh greens", 219, False),
                ]
            },
            {
                "name": "Shakes",
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                "items": [
                    ("Classic Vanilla Shake", "Thick, creamy, timeless", 149, True),
                    ("Oreo Dream Shake", "Crushed Oreo, whipped cream", 169, True),
                    ("Strawberry Fields", "Fresh strawberry, light cream", 159, True),
                ]
            },
            {
                "name": "Mojitos",
                "image_url": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
                "items": [
                    ("Classic Mint Mojito", "Fresh mint, lime, sparkling water", 129, True),
                    ("Watermelon Mojito", "Fresh watermelon, mint, lime", 139, True),
                    ("Blue Curacao Mojito", "Citrus blue, mint, club soda", 149, True),
                ]
            },
            {
                "name": "Burgers & Pizza",
                "image_url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
                "items": [
                    ("Classic Cheeseburger", "Aged cheddar, house sauce, brioche", 249, False),
                    ("Mushroom Swiss Burger", "Sautéed mushrooms, Swiss cheese", 269, True),
                    ("Margherita Pizza", "San Marzano tomatoes, fresh mozzarella", 299, True),
                    ("BBQ Chicken Pizza", "Smoked chicken, red onion, BBQ base", 329, False),
                ]
            },
        ]

        for i, cat_data in enumerate(seed_data):
            category = Category(
                restaurant_id=restaurant.id,
                name=cat_data["name"],
                image_url=cat_data["image_url"],
                sort_order=i,
            )
            db.session.add(category)
            db.session.flush()

            for j, (name, desc, price, is_veg) in enumerate(cat_data["items"]):
                db.session.add(MenuItem(
                    restaurant_id=restaurant.id,
                    category_id=category.id,
                    name=name,
                    description=desc,
                    price=price,
                    is_veg=is_veg,
                    sort_order=j,
                ))

        db.session.commit()
        print("✅ Seed complete. Admin: admin@elato.in / ElatoAdmin@2024")
    else:
        print("ℹ️  Restaurant already exists. Skipping seed.")