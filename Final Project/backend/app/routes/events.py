from flask import Blueprint, request, jsonify, current_app
import uuid
from ..utils.auth import firebase_auth_required
from datetime import datetime, timezone
from ..utils.pubsub.pubsub_publishers import publish_notification

events_bp = Blueprint('events', __name__)

# Получение всех событий (кроме созданных текущим пользователем)
@events_bp.route('', methods=['GET'])
@firebase_auth_required
def get_events():
    uid = request.headers.get('uid')

    try:
        events_ref = current_app.db.collection('events').where('created_by', '!=', uid)
        events = events_ref.stream()

        all_events = []
        for event in events:
            event_data = event.to_dict()
            event_data['id'] = event.id
            all_events.append(event_data)

        return jsonify(all_events), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Получение событий, созданных пользователем по его UID
@events_bp.route('/<string:uid>', methods=['GET'])
@firebase_auth_required
def get_user_events(uid):
    try:
        events_ref = current_app.db.collection('events').where('created_by', '==', uid)
        events = events_ref.stream()

        user_events = []
        for event in events:
            event_data = event.to_dict()
            event_data['id'] = event.id
            user_events.append(event_data)

        return jsonify(user_events), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Создание нового события
@events_bp.route('', methods=['POST'])
@firebase_auth_required
def create_event():
    try:
        data = request.json

        event_id = str(uuid.uuid4())
        event_data = {
            'id': event_id,
            'title': data.get('title'),
            'description': data.get('description'),
            'date_time': data.get('date_time'),
            'location': data.get('location'),
            'capacity': data.get('capacity'),
            'price': data.get('price'),
            'created_by': data.get('created_by'),
            'created_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        }
        current_app.db.collection('events').document(event_id).set(event_data)

        notification_id = str(uuid.uuid4())
        notification_sent_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        notification_data = {
            "id": notification_id,
            "user_id": data.get('created_by'),
            "message": f"Notification {notification_id}. User {data.get('created_by')} created event: {event_id}. {data.get('title')} at {notification_sent_at}",
            "sent_at": notification_sent_at
        }
        publish_notification(notification_data)

        return jsonify({"message": "Event created successfully", "title": event_data['title']}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Получение события по его ID
@events_bp.route('/<event_id>/', methods=['GET'])
@firebase_auth_required
def get_event_by_id(event_id):
    try:
        event_ref = current_app.db.collection('events').document(event_id)
        event_doc = event_ref.get()

        if not event_doc.exists:
            return jsonify({'error': 'Event not found'}), 404

        event_data = event_doc.to_dict()
        return jsonify(event_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Удаление события по ID
@events_bp.route('/<event_id>/', methods=['DELETE'])
@firebase_auth_required
def delete_event(event_id):
    try:
        event_ref = current_app.db.collection('events').document(event_id)
        event = event_ref.get()
        event_data = event.to_dict()

        if not event.exists:
            return jsonify({'error': 'Event not found'}), 404

        notification_id = str(uuid.uuid4())
        notification_sent_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        notification_data = {
            "id": notification_id,
            "user_id": event_data.get('created_by'),
            "message": f"Notification {notification_id}. User {event_data.get('created_by')} deleted event: {event_id}. {event_data.get('title')} at {notification_sent_at}",
            "sent_at": notification_sent_at
        }
        publish_notification(notification_data)

        event_ref.delete()
        return jsonify({'message': 'Event successfully deleted'}), 200

    except Exception as e:
        return jsonify({'error': f'Error at event deleting: {str(e)}'}), 500


# Обновление события по ID
@events_bp.route('/<event_id>/', methods=['PUT'])
@firebase_auth_required
def update_event(event_id):
    data = request.json

    try:
        event_ref = current_app.db.collection('events').document(event_id)
        event = event_ref.get()
        event_data = event.to_dict()

        if not event.exists:
            return jsonify({'error': 'Event not found'}), 404

        updated_data = {**data, 'updated_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}
        event_ref.update(updated_data)

        notification_id = str(uuid.uuid4())
        notification_sent_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        notification_data = {
            "id": notification_id,
            "user_id": event_data.get('created_by'),
            "message": f"Notification {notification_id}. User {event_data.get('created_by')} updated event {event_id} at {notification_sent_at}",
            "sent_at": notification_sent_at
        }
        publish_notification(notification_data)

        return jsonify({'message': 'Event successfully updated'}), 200

    except Exception as e:
        return jsonify({'error': f'Error at event updating: {str(e)}'}), 500
