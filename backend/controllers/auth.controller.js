import { getAuth, getFirestore } from '../config/firebase.js';

export async function login(req, res) {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, message: 'ID token required' });
  }

  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.json({
      success: true,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        role: userData.role || 'student',
        name: userData.name || decoded.name || '',
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
}

export async function logout(req, res) {
  try {
    await getAuth().revokeRefreshTokens(req.user.uid);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
}

export async function getProfile(req, res) {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: { uid: req.user.uid, ...userDoc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
}
