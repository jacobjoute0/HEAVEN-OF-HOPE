from functools import wraps
from flask import request, jsonify, g
from config.firebase_config import get_auth


def verify_token(f):
    """Decorator that verifies a Firebase ID token from the Authorization header."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'No token provided'}), 401

        token = auth_header.split(' ', 1)[1]
        try:
            decoded = get_auth().verify_id_token(token)
            g.user = decoded
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid or expired token'}), 401

        return f(*args, **kwargs)
    return decorated_function


def require_role(*roles):
    """Decorator factory that checks whether the authenticated user has one of the required roles."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = getattr(g, 'user', None)
            if user is None:
                return jsonify({'success': False, 'message': 'Not authenticated'}), 401
            user_role = user.get('role', 'student')
            if user_role not in roles:
                return jsonify({'success': False, 'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
