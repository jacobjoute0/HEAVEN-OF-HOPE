from flask import Blueprint
from controllers.student_controller import (
    get_all_students,
    get_student_by_id,
    create_student,
    update_student,
    delete_student,
)
from middleware.auth_middleware import verify_token, require_role

student_bp = Blueprint('students', __name__)

student_bp.route('/', methods=['GET'])(
    verify_token(require_role('admin', 'teacher')(get_all_students))
)
student_bp.route('/<string:student_id>', methods=['GET'])(
    verify_token(get_student_by_id)
)
student_bp.route('/', methods=['POST'])(
    verify_token(require_role('admin')(create_student))
)
student_bp.route('/<string:student_id>', methods=['PUT'])(
    verify_token(require_role('admin', 'teacher')(update_student))
)
student_bp.route('/<string:student_id>', methods=['DELETE'])(
    verify_token(require_role('admin')(delete_student))
)
