import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth

_firebase_app = None


def _configure_firebase_emulator():
    """Wire Firebase Admin SDK to local emulators when enabled via env."""
    use_emulator = os.environ.get('USE_FIREBASE_EMULATOR', 'false').lower() == 'true'
    if not use_emulator:
        return

    host = os.environ.get('FIREBASE_EMULATOR_HOST', '127.0.0.1')
    auth_port = os.environ.get('FIREBASE_AUTH_EMULATOR_PORT', '9100')
    os.environ['FIREBASE_AUTH_EMULATOR_HOST'] = f'{host}:{auth_port}'


def init_firebase():
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app
    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    _configure_firebase_emulator()

    firebase_options = {
        'databaseURL': os.environ.get('FIREBASE_DATABASE_URL', ''),
        'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET', ''),
    }
    firebase_project_id = os.environ.get('FIREBASE_PROJECT_ID', '').strip()
    if firebase_project_id:
        firebase_options['projectId'] = firebase_project_id

    service_account_path = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
    try:
        with open(service_account_path, 'r') as f:
            service_account = json.load(f)
        cred = credentials.Certificate(service_account)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f'serviceAccountKey.json not found or invalid, falling back to applicationDefault(): {e}')
        cred = credentials.ApplicationDefault()

    _firebase_app = firebase_admin.initialize_app(cred, firebase_options)
    return _firebase_app


def get_firestore():
    init_firebase()
    return firestore.client()


def get_auth():
    init_firebase()
    return auth
