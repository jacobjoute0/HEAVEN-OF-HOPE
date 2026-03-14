"""
Student document schema (Firestore collection: 'students')

Fields:
  id            - Firestore document ID
  name          - Full name
  email         - Email address
  rollNumber    - School roll number
  class         - Class/Grade (e.g., "Class V")
  section       - Section (e.g., "A")
  dateOfBirth   - ISO date string
  guardianName  - Parent/guardian name
  guardianContact - Parent/guardian phone
  address       - Home address
  status        - Enrollment status: 'active' | 'inactive' | 'graduated'
  createdAt     - ISO timestamp
  updatedAt     - ISO timestamp
"""


def validate_student(data):
    required = ['name', 'rollNumber', 'class']
    missing = [field for field in required if not data.get(field)]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")
    return True
