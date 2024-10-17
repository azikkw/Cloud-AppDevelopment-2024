import functions_framework

@functions_framework.http
def send_notification(request):
    if request.content_type != 'application/json':
        return {"error": "Unsupported Media Type"}, 415

    request_json = request.get_json()
    todo = request_json['todo']
    action = request_json['action']

    if 'id' not in todo or 'task' not in todo:
        print(f'Error 400: No todo provided!')
        return {"error": "No todo provided"}, 400

    if action == 'created':
        print(f'New todo added: {todo}')
        message = f"Todo {todo} created."
    if action == 'updated':
        print(f'Todo updated: {todo}')
        message = f"Todo {todo} updated."
    else:
        print(f"Todo deleted! {todo}")
        message = f"Todo {todo} deleted."
        
    return {"message": message}, 200