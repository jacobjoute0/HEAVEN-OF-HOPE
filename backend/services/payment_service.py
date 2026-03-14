import hashlib
import hmac
import random
import string
import time
from datetime import datetime, timezone

from google.cloud.firestore_v1 import Query
import config


def initiate_razorpay_order(amount, currency='INR', receipt=None):
    """Create a Razorpay order. Falls back to a stub when credentials are absent."""
    if not config.RAZORPAY_KEY_ID or not config.RAZORPAY_KEY_SECRET:
        print('[PaymentService] Razorpay credentials not configured – using stub')
        ts = int(time.time() * 1000)
        return {
            'id': f'order_stub_{ts}',
            'amount': amount * 100,
            'currency': currency,
            'receipt': receipt or f'rcpt_{ts}',
            'status': 'created',
            'created_at': int(time.time()),
        }

    try:
        import razorpay
        client = razorpay.Client(auth=(config.RAZORPAY_KEY_ID, config.RAZORPAY_KEY_SECRET))
        order = client.order.create({
            'amount': amount * 100,
            'currency': currency,
            'receipt': receipt or f'rcpt_{int(time.time() * 1000)}',
        })
        return order
    except Exception as exc:
        raise RuntimeError(f'Failed to create Razorpay order: {exc}') from exc


def verify_razorpay_payment(order_id, payment_id, signature):
    """Verify Razorpay payment signature using HMAC-SHA256."""
    key_secret = config.RAZORPAY_KEY_SECRET
    if not key_secret:
        print('[PaymentService] RAZORPAY_KEY_SECRET not set – skipping verification in dev mode')
        return True

    # Format check: SHA-256 HMAC produces 64 hex characters
    if not (len(signature) == 64 and all(c in '0123456789abcdefABCDEF' for c in signature)):
        return False

    body = f'{order_id}|{payment_id}'
    expected = hmac.new(
        key_secret.encode('utf-8'),
        body.encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()

    # Constant-time comparison to prevent timing attacks
    return hmac.compare_digest(expected, signature.lower())


def record_payment(db, payment_data):
    """Record a payment document in Firestore."""
    now = datetime.now(timezone.utc).isoformat()
    record = {**payment_data, 'createdAt': now, 'updatedAt': now}
    doc_ref = db.collection('payments').add(record)[1]
    return {'id': doc_ref.id, **record}


def get_payment_history(db, student_id):
    """Retrieve payment history for a student, ordered by creation date."""
    snapshot = (
        db.collection('payments')
        .where('studentId', '==', student_id)
        .order_by('createdAt', direction=Query.DESCENDING)
        .get()
    )
    return [{'id': doc.id, **doc.to_dict()} for doc in snapshot]


def generate_receipt_number():
    """Generate a unique receipt number."""
    now = datetime.now(timezone.utc)
    date_str = now.strftime('%Y%m%d')
    rand = ''.join(random.choices(string.digits, k=4))
    return f'RCP-{date_str}-{rand}'
