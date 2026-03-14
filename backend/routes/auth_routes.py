from flask import Blueprint
from controllers.auth_controller import login, logout, get_profile
from middleware.auth_middleware import verify_token

auth_bp = Blueprint('auth', __name__)

auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/logout', methods=['POST'])(verify_token(logout))
auth_bp.route('/profile', methods=['GET'])(verify_token(get_profile))
