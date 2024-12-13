from flask import Blueprint, request, jsonify, current_app
import uuid
from ..utils.auth import firebase_auth_required
from datetime import datetime, timezone
from google.cloud import pubsub_v1
import json

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/<user_id>', methods=['GET'])
@firebase_auth_required
def get_notifications(user_id):
    try:
        notifications_ref = current_app.db.collection('notifications').where('user_id', '==', user_id)
        notifications = notifications_ref.stream()

        all_notifications = []
        for notification in notifications:
            notification_data = notification.to_dict()
            notification_data['id'] = notification.id
            all_notifications.append(notification_data)

        return jsonify(all_notifications), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500