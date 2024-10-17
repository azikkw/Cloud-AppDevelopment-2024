from flask import Flask, request, jsonify
import uuid
import requests
import os

app = Flask(__name__)

todos = []

API_KEY = os.environ.get('API_KEY')

PROCESS_USER_INPUTS_URL = "https://us-central1-western-avatar-435512-h0.cloudfunctions.net/process_user_inputs"
SEND_NOTIFICATION_URL = "https://us-central1-western-avatar-435512-h0.cloudfunctions.net/send_notification"

# API KEY check function
def require_api_key(func):
    def wrapper(*args, **kwargs):
        api_key = request.headers.get('api-key')
        if api_key != API_KEY:
            return jsonify({"error": "Unauthorized: Invalid API Key"}), 401
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

# All todos
@app.route('/')
def index():
    return jsonify(todos)

# Add new task to To-Do List
@app.route('/add', methods=['POST'])
@require_api_key
def add_todo():
    todo = {
        "id": str(uuid.uuid4()),
        "task": request.get_json()['task']
    }

    validation_response = requests.post(
        PROCESS_USER_INPUTS_URL, 
        headers={'Content-Type': 'application/json'},
        json=todo
    )

    if validation_response.json().get('error') == 'No todo provided!':
        error_message = {f"{validation_response.status_code}": f"{validation_response.text}"}
        return jsonify(error_message), 400
    elif validation_response.json().get('error') == 'No task provided!':
        error_message = 'No task provided! Write your task.'
        return jsonify({"error": error_message}), 400
    else:
        todos.append(todo)

        requests.post(
            SEND_NOTIFICATION_URL,
            headers={'Content-Type': 'application/json'},
            json={
                "todo": todo,
                "action": "created"
            }
        )

    return jsonify(todo)

@app.route('/update/<string:todo_id>', methods=['PUT'])
@require_api_key
def update_todo(todo_id):
    update_data = request.get_json()

    validation_response = requests.post(
        PROCESS_USER_INPUTS_URL, 
        headers={'Content-Type': 'application/json'},
        json={
            "id": todo_id,
            "task": update_data['task']
        }
    )

    if validation_response.json().get('error') == 'No task provided!':
        error_message = 'No task provided! Write your task.'
        return jsonify({"error": error_message}), 400
    else:
        result = next((todo for todo in todos if todo['id'] == todo_id), None)
        if not result:
            return jsonify({"error": "Todo not found."}), 404
        
        result['task'] = update_data['task']

        requests.post(
        SEND_NOTIFICATION_URL,
        headers={'Content-Type': 'application/json'},
        json={
            "todo": result,
            "action": "updated"
        }
    )
    
    return jsonify(result)

# Delete task from To-Do List
@app.route('/delete/<string:todo_id>', methods=['DELETE'])
@require_api_key
def delete_todo(todo_id):
    global todos
    todo_to_delete = next((todo for todo in todos if todo['id'] == todo_id), None)
    
    if not todo_to_delete:
        return jsonify({"error": "Todo not found."}), 404
    else:
        requests.post(
            SEND_NOTIFICATION_URL,
            headers={'Content-Type': 'application/json'},
            json={
                "todo": todo_to_delete,
                "action": "deleted"
            }
        )
    
    print(f"Deleting todo with id: {todo_id}")
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return jsonify({"message": "Todo deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)