from flask import request, jsonify, g
from config.firebase_config import get_auth, get_firestore


def login():
    data = request.get_json() or {}
    id_token = data.get('idToken')
    if not id_token:
        return jsonify({'success': False, 'message': 'ID token required'}), 400

    try:
        decoded = get_auth().verify_id_token(id_token)
        db = get_firestore()
        user_doc = db.collection('users').document(decoded['uid']).get()
        user_data = user_doc.to_dict() if user_doc.exists else {}

        return jsonify({
            'success': True,
            'user': {
                'uid': decoded['uid'],
                'email': decoded.get('email', ''),
                'role': user_data.get('role', 'student'),
                'name': user_data.get('name', decoded.get('name', '')),
            },
        })
    except Exception:
        return jsonify({'success': False, 'message': 'Authentication failed'}), 401


def logout():
    try:
        get_auth().revoke_refresh_tokens(g.user['uid'])
        return jsonify({'success': True, 'message': 'Logged out successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Logout failed'}), 500


def get_profile():
    try:
        db = get_firestore()
        user_doc = db.collection('users').document(g.user['uid']).get()
        if not user_doc.exists:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        return jsonify({'success': True, 'user': {'uid': g.user['uid'], **user_doc.to_dict()}})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch profile'}), 500
