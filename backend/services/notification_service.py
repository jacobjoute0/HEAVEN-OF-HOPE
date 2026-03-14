from datetime import datetime, timezone

from google.cloud.firestore_v1 import Query

from config.firebase_config import get_firestore

NOTIFICATIONS_COLLECTION = 'notifications'

_DEFAULT_TITLES = {
    'info': 'Information',
    'success': 'Success',
    'warning': 'Warning',
    'error': 'Alert',
    'fee': 'Fee Notice',
    'academic': 'Academic Update',
    'attendance': 'Attendance Alert',
}


def _default_title(notification_type):
    return _DEFAULT_TITLES.get(notification_type, 'Notification')


def _now():
    return datetime.now(timezone.utc).isoformat()


def send_notification(user_id, message, notification_type='info', title=None):
    try:
        db = get_firestore()
        now = _now()
        notification = {
            'userId': user_id,
            'title': title or _default_title(notification_type),
            'message': message,
            'type': notification_type,
            'read': False,
            'createdAt': now,
            'updatedAt': now,
        }
        doc_ref = db.collection(NOTIFICATIONS_COLLECTION).add(notification)[1]
        return {'id': doc_ref.id, **notification}
    except Exception as exc:
        print(f'[NotificationService] Failed to send notification to {user_id}: {exc}')
        raise


def send_bulk_notification(user_ids, message, notification_type='info', title=None):
    db = get_firestore()
    batch = db.batch()
    now = _now()

    for user_id in user_ids:
        ref = db.collection(NOTIFICATIONS_COLLECTION).document()
        batch.set(ref, {
            'userId': user_id,
            'title': title or _default_title(notification_type),
            'message': message,
            'type': notification_type,
            'read': False,
            'createdAt': now,
            'updatedAt': now,
        })

    batch.commit()
    return {'sent': len(user_ids)}


def get_notifications(user_id, limit=20, unread_only=False):
    try:
        db = get_firestore()
        col = db.collection(NOTIFICATIONS_COLLECTION)
        if unread_only:
            query = (
                col.where('userId', '==', user_id)
                .where('read', '==', False)
                .order_by('createdAt', direction=Query.DESCENDING)
                .limit(limit)
            )
        else:
            query = (
                col.where('userId', '==', user_id)
                .order_by('createdAt', direction=Query.DESCENDING)
                .limit(limit)
            )
        snapshot = query.get()
        return [{'id': doc.id, **doc.to_dict()} for doc in snapshot]
    except Exception as exc:
        print(f'[NotificationService] Failed to get notifications for {user_id}: {exc}')
        raise


def mark_as_read(notification_id):
    try:
        db = get_firestore()
        db.collection(NOTIFICATIONS_COLLECTION).document(notification_id).update({
            'read': True,
            'updatedAt': _now(),
        })
        return {'success': True}
    except Exception as exc:
        print(f'[NotificationService] Failed to mark notification {notification_id} as read: {exc}')
        raise


def mark_all_as_read(user_id):
    try:
        db = get_firestore()
        snapshot = (
            db.collection(NOTIFICATIONS_COLLECTION)
            .where('userId', '==', user_id)
            .where('read', '==', False)
            .get()
        )
        if not snapshot:
            return {'updated': 0}

        batch = db.batch()
        now = _now()
        for doc in snapshot:
            batch.update(doc.reference, {'read': True, 'updatedAt': now})
        batch.commit()
        return {'updated': len(snapshot)}
    except Exception as exc:
        print(f'[NotificationService] Failed to mark all notifications as read for {user_id}: {exc}')
        raise


def delete_notification(notification_id):
    db = get_firestore()
    db.collection(NOTIFICATIONS_COLLECTION).document(notification_id).delete()
    return {'success': True}


def get_unread_count(user_id):
    db = get_firestore()
    snapshot = (
        db.collection(NOTIFICATIONS_COLLECTION)
        .where('userId', '==', user_id)
        .where('read', '==', False)
        .get()
    )
    return len(snapshot)
