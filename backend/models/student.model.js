/**
 * Student document schema (Firestore collection: 'students')
 *
 * @typedef {Object} Student
 * @property {string} id - Firestore document ID
 * @property {string} name - Full name
 * @property {string} email - Email address
 * @property {string} rollNumber - School roll number
 * @property {string} class - Class/Grade (e.g., "Class V")
 * @property {string} section - Section (e.g., "A")
 * @property {string} dateOfBirth - ISO date string
 * @property {string} guardianName - Parent/guardian name
 * @property {string} guardianContact - Parent/guardian phone
 * @property {string} address - Home address
 * @property {'active'|'inactive'|'graduated'} status - Enrollment status
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

export function validateStudent(data) {
  const required = ['name', 'rollNumber', 'class'];
  const missing = required.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  return true;
}
