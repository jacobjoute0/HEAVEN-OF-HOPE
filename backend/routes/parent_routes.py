from flask import Blueprint
from controllers.parent_controller import (
    get_all_parents,
    get_parent_by_id,
    create_parent,
    update_parent,
    delete_parent,
)
from middleware.auth_middleware import verify_token, require_role

parent_bp = Blueprint('parents', __name__)

parent_bp.route('/', methods=['GET'])(
    verify_token(require_role('admin', 'teacher')(get_all_parents))
)
parent_bp.route('/<string:parent_id>', methods=['GET'])(
    verify_token(get_parent_by_id)
)
parent_bp.route('/', methods=['POST'])(
    verify_token(require_role('admin')(create_parent))
)
parent_bp.route('/<string:parent_id>', methods=['PUT'])(
    verify_token(require_role('admin')(update_parent))
)
parent_bp.route('/<string:parent_id>', methods=['DELETE'])(
    verify_token(require_role('admin')(delete_parent))
)
