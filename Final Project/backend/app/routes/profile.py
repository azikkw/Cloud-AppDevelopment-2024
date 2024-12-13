from flask import Blueprint, jsonify, current_app
from ..utils.auth import firebase_auth_required

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/<string:uid>', methods=['GET'])
@firebase_auth_required
def get_profile(uid):
    try:
        user_ref = current_app.db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        return jsonify(user_doc.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500