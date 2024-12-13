from flask import Blueprint, request, jsonify, current_app
import uuid
from ..utils.auth import firebase_auth_required
from ..utils.pubsub.pubsub_publishers import publish_notification, publish_user_notifications, publish_changing_event_capacity
from datetime import datetime, timezone

registrations_bp = Blueprint('registrations', __name__)

@registrations_bp.route('', methods=['POST'])
@firebase_auth_required
def add_registration():
    try:
        data = request.json
        user_id = data.get('user_id')
        event_id = data.get('event_id')
        event_creator = data.get('event_creator')

        if not user_id or not event_id:
            return jsonify({'error': 'All fields are required: user_id, event_id, ticket_id, number_of_tickets'}), 400

        registration_id = str(uuid.uuid4())
        ticket_id = str(uuid.uuid4())

        registration_data = {
            'id': registration_id,
            'user_id': user_id,
            'event_id': event_id,
            'registration_date': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
            'ticket_id': ticket_id
        }
        current_app.db.collection('registrations').document(registration_id).set(registration_data)

        notification_id = str(uuid.uuid4())
        notification_sent_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        notification_data = {
            "id": notification_id,
            "user_id": user_id,
            "message": f"Notification {notification_id}. User {user_id} registered to event: {event_id} at {notification_sent_at}",
            "sent_at": notification_sent_at
        }
        publish_notification(notification_data)

        user_notification_id = str(uuid.uuid4())
        user_notification_data = {
            "id": user_notification_id,
            "user_id": event_creator,
            "message": f"User {user_id} registered to your event {event_id}",
            "sent_at": notification_sent_at
        }
        publish_user_notifications(user_notification_data)
        
        publish_changing_event_capacity({"event_id": event_id, "changing": "dec"})

        return jsonify({'message': 'Registration added successfully', 'id': registration_id}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@registrations_bp.route('/<user_id>', methods=['GET'])
@firebase_auth_required
def get_registrations(user_id):
    try:
        registrations_ref = current_app.db.collection('registrations').where('user_id', '==', user_id)
        registrations = registrations_ref.stream()

        registrations_list = []
        for registration in registrations:
            reg_data = registration.to_dict()
            reg_data['id'] = registration.id
            event_ref = current_app.db.collection('events').document(reg_data['event_id'])
            event = event_ref.get()
            if event.exists:
                reg_data['event'] = event.to_dict()
            registrations_list.append(reg_data)

        return jsonify(registrations_list), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@registrations_bp.route('/<event_id>/<user_id>', methods=['GET'])
@firebase_auth_required
def check_if_registered_to_event(event_id, user_id):
    try:
        registrations_ref = current_app.db.collection('registrations')
        query = registrations_ref.where('event_id', '==', event_id).where('user_id', '==', user_id)
        registrations = query.stream()

        if any(registrations):
            return jsonify({'message': 'Registration exists'}), 200
        else:
            return jsonify({'message': 'No registration found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@registrations_bp.route('/<registration_id>', methods=['DELETE'])
@firebase_auth_required
def delete_registration(registration_id):
    event_id = request.headers.get('event-id')

    try:
        registration_ref = current_app.db.collection('registrations').document(registration_id)
        registration = registration_ref.get()

        if not registration.exists:
            return jsonify({'error': 'Registration not found'}), 404
        
        publish_changing_event_capacity({"event_id": event_id, "changing": "inc"})

        registration_ref.delete()
        return jsonify({'message': 'Registration successfully deleted'}), 200

    except Exception as e:
        return jsonify({'error': f'Error deleting registration: {str(e)}'}), 500