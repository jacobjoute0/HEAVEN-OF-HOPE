"""
Teacher document schema (Firestore collection: 'teachers')

Fields:
  id            - Firestore document ID
  name          - Full name
  email         - Email address
  employeeId    - Employee ID
  subjects      - List of subjects taught
  classes       - List of classes assigned
  qualification - Educational qualification
  joinDate      - ISO date string
  status        - Employment status: 'active' | 'inactive'
  createdAt     - ISO timestamp
  updatedAt     - ISO timestamp
"""


def validate_teacher(data):
    required = ['name', 'email', 'employeeId']
    missing = [field for field in required if not data.get(field)]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")
    return True
