import { getFirestore } from '../config/firebase.js';

const NOTIFICATIONS_COLLECTION = 'notifications';

export async function sendNotification(userId, message, type = 'info', title = null) {
  try {
    const db = getFirestore();
    const notification = {
      userId,
      title: title || getDefaultTitle(type),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection(NOTIFICATIONS_COLLECTION).add(notification);
    return { id: docRef.id, ...notification };
  } catch (error) {
    console.error(`[NotificationService] Failed to send notification to ${userId}:`, error.message);
    throw error;
  }
}

export async function sendBulkNotification(userIds, message, type = 'info', title = null) {
  const db = getFirestore();
  const batch = db.batch();
  const now = new Date().toISOString();

  for (const userId of userIds) {
    const ref = db.collection(NOTIFICATIONS_COLLECTION).doc();
    batch.set(ref, {
      userId,
      title: title || getDefaultTitle(type),
      message,
      type,
      read: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  await batch.commit();
  return { sent: userIds.length };
}

export async function getNotifications(userId, { limit = 20, unreadOnly = false } = {}) {
  try {
    const db = getFirestore();
    let query = db
      .collection(NOTIFICATIONS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (unreadOnly) {
      query = db
        .collection(NOTIFICATIONS_COLLECTION)
        .where('userId', '==', userId)
        .where('read', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`[NotificationService] Failed to get notifications for ${userId}:`, error.message);
    throw error;
  }
}

export async function markAsRead(notificationId) {
  try {
    const db = getFirestore();
    await db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId).update({
      read: true,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error(`[NotificationService] Failed to mark notification ${notificationId} as read:`, error.message);
    throw error;
  }
}

export async function markAllAsRead(userId) {
  try {
    const db = getFirestore();
    const snapshot = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    if (snapshot.empty) return { updated: 0 };

    const batch = db.batch();
    const now = new Date().toISOString();
    snapshot.docs.forEach((doc) => batch.update(doc.ref, { read: true, updatedAt: now }));
    await batch.commit();

    return { updated: snapshot.size };
  } catch (error) {
    console.error(`[NotificationService] Failed to mark all notifications as read for ${userId}:`, error.message);
    throw error;
  }
}

export async function deleteNotification(notificationId) {
  const db = getFirestore();
  await db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId).delete();
  return { success: true };
}

export async function getUnreadCount(userId) {
  const db = getFirestore();
  const snapshot = await db
    .collection(NOTIFICATIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('read', '==', false)
    .get();
  return snapshot.size;
}

function getDefaultTitle(type) {
  const titles = {
    info:    'Information',
    success: 'Success',
    warning: 'Warning',
    error:   'Alert',
    fee:     'Fee Notice',
    academic: 'Academic Update',
    attendance: 'Attendance Alert',
  };
  return titles[type] || 'Notification';
}
