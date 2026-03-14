from datetime import datetime, timezone
from flask import request, jsonify
from config.firebase_config import get_firestore


def _now():
    return datetime.now(timezone.utc).isoformat()


def get_all_parents():
    try:
        db = get_firestore()
        snapshot = db.collection('parents').get()
        parents = [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
        return jsonify({'success': True, 'data': parents})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch parents'}), 500


def get_parent_by_id(parent_id):
    try:
        db = get_firestore()
        doc = db.collection('parents').document(parent_id).get()
        if not doc.exists:
            return jsonify({'success': False, 'message': 'Parent not found'}), 404
        return jsonify({'success': True, 'data': {'id': doc.id, **doc.to_dict()}})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch parent'}), 500


def create_parent():
    try:
        db = get_firestore()
        now = _now()
        parent_data = {**(request.get_json() or {}), 'createdAt': now, 'updatedAt': now}
        doc_ref = db.collection('parents').add(parent_data)[1]
        return jsonify({'success': True, 'data': {'id': doc_ref.id, **parent_data}}), 201
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to create parent'}), 500


def update_parent(parent_id):
    try:
        db = get_firestore()
        update_data = {**(request.get_json() or {}), 'updatedAt': _now()}
        db.collection('parents').document(parent_id).update(update_data)
        return jsonify({'success': True, 'message': 'Parent updated successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to update parent'}), 500


def delete_parent(parent_id):
    try:
        db = get_firestore()
        db.collection('parents').document(parent_id).delete()
        return jsonify({'success': True, 'message': 'Parent deleted successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to delete parent'}), 500
