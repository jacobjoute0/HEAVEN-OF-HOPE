from datetime import datetime, timezone
from flask import request, jsonify
from config.firebase_config import get_firestore


def _now():
    return datetime.now(timezone.utc).isoformat()


def get_all_students():
    try:
        db = get_firestore()
        snapshot = db.collection('students').get()
        students = [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
        return jsonify({'success': True, 'data': students})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch students'}), 500


def get_student_by_id(student_id):
    try:
        db = get_firestore()
        doc = db.collection('students').document(student_id).get()
        if not doc.exists:
            return jsonify({'success': False, 'message': 'Student not found'}), 404
        return jsonify({'success': True, 'data': {'id': doc.id, **doc.to_dict()}})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch student'}), 500


def create_student():
    try:
        db = get_firestore()
        now = _now()
        student_data = {**(request.get_json() or {}), 'createdAt': now, 'updatedAt': now}
        doc_ref = db.collection('students').add(student_data)[1]
        return jsonify({'success': True, 'data': {'id': doc_ref.id, **student_data}}), 201
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to create student'}), 500


def update_student(student_id):
    try:
        db = get_firestore()
        update_data = {**(request.get_json() or {}), 'updatedAt': _now()}
        db.collection('students').document(student_id).update(update_data)
        return jsonify({'success': True, 'message': 'Student updated successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to update student'}), 500


def delete_student(student_id):
    try:
        db = get_firestore()
        db.collection('students').document(student_id).delete()
        return jsonify({'success': True, 'message': 'Student deleted successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to delete student'}), 500
