"""
Parent document schema (Firestore collection: 'parents')

Fields:
  id            - Firestore document ID
  name          - Full name of the parent/guardian
  email         - Email address
  phone         - Phone number
  occupation    - Occupation or profession
  address       - Home address
  childrenIds   - List of student document IDs linked to this parent
  childrenNames - List of child names for quick reference
  relationship  - Relationship to students: 'father' | 'mother' | 'guardian'
  status        - Account status: 'active' | 'inactive'
  createdAt     - ISO timestamp
  updatedAt     - ISO timestamp
"""

import re

_EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


def validate_parent(data):
    required = ['name', 'phone']
    missing = [field for field in required if not data.get(field)]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    email = data.get('email')
    if email and not _EMAIL_RE.match(email):
        raise ValueError('Invalid email address format')

    return True


def sanitize_parent(data):
    return {
        'name': (data.get('name') or '').strip(),
        'email': (data.get('email') or '').strip().lower() or None,
        'phone': (data.get('phone') or '').strip() or None,
        'occupation': (data.get('occupation') or '').strip() or None,
        'address': (data.get('address') or '').strip() or None,
        'childrenIds': data.get('childrenIds') if isinstance(data.get('childrenIds'), list) else [],
        'childrenNames': data.get('childrenNames') if isinstance(data.get('childrenNames'), list) else [],
        'relationship': data.get('relationship') or 'guardian',
        'status': data.get('status') or 'active',
    }
