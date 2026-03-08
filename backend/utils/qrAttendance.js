import crypto from 'crypto';
import { getFirestore } from '../config/firebase.js';

const QR_SECRET = process.env.QR_SECRET || 'haven-of-hope-qr-secret-key';
const QR_EXPIRY_MINUTES = 15;

// Generate a signed QR token for an attendance session
export function generateQRCode(sessionId, classId, date) {
  const payload = {
    sessionId,
    classId,
    date,
    issuedAt: Date.now(),
    expiresAt: Date.now() + QR_EXPIRY_MINUTES * 60 * 1000,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr).toString('base64url');

  const signature = crypto
    .createHmac('sha256', QR_SECRET)
    .update(payloadB64)
    .digest('hex');

  const token = `${payloadB64}.${signature}`;

  return {
    token,
    qrData: `havenofhope://attendance?token=${token}`,
    sessionId,
    classId,
    date,
    expiresAt: new Date(payload.expiresAt).toISOString(),
    expiresInMinutes: QR_EXPIRY_MINUTES,
  };
}

// Verify the QR token and return decoded payload
export function verifyQRCode(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Invalid token format' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token' };
  }

  const [payloadB64, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', QR_SECRET)
    .update(payloadB64)
    .digest('hex');

  if (expectedSignature !== signature) {
    return { valid: false, error: 'Invalid token signature' };
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
  } catch {
    return { valid: false, error: 'Cannot decode token payload' };
  }

  if (Date.now() > payload.expiresAt) {
    const expiredAt = new Date(payload.expiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return { valid: false, error: `QR code expired at ${expiredAt}. Please request a new code from your teacher.`, expiredAt: new Date(payload.expiresAt).toISOString() };
  }

  return { valid: true, payload };
}

// Record attendance via QR scan
export async function recordAttendance(studentId, sessionData) {
  const { sessionId, classId, date } = sessionData;
  const db = getFirestore();

  const attendanceId = `${date}_${classId}_${studentId}`;
  const docRef = db.collection('attendance').doc(attendanceId);
  const existing = await docRef.get();

  if (existing.exists) {
    return { success: false, message: 'Attendance already recorded for this session', alreadyRecorded: true };
  }

  const record = {
    studentId,
    classId,
    sessionId,
    date,
    status: 'present',
    method: 'qr_scan',
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  await docRef.set(record);
  return { success: true, data: { id: attendanceId, ...record } };
}

// Create an attendance session (called by teacher when generating QR)
export async function createAttendanceSession(teacherId, classId, date, subject) {
  const db = getFirestore();
  const sessionId = `${classId}_${date}_${Date.now()}`;

  const session = {
    sessionId,
    teacherId,
    classId,
    date,
    subject: subject || 'General',
    active: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + QR_EXPIRY_MINUTES * 60 * 1000).toISOString(),
  };

  await db.collection('attendanceSessions').doc(sessionId).set(session);
  const qr = generateQRCode(sessionId, classId, date);

  return { session, qr };
}

// Get attendance records for a class on a date
export async function getClassAttendance(classId, date) {
  const db = getFirestore();
  const snapshot = await db
    .collection('attendance')
    .where('classId', '==', classId)
    .where('date', '==', date)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get attendance records for a student
export async function getStudentAttendance(studentId, startDate = null, endDate = null) {
  const db = getFirestore();
  let query = db.collection('attendance').where('studentId', '==', studentId);
  if (startDate) query = query.where('date', '>=', startDate);
  if (endDate) query = query.where('date', '<=', endDate);
  const snapshot = await query.orderBy('date', 'desc').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
