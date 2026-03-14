from datetime import datetime, timezone
from flask import request, jsonify, g
from google.cloud.firestore_v1 import Query
from config.firebase_config import get_firestore


def _now():
    return datetime.now(timezone.utc).isoformat()


def get_admissions():
    try:
        db = get_firestore()
        status = request.args.get('status')
        col = db.collection('admissions')
        if status:
            query = col.where('status', '==', status).order_by('createdAt', direction=Query.DESCENDING)
        else:
            query = col.order_by('createdAt', direction=Query.DESCENDING)
        snapshot = query.get()
        admissions = [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
        return jsonify({'success': True, 'data': admissions})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch admissions'}), 500


def get_admission_by_id(admission_id):
    try:
        db = get_firestore()
        doc = db.collection('admissions').document(admission_id).get()
        if not doc.exists:
            return jsonify({'success': False, 'message': 'Admission not found'}), 404
        return jsonify({'success': True, 'data': {'id': doc.id, **doc.to_dict()}})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to fetch admission'}), 500


def create_admission():
    try:
        db = get_firestore()
        body = request.get_json() or {}
        student_name = body.get('studentName')
        applied_class = body.get('appliedClass')
        guardian_name = body.get('guardianName')
        guardian_contact = body.get('guardianContact')

        if not all([student_name, applied_class, guardian_name, guardian_contact]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields: studentName, appliedClass, guardianName, guardianContact',
            }), 400

        now = _now()
        admission_data = {
            'studentName': student_name,
            'dateOfBirth': body.get('dateOfBirth') or None,
            'appliedClass': applied_class,
            'guardianName': guardian_name,
            'guardianContact': guardian_contact,
            'guardianEmail': body.get('guardianEmail') or None,
            'address': body.get('address') or None,
            'status': 'pending',
            'createdAt': now,
            'updatedAt': now,
        }
        doc_ref = db.collection('admissions').add(admission_data)[1]
        return jsonify({
            'success': True,
            'data': {'id': doc_ref.id, **admission_data},
            'message': 'Application submitted successfully',
        }), 201
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to submit admission application'}), 500


def update_admission_status(admission_id):
    try:
        db = get_firestore()
        body = request.get_json() or {}
        status = body.get('status')
        valid_statuses = ['pending', 'approved', 'rejected', 'waitlisted']

        if status not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f"Status must be one of: {', '.join(valid_statuses)}",
            }), 400

        now = _now()
        user = getattr(g, 'user', None)
        update_data = {
            'status': status,
            'remarks': body.get('remarks') or None,
            'updatedAt': now,
            'reviewedBy': user['uid'] if user else None,
            'reviewedAt': now,
        }
        db.collection('admissions').document(admission_id).update(update_data)
        return jsonify({'success': True, 'message': f'Admission status updated to {status}'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to update admission status'}), 500


def delete_admission(admission_id):
    try:
        db = get_firestore()
        db.collection('admissions').document(admission_id).delete()
        return jsonify({'success': True, 'message': 'Admission deleted successfully'})
    except Exception:
        return jsonify({'success': False, 'message': 'Failed to delete admission'}), 500
