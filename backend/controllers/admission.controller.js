import { getFirestore } from '../config/firebase.js';

export async function getAdmissions(req, res) {
  try {
    const db = getFirestore();
    const { status } = req.query;
    let query = db.collection('admissions').orderBy('createdAt', 'desc');
    if (status) {
      query = db.collection('admissions').where('status', '==', status).orderBy('createdAt', 'desc');
    }
    const snapshot = await query.get();
    const admissions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: admissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admissions' });
  }
}

export async function getAdmissionById(req, res) {
  try {
    const db = getFirestore();
    const doc = await db.collection('admissions').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admission' });
  }
}

export async function createAdmission(req, res) {
  try {
    const db = getFirestore();
    const { studentName, dateOfBirth, appliedClass, guardianName, guardianContact, guardianEmail, address } = req.body;

    if (!studentName || !appliedClass || !guardianName || !guardianContact) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentName, appliedClass, guardianName, guardianContact',
      });
    }

    const admissionData = {
      studentName,
      dateOfBirth: dateOfBirth || null,
      appliedClass,
      guardianName,
      guardianContact,
      guardianEmail: guardianEmail || null,
      address: address || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('admissions').add(admissionData);
    res.status(201).json({ success: true, data: { id: docRef.id, ...admissionData }, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit admission application' });
  }
}

export async function updateAdmissionStatus(req, res) {
  try {
    const db = getFirestore();
    const { status, remarks } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'waitlisted'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updateData = {
      status,
      remarks: remarks || null,
      updatedAt: new Date().toISOString(),
      reviewedBy: req.user?.uid || null,
      reviewedAt: new Date().toISOString(),
    };

    await db.collection('admissions').doc(req.params.id).update(updateData);
    res.json({ success: true, message: `Admission status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update admission status' });
  }
}

export async function deleteAdmission(req, res) {
  try {
    const db = getFirestore();
    await db.collection('admissions').doc(req.params.id).delete();
    res.json({ success: true, message: 'Admission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete admission' });
  }
}
