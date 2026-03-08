/**
 * Parent document schema (Firestore collection: 'parents')
 *
 * @typedef {Object} Parent
 * @property {string} id - Firestore document ID
 * @property {string} name - Full name of the parent/guardian
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {string} occupation - Occupation or profession
 * @property {string} address - Home address
 * @property {string[]} childrenIds - Array of student document IDs linked to this parent
 * @property {string[]} childrenNames - Array of child names for quick reference
 * @property {'father'|'mother'|'guardian'} relationship - Relationship to students
 * @property {'active'|'inactive'} status - Account status
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

export function validateParent(data) {
  const required = ['name', 'phone'];
  const missing = required.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email address format');
    }
  }

  return true;
}

export function sanitizeParent(data) {
  return {
    name: data.name?.trim(),
    email: data.email?.trim().toLowerCase() || null,
    phone: data.phone?.trim() || null,
    occupation: data.occupation?.trim() || null,
    address: data.address?.trim() || null,
    childrenIds: Array.isArray(data.childrenIds) ? data.childrenIds : [],
    childrenNames: Array.isArray(data.childrenNames) ? data.childrenNames : [],
    relationship: data.relationship || 'guardian',
    status: data.status || 'active',
  };
}
