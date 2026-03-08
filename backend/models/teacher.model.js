/**
 * Teacher document schema (Firestore collection: 'teachers')
 *
 * @typedef {Object} Teacher
 * @property {string} id - Firestore document ID
 * @property {string} name - Full name
 * @property {string} email - Email address
 * @property {string} employeeId - Employee ID
 * @property {string[]} subjects - Subjects taught
 * @property {string[]} classes - Classes assigned
 * @property {string} qualification - Educational qualification
 * @property {string} joinDate - ISO date string
 * @property {'active'|'inactive'} status - Employment status
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

export function validateTeacher(data) {
  const required = ['name', 'email', 'employeeId'];
  const missing = required.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  return true;
}
