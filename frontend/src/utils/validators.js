// Email validation
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, error: 'Email is required' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return { valid: false, error: 'Please enter a valid email address' };
  return { valid: true, error: '' };
}

// Phone validation (10-digit Indian numbers)
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return { valid: false, error: 'Phone number is required' };
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!/^(\+91)?[6-9]\d{9}$/.test(cleaned)) {
    return { valid: false, error: 'Please enter a valid 10-digit phone number' };
  }
  return { valid: true, error: '' };
}

// Password validation
export function validatePassword(password) {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain at least one number' };
  return { valid: true, error: '' };
}

// Required field validation
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || String(value).trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true, error: '' };
}

// Admission form validation
export function validateAdmissionForm(data) {
  const errors = {};

  const nameCheck = validateRequired(data.studentName, 'Student name');
  if (!nameCheck.valid) errors.studentName = nameCheck.error;

  const dobCheck = validateRequired(data.dateOfBirth, 'Date of birth');
  if (!dobCheck.valid) errors.dateOfBirth = dobCheck.error;

  const classCheck = validateRequired(data.appliedClass, 'Class');
  if (!classCheck.valid) errors.appliedClass = classCheck.error;

  const guardianCheck = validateRequired(data.guardianName, 'Guardian name');
  if (!guardianCheck.valid) errors.guardianName = guardianCheck.error;

  const phoneCheck = validatePhone(data.guardianContact);
  if (!phoneCheck.valid) errors.guardianContact = phoneCheck.error;

  const emailCheck = validateEmail(data.guardianEmail);
  if (!emailCheck.valid) errors.guardianEmail = emailCheck.error;

  const addressCheck = validateRequired(data.address, 'Address');
  if (!addressCheck.valid) errors.address = addressCheck.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Name validation
export function validateName(name, fieldName = 'Name') {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: `${fieldName} must be at least 2 characters` };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: `${fieldName} must be less than 100 characters` };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return { valid: false, error: `${fieldName} can only contain letters, spaces, hyphens and apostrophes` };
  }
  return { valid: true, error: '' };
}

// Date validation (not in the future for DOB, not in the past for events)
export function validateDate(dateStr, { notFuture = false, notPast = false } = {}) {
  if (!dateStr) return { valid: false, error: 'Date is required' };
  const date = new Date(dateStr);
  if (isNaN(date)) return { valid: false, error: 'Invalid date format' };
  const now = new Date();
  if (notFuture && date > now) return { valid: false, error: 'Date cannot be in the future' };
  if (notPast && date < now) return { valid: false, error: 'Date cannot be in the past' };
  return { valid: true, error: '' };
}

// Marks/score validation
export function validateMarks(marks, max = 100) {
  const num = Number(marks);
  if (isNaN(num)) return { valid: false, error: 'Marks must be a number' };
  if (num < 0) return { valid: false, error: 'Marks cannot be negative' };
  if (num > max) return { valid: false, error: `Marks cannot exceed ${max}` };
  return { valid: true, error: '' };
}
