from flask import Blueprint, request, jsonify, current_app
import uuid
from ..utils.auth import firebase_auth_required
from datetime import datetime, timezone
from ..utils.pubsub.pubsub_publishers import publish_notification, publish_user_notifications

reviews_bp = Blueprint('reviews', __name__)


@reviews_bp.route('/', methods=['GET'])
@firebase_auth_required
def get_reviews():
    event_id = request.headers.get('event-id')

    try:
        reviews_ref = current_app.db.collection('reviews').where('event_id', '==', event_id)
        reviews = reviews_ref.stream()

        all_reviews = []
        for review in reviews:
            review_data = review.to_dict()
            review_data['id'] = review.id
            all_reviews.append(review_data)

        return jsonify(all_reviews), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@reviews_bp.route('', methods=['POST'])
@firebase_auth_required
def add_review():
    data = request.json

    required_fields = ['event_id', 'user_id', 'rating', 'comment']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    review_id = str(uuid.uuid4())
    review_data = {
        'id': review_id,
        'event_id': data['event_id'],
        'user_id': data['user_id'],
        'rating': data['rating'],
        'comment': data['comment'],
        'username': data['username'],
        'created_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    }
    current_app.db.collection('reviews').document(review_id).set(review_data)

    notification_id = str(uuid.uuid4())
    notification_sent_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    notification_data = {
        "id": notification_id,
        "user_id": data['user_id'],
        "message": f"Notification {notification_id}. User {data['user_id']} leaved review to event: {data['event_id']} with rating: {data['rating']} at {notification_sent_at}",
        "sent_at": notification_sent_at
    }
    publish_notification(notification_data)

    user_notification_id = str(uuid.uuid4())
    user_notification_data = {
        "id": user_notification_id,
        "user_id": data['event_creator'],
        "message": f"User {data['username']} leaved review to your event {data['event_id']}",
        "sent_at": notification_sent_at
    }
    publish_user_notifications(user_notification_data)

    return jsonify({"message": "Review added successfully", "review_id": review_id}), 201


@reviews_bp.route('/<event_id>/<user_id>', methods=['GET'])
@firebase_auth_required
def check_if_reviewed(event_id, user_id):
    try:
        reviews_ref = current_app.db.collection('reviews')
        query = reviews_ref.where('event_id', '==', event_id).where('user_id', '==', user_id)
        reviews = query.stream()

        if any(reviews):
            return jsonify({'message': 'Review exists'}), 200
        else:
            return jsonify({'message': 'No review found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
