from datetime import datetime, timezone
from flask import request, jsonify, g
from google.cloud.firestore_v1 import Query
from config.firebase_config import get_firestore


def _now():
    return datetime.now(timezone.utc).isoformat()


def get_announcements():
    try:
        db = get_firestore()
        snapshot = (
            db.collection('announcements')
            .order_by('createdAt', direction=Query.DESCENDING)
            .limit(20)
            .get()
        )
        announcements = [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
        return jsonify({'success': True, 'data': announcements})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch announcements'}), 500


def create_announcement():
    try:
        db = get_firestore()
        data = {
            **(request.get_json() or {}),
            'authorId': g.user['uid'],
            'createdAt': _now(),
        }
        doc_ref = db.collection('announcements').add(data)[1]
        return jsonify({'success': True, 'data': {'id': doc_ref.id, **data}}), 201
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to create announcement'}), 500


def delete_announcement(announcement_id):
    try:
        db = get_firestore()
        db.collection('announcements').document(announcement_id).delete()
        return jsonify({'success': True, 'message': 'Announcement deleted'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to delete announcement'}), 500
