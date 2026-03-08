import { getFirestore } from '../config/firebase.js';

export async function getAllStudents(req, res) {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('students').get();
    const students = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
}

export async function getStudentById(req, res) {
  try {
    const db = getFirestore();
    const doc = await db.collection('students').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student' });
  }
}

export async function createStudent(req, res) {
  try {
    const db = getFirestore();
    const studentData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection('students').add(studentData);
    res.status(201).json({ success: true, data: { id: docRef.id, ...studentData } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create student' });
  }
}

export async function updateStudent(req, res) {
  try {
    const db = getFirestore();
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    await db.collection('students').doc(req.params.id).update(updateData);
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update student' });
  }
}

export async function deleteStudent(req, res) {
  try {
    const db = getFirestore();
    await db.collection('students').doc(req.params.id).delete();
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
}
