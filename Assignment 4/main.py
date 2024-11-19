from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

todos = []

# All todos
@app.route('/')
def index():
    return jsonify(todos)

# Add new task to To-Do List
@app.route('/add', methods=['POST'])
def add_todo():
    todo = {
        "id": str(uuid.uuid4()),
        "task": request.get_json()['task']
    }
    todos.append(todo)
    return jsonify(todo)

# Update existed todo in To-Do List
@app.route('/update/<string:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    update_data = request.get_json()
    result = next((todo for todo in todos if todo['id'] == todo_id), None)
    result['task'] = update_data['task']
    return jsonify(result)

# Delete task from To-Do List
@app.route('/delete/<string:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return jsonify({"message": "Todo deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)