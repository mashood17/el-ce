from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    try:
        db.create_all()
        print("✅ Database connected and tables ready")
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    app.run(debug=False, port=5000)