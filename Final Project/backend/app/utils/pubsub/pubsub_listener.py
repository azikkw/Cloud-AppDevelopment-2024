# from google.cloud import pubsub_v1
# from google.cloud import firestore
# import json
# import requests

# subscriber = pubsub_v1.SubscriberClient()
# db = firestore.Client()

# SEND_NOTIFICATION_URL = "https://us-central1-cloud-app-dev-amen.cloudfunctions.net/send_notification"

# with open('app/utils/pubsub/subscriptions_config.json') as f:
#     subscriptions_config = json.load(f)

# def callback(message, subscription_name):
#     try:
#         data = json.loads(message.data.decode('utf-8'))
        
#         if subscription_name == 'users-registration-topic-sub':
#             db.collection('users').document(data['id']).set(data)
#             print(f"User {data['username']} added to Firestore.")
#         if subscription_name == 'notification-topic-sub':
#             requests.post(
#                 SEND_NOTIFICATION_URL,
#                 headers={'Content-Type': 'application/json'},
#                 json={"notification": data}
#             )
#             print(data['message'])
#         if subscription_name == 'user-notifications-topic-sub':
#             db.collection('notifications').document(data['id']).set(data)
#             print("Notification successfully added")
#         if subscription_name == 'change-event-capacity-topic-sub':
#             event_ref = db.collection('events').document(data['event_id'])
#             event = event_ref.get()
#             event_data = event.to_dict()
#             capacity = event_data['capacity']
#             if(data['changing'] == 'dec'):
#                 updated_data = {"capacity": capacity - 1}
#                 event_ref.update(updated_data)
#             else:
#                 updated_data = {"capacity": capacity + 1}
#                 event_ref.update(updated_data)
#             print("Event capacity changed")
        
#         message.ack()
        
#     except Exception as e:
#         print(f"Error processing message from {subscription_name}: {str(e)}")

# def listen_for_messages():
#     for subscription in subscriptions_config['subscriptions']:
#         subscription_path = subscriber.subscription_path(subscription['project_id'], subscription['name'])
        
#         # Для каждой подписки создаем поток прослушивания сообщений
#         subscriber.subscribe(subscription_path, callback=lambda message, name=subscription['name']: callback(message, name))
#         print(f"Listening for messages on {subscription['name']}...")

from flask import Blueprint, request, jsonify
from google.cloud import firestore
import base64
import json
import requests

pubsub_bp = Blueprint('pubsub', __name__)
db = firestore.Client()

SEND_NOTIFICATION_URL = "https://us-central1-cloud-app-dev-amen.cloudfunctions.net/send_notification"

def process_message(subscription_name, data):
    try:
        if subscription_name == 'users-registration-topic-sub':
            db.collection('users').document(data['id']).set(data)
            print(f"User {data['username']} added to Firestore.")
        elif subscription_name == 'notification-topic-sub':
            requests.post(
                SEND_NOTIFICATION_URL,
                headers={'Content-Type': 'application/json'},
                json={"notification": data}
            )
            print(f"Notification sent: {data['message']}")
        elif subscription_name == 'user-notifications-topic-sub':
            db.collection('notifications').document(data['id']).set(data)
            print("Notification successfully added.")
        elif subscription_name == 'change-event-capacity-topic-sub':
            event_ref = db.collection('events').document(data['event_id'])
            event = event_ref.get()
            event_data = event.to_dict()
            capacity = event_data['capacity']
            if data['changing'] == 'dec':
                updated_data = {"capacity": capacity - 1}
                event_ref.update(updated_data)
            else:
                updated_data = {"capacity": capacity + 1}
                event_ref.update(updated_data)
            print("Event capacity changed.")

    except Exception as e:
        print(f"Error processing message for {subscription_name}: {str(e)}")

@pubsub_bp.route('/<subscription_name>', methods=['POST'])
def handle_pubsub_message(subscription_name):
    try:
        envelope = request.get_json()
        if not envelope or 'message' not in envelope:
            return jsonify({"error": "Invalid Pub/Sub message format"}), 400

        message = envelope['message']
        data = base64.b64decode(message['data']).decode('utf-8')
        data_json = json.loads(data)

        process_message(subscription_name, data_json)

        return jsonify({"status": "Message processed"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
