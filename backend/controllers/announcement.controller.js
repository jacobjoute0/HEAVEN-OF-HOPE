import { getFirestore } from '../config/firebase.js';

export async function getAnnouncements(req, res) {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').limit(20).get();
    const announcements = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
}

export async function createAnnouncement(req, res) {
  try {
    const db = getFirestore();
    const data = {
      ...req.body,
      authorId: req.user.uid,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('announcements').add(data);
    res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const db = getFirestore();
    await db.collection('announcements').doc(req.params.id).delete();
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
}
