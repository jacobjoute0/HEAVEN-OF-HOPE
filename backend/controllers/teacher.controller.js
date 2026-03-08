import { getFirestore } from '../config/firebase.js';

export async function getAllTeachers(req, res) {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('teachers').get();
    const teachers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teachers' });
  }
}

export async function getTeacherById(req, res) {
  try {
    const db = getFirestore();
    const doc = await db.collection('teachers').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teacher' });
  }
}

export async function createTeacher(req, res) {
  try {
    const db = getFirestore();
    const teacherData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection('teachers').add(teacherData);
    res.status(201).json({ success: true, data: { id: docRef.id, ...teacherData } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create teacher' });
  }
}

export async function updateTeacher(req, res) {
  try {
    const db = getFirestore();
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    await db.collection('teachers').doc(req.params.id).update(updateData);
    res.json({ success: true, message: 'Teacher updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update teacher' });
  }
}

export async function deleteTeacher(req, res) {
  try {
    const db = getFirestore();
    await db.collection('teachers').doc(req.params.id).delete();
    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete teacher' });
  }
}
