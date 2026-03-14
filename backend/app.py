import logging
import os
from datetime import datetime, timezone

from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config.firebase_config import init_firebase
from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.teacher_routes import teacher_bp
from routes.parent_routes import parent_bp
from routes.admission_routes import admission_bp
from routes.announcement_routes import announcement_bp

logging.basicConfig(level=logging.INFO)

# Initialise Firebase before the first request
init_firebase()

app = Flask(__name__)

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

# CORS – mirrors Express cors({ origin, credentials: true })
CORS(app, origins=[FRONTEND_URL], supports_credentials=True)

# Rate limiting – 100 requests per 15 minutes on all /api/* routes (mirrors express-rate-limit)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=['100 per 15 minutes'],
    storage_uri='memory://',
)

# Register blueprints
app.register_blueprint(auth_bp,         url_prefix='/api/auth')
app.register_blueprint(student_bp,      url_prefix='/api/students')
app.register_blueprint(teacher_bp,      url_prefix='/api/teachers')
app.register_blueprint(announcement_bp, url_prefix='/api/announcements')
app.register_blueprint(parent_bp,       url_prefix='/api/parents')
app.register_blueprint(admission_bp,    url_prefix='/api/admissions')


@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'ok',
        'school': 'Haven of Hope Academy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
    })


@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'message': 'Route not found'}), 404


@app.errorhandler(Exception)
def handle_exception(e):
    status = getattr(e, 'code', 500) or 500
    message = getattr(e, 'description', str(e)) or 'Internal Server Error'
    app.logger.error('Unhandled exception: %s', e, exc_info=True)
    return jsonify({'success': False, 'message': message}), status


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.logger.info('Haven of Hope Academy server running on port %d', port)
    app.run(host='0.0.0.0', port=port, debug=False)
