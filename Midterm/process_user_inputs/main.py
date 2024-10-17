import functions_framework

@functions_framework.http
def process_user_inputs(request):
    if request.content_type != 'application/json':
        return {"error": "Unsupported Media Type"}, 415

    request_json = request.get_json()

    if not request_json or 'id' not in request_json or 'task' not in request_json:
        return {"error": "No todo provided!"}, 400

    todo = request_json

    if len(todo['task']) == 0:
        return {"error": "No task provided!"}, 400

    return {"message": "New todo created and validated."}, 200