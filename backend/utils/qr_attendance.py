import base64
import hashlib
import hmac
import json
import time
from datetime import datetime, timezone

import config
from config.firebase_config import get_firestore
from google.cloud.firestore_v1 import Query

QR_SECRET = config.QR_SECRET
QR_EXPIRY_MINUTES = 15


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')


def _b64url_decode(s: str) -> bytes:
    padding = 4 - len(s) % 4
    if padding != 4:
        s += '=' * padding
    return base64.urlsafe_b64decode(s)


def generate_qr_code(session_id, class_id, date):
    """Generate a signed QR token for an attendance session."""
    issued_at = int(time.time() * 1000)
    expires_at = issued_at + QR_EXPIRY_MINUTES * 60 * 1000

    payload = {
        'sessionId': session_id,
        'classId': class_id,
        'date': date,
        'issuedAt': issued_at,
        'expiresAt': expires_at,
    }

    payload_b64 = _b64url_encode(json.dumps(payload, separators=(',', ':')).encode())
    signature = hmac.new(
        QR_SECRET.encode('utf-8'),
        payload_b64.encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()
    token = f'{payload_b64}.{signature}'

    return {
        'token': token,
        'qrData': f'havenofhope://attendance?token={token}',
        'sessionId': session_id,
        'classId': class_id,
        'date': date,
        'expiresAt': datetime.fromtimestamp(expires_at / 1000, tz=timezone.utc).isoformat(),
        'expiresInMinutes': QR_EXPIRY_MINUTES,
    }


def verify_qr_code(token):
    """Verify the QR token and return decoded payload."""
    if not token or not isinstance(token, str):
        return {'valid': False, 'error': 'Invalid token format'}

    parts = token.split('.')
    if len(parts) != 2:
        return {'valid': False, 'error': 'Malformed token'}

    payload_b64, signature = parts

    expected_signature = hmac.new(
        QR_SECRET.encode('utf-8'),
        payload_b64.encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        return {'valid': False, 'error': 'Invalid token signature'}

    try:
        payload = json.loads(_b64url_decode(payload_b64))
    except Exception:
        return {'valid': False, 'error': 'Cannot decode token payload'}

    now_ms = int(time.time() * 1000)
    if now_ms > payload['expiresAt']:
        expired_at = datetime.fromtimestamp(payload['expiresAt'] / 1000, tz=timezone.utc).strftime('%H:%M')
        return {
            'valid': False,
            'error': f'QR code expired at {expired_at}. Please request a new code from your teacher.',
            'expiredAt': datetime.fromtimestamp(payload['expiresAt'] / 1000, tz=timezone.utc).isoformat(),
        }

    return {'valid': True, 'payload': payload}


def record_attendance(student_id, session_data):
    """Record attendance via QR scan."""
    session_id = session_data['sessionId']
    class_id = session_data['classId']
    date = session_data['date']

    db = get_firestore()
    attendance_id = f'{date}_{class_id}_{student_id}'
    doc_ref = db.collection('attendance').document(attendance_id)
    existing = doc_ref.get()

    if existing.exists:
        return {
            'success': False,
            'message': 'Attendance already recorded for this session',
            'alreadyRecorded': True,
        }

    now = datetime.now(timezone.utc).isoformat()
    record = {
        'studentId': student_id,
        'classId': class_id,
        'sessionId': session_id,
        'date': date,
        'status': 'present',
        'method': 'qr_scan',
        'scannedAt': now,
        'createdAt': now,
    }
    doc_ref.set(record)
    return {'success': True, 'data': {'id': attendance_id, **record}}


def create_attendance_session(teacher_id, class_id, date, subject=None):
    """Create an attendance session (called by teacher when generating QR)."""
    db = get_firestore()
    session_id = f'{class_id}_{date}_{int(time.time() * 1000)}'
    now = datetime.now(timezone.utc).isoformat()
    expires_at = datetime.fromtimestamp(
        time.time() + QR_EXPIRY_MINUTES * 60, tz=timezone.utc
    ).isoformat()

    session = {
        'sessionId': session_id,
        'teacherId': teacher_id,
        'classId': class_id,
        'date': date,
        'subject': subject or 'General',
        'active': True,
        'createdAt': now,
        'expiresAt': expires_at,
    }
    db.collection('attendanceSessions').document(session_id).set(session)
    qr = generate_qr_code(session_id, class_id, date)
    return {'session': session, 'qr': qr}


def get_class_attendance(class_id, date):
    """Get attendance records for a class on a date."""
    db = get_firestore()
    snapshot = (
        db.collection('attendance')
        .where('classId', '==', class_id)
        .where('date', '==', date)
        .get()
    )
    return [{'id': doc.id, **doc.to_dict()} for doc in snapshot]


def get_student_attendance(student_id, start_date=None, end_date=None):
    """Get attendance records for a student, optionally filtered by date range."""
    db = get_firestore()
    query = db.collection('attendance').where('studentId', '==', student_id)
    if start_date:
        query = query.where('date', '>=', start_date)
    if end_date:
        query = query.where('date', '<=', end_date)
    snapshot = query.order_by('date', direction=Query.DESCENDING).get()
    return [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
