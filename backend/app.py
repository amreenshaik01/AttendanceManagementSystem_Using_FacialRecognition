from flask import Flask
from config import Config
from models import db
from routes.employee import employee_bp
from routes.admin import admin_bp
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # allow frontend requests

db.init_app(app)

# Register Blueprints
app.register_blueprint(employee_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
