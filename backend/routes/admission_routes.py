from flask import Blueprint
from controllers.admission_controller import (
    get_admissions,
    get_admission_by_id,
    create_admission,
    update_admission_status,
    delete_admission,
)
from middleware.auth_middleware import verify_token, require_role

admission_bp = Blueprint('admissions', __name__)

# Public route – anyone can submit an application
admission_bp.route('/', methods=['POST'])(create_admission)

# Protected routes – require authentication
admission_bp.route('/', methods=['GET'])(
    verify_token(require_role('admin')(get_admissions))
)
admission_bp.route('/<string:admission_id>', methods=['GET'])(
    verify_token(require_role('admin')(get_admission_by_id))
)
admission_bp.route('/<string:admission_id>/status', methods=['PUT'])(
    verify_token(require_role('admin')(update_admission_status))
)
admission_bp.route('/<string:admission_id>', methods=['DELETE'])(
    verify_token(require_role('admin')(delete_admission))
)
