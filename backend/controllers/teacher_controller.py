from datetime import datetime, timezone
from flask import request, jsonify
from config.firebase_config import get_firestore


def _now():
    return datetime.now(timezone.utc).isoformat()


def get_all_teachers():
    try:
        db = get_firestore()
        snapshot = db.collection('teachers').get()
        teachers = [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
        return jsonify({'success': True, 'data': teachers})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch teachers'}), 500


def get_teacher_by_id(teacher_id):
    try:
        db = get_firestore()
        doc = db.collection('teachers').document(teacher_id).get()
        if not doc.exists:
            return jsonify({'success': False, 'message': 'Teacher not found'}), 404
        return jsonify({'success': True, 'data': {'id': doc.id, **doc.to_dict()}})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch teacher'}), 500


def create_teacher():
    try:
        db = get_firestore()
        now = _now()
        teacher_data = {**(request.get_json() or {}), 'createdAt': now, 'updatedAt': now}
        doc_ref = db.collection('teachers').add(teacher_data)[1]
        return jsonify({'success': True, 'data': {'id': doc_ref.id, **teacher_data}}), 201
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to create teacher'}), 500


def update_teacher(teacher_id):
    try:
        db = get_firestore()
        update_data = {**(request.get_json() or {}), 'updatedAt': _now()}
        db.collection('teachers').document(teacher_id).update(update_data)
        return jsonify({'success': True, 'message': 'Teacher updated successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to update teacher'}), 500


def delete_teacher(teacher_id):
    try:
        db = get_firestore()
        db.collection('teachers').document(teacher_id).delete()
        return jsonify({'success': True, 'message': 'Teacher deleted successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to delete teacher'}), 500
