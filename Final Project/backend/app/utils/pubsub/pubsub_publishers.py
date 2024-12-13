from google.cloud import pubsub_v1
import json

project_id = 'cloud-app-dev-amen'


# Registration publisher
publisher1 = pubsub_v1.PublisherClient()
topic_name1 = 'users-registration-topic'


def publish_user_data(user_data):
    topic_path = publisher1.topic_path(project_id, topic_name1)
    message = json.dumps(user_data).encode('utf-8')
    
    future = publisher1.publish(topic_path, message)
    future.result()


# System notifications
publisher2 = pubsub_v1.PublisherClient()
topic_name2 = 'notification-topic'

def publish_notification(notification_data):
    topic_path = publisher2.topic_path(project_id, topic_name2)
    message = json.dumps(notification_data).encode('utf-8')
    
    future = publisher2.publish(topic_path, message)
    future.result()


# User notifications
publisher3 = pubsub_v1.PublisherClient()
topic_name3 = 'user-notifications-topic'

def publish_user_notifications(notification_data):
    topic_path = publisher3.topic_path(project_id, topic_name3)
    message = json.dumps(notification_data).encode('utf-8')
    
    future = publisher3.publish(topic_path, message)
    future.result()


# Event capacity
publisher4 = pubsub_v1.PublisherClient()
topic_name4 = 'change-event-capacity-topic'

def publish_changing_event_capacity(event_data):
    topic_path = publisher4.topic_path(project_id, topic_name4)
    message = json.dumps(event_data).encode('utf-8')
    
    future = publisher4.publish(topic_path, message)
    future.result()