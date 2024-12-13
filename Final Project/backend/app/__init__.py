from flask import Flask
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
# Routes
from .routes.auth import auth_bp
from .routes.events import events_bp
from .routes.reviews import reviews_bp
from .routes.registrations import registrations_bp
from .routes.profile import profile_bp
from .routes.notifications import notifications_bp
from .utils.pubsub.pubsub_listener import pubsub_bp

def create_app():
    app = Flask(__name__)

    # Firebase initialization
    cred = credentials.Certificate(r"cloud-app-dev-amen-e798f4004b5b.json")
    firebase_admin.initialize_app(cred)
    app.db = firestore.client()

    # CORS enabling
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Routes registration
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(events_bp, url_prefix='/events')
    app.register_blueprint(reviews_bp, url_prefix='/reviews')
    app.register_blueprint(registrations_bp, url_prefix='/registrations')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(notifications_bp, url_prefix='/notifications')
    app.register_blueprint(pubsub_bp, url_prefix='/pubsub')

    return app