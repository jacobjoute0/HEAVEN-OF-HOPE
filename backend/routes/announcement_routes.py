from flask import Blueprint
from controllers.announcement_controller import (
    get_announcements,
    create_announcement,
    delete_announcement,
)
from middleware.auth_middleware import verify_token, require_role

announcement_bp = Blueprint('announcements', __name__)

announcement_bp.route('/', methods=['GET'])(get_announcements)
announcement_bp.route('/', methods=['POST'])(
    verify_token(require_role('admin', 'teacher')(create_announcement))
)
announcement_bp.route('/<string:announcement_id>', methods=['DELETE'])(
    verify_token(require_role('admin')(delete_announcement))
)
