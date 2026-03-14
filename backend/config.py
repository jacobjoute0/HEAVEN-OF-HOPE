import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.environ.get('PORT', 5000))
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

FIREBASE_DATABASE_URL = os.environ.get('FIREBASE_DATABASE_URL', '')
FIREBASE_STORAGE_BUCKET = os.environ.get('FIREBASE_STORAGE_BUCKET', '')

SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_SECURE = os.environ.get('SMTP_SECURE', 'false').lower() == 'true'
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASS = os.environ.get('SMTP_PASS', '')

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')

QR_SECRET = os.environ.get('QR_SECRET', 'haven-of-hope-qr-secret-key')

LOCALE = os.environ.get('LOCALE', 'en-IN')
