from flask import Blueprint
from controllers.teacher_controller import (
    get_all_teachers,
    get_teacher_by_id,
    create_teacher,
    update_teacher,
    delete_teacher,
)
from middleware.auth_middleware import verify_token, require_role

teacher_bp = Blueprint('teachers', __name__)

teacher_bp.route('/', methods=['GET'])(
    verify_token(require_role('admin')(get_all_teachers))
)
teacher_bp.route('/<string:teacher_id>', methods=['GET'])(
    verify_token(require_role('admin')(get_teacher_by_id))
)
teacher_bp.route('/', methods=['POST'])(
    verify_token(require_role('admin')(create_teacher))
)
teacher_bp.route('/<string:teacher_id>', methods=['PUT'])(
    verify_token(require_role('admin')(update_teacher))
)
teacher_bp.route('/<string:teacher_id>', methods=['DELETE'])(
    verify_token(require_role('admin')(delete_teacher))
)
