// Format date to readable string
export function formatDate(date, options = {}) {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d)) return '—';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(d);
  } catch {
    return '—';
  }
}

// Format date to dd/mm/yyyy
export function formatDateShort(date) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d)) return '—';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return '—';
  }
}

// Format currency (INR)
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return `₹${amount}`;
  }
}

// Format phone number
export function formatPhoneNumber(phone) {
  if (!phone) return '—';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

// Format grade from marks (percentage)
export function formatGrade(marks, max = 100) {
  const pct = (marks / max) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
}

// Get grade color class
export function getGradeColor(grade) {
  const map = {
    'A+': 'text-green-700 bg-green-100',
    'A':  'text-green-600 bg-green-50',
    'B+': 'text-blue-700 bg-blue-100',
    'B':  'text-blue-600 bg-blue-50',
    'C':  'text-yellow-700 bg-yellow-100',
    'D':  'text-orange-700 bg-orange-100',
    'F':  'text-red-700 bg-red-100',
  };
  return map[grade] || 'text-gray-700 bg-gray-100';
}

// Get initials from name
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

// Truncate text with ellipsis
export function truncateText(text, maxLen = 100) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

// Format percentage
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Relative time (e.g., "2 days ago")
export function formatRelativeTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  try {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = d - Date.now();
    const absDiff = Math.abs(diff);
    if (absDiff < 60000) return rtf.format(Math.round(diff / 1000), 'second');
    if (absDiff < 3600000) return rtf.format(Math.round(diff / 60000), 'minute');
    if (absDiff < 86400000) return rtf.format(Math.round(diff / 3600000), 'hour');
    if (absDiff < 2592000000) return rtf.format(Math.round(diff / 86400000), 'day');
    return formatDate(date);
  } catch {
    return formatDate(date);
  }
}

// Capitalize first letter
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Title case
export function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
