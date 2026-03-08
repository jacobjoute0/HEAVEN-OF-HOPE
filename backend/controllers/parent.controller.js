import { getFirestore } from '../config/firebase.js';

export async function getAllParents(req, res) {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('parents').get();
    const parents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: parents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch parents' });
  }
}

export async function getParentById(req, res) {
  try {
    const db = getFirestore();
    const doc = await db.collection('parents').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Parent not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch parent' });
  }
}

export async function createParent(req, res) {
  try {
    const db = getFirestore();
    const parentData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection('parents').add(parentData);
    res.status(201).json({ success: true, data: { id: docRef.id, ...parentData } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create parent' });
  }
}

export async function updateParent(req, res) {
  try {
    const db = getFirestore();
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    await db.collection('parents').doc(req.params.id).update(updateData);
    res.json({ success: true, message: 'Parent updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update parent' });
  }
}

export async function deleteParent(req, res) {
  try {
    const db = getFirestore();
    await db.collection('parents').doc(req.params.id).delete();
    res.json({ success: true, message: 'Parent deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete parent' });
  }
}
