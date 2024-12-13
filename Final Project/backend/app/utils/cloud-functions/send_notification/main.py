import functions_framework

@functions_framework.http
def send_notification(request):
    if request.content_type != 'application/json':
        return {"error": "Unsupported Media Type"}, 415

    request_json = request.get_json()
    notification = request_json['notification']
    message = notification['message']
        
    print(message)
    return message, 200