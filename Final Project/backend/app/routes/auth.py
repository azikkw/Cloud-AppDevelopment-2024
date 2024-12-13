from flask import Blueprint, request, jsonify, current_app
from firebase_admin import auth
import hashlib
from datetime import datetime, timezone
import uuid
from ..utils.pubsub.pubsub_publishers import publish_user_data, publish_notification

auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if not email or not password or not username or not first_name or not last_name:
        return jsonify({"error": "All fields are required"}), 400

    try:
        user = auth.create_user(
            email=email, 
            password=password
        )
        
        password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        user_data = {
            "id": user.uid,
            "username": username,
            "email": email,
            "password_hash": password_hash, 
            "first_name": first_name,
            "last_name": last_name,
            "created_at": datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        }
        publish_user_data(user_data)

        notification_id = str(uuid.uuid4())
        notification_sent_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        notification_data = {
            "id": notification_id,
            "user_id": user.uid,
            "message": f"Notification {notification_id}. User {user.uid} with username: {username} registered and added to DB at {notification_sent_at}",
            "sent_at": notification_sent_at
        }
        publish_notification(notification_data)
        # current_app.db.collection('users').document(user.uid).set(user_data)
        
        return jsonify({"message": "User registered successfully", "uid": user.uid}), 201
    
    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 400
