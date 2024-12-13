from functools import wraps
from flask import request, jsonify
from firebase_admin import auth

def firebase_auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authorization token is missing"}), 401
        try:
            decoded_token = auth.verify_id_token(token.replace("Bearer ", ""))
            request.user = decoded_token
        except Exception as e:
            return jsonify({"error": str(e)}), 401
        return f(*args, **kwargs)
    return wrapper