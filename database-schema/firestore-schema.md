# Firestore Database Schema — Haven of Hope Academy

## Collections Overview

### `users`
Stores all authenticated user profiles.

| Field | Type | Description |
|-------|------|-------------|
| uid | string | Firebase Auth UID (document ID) |
| name | string | Full name |
| email | string | Email address |
| role | string | `admin` / `teacher` / `student` / `parent` |
| createdAt | timestamp | Account creation time |

---

### `students`
Student enrollment records.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Firestore auto-generated ID |
| name | string | Student full name |
| email | string | Student/guardian email |
| rollNumber | string | School roll number |
| class | string | Class (e.g., "Class V") |
| section | string | Section (e.g., "A") |
| dateOfBirth | string | ISO date |
| guardianName | string | Parent/guardian name |
| guardianContact | string | Phone number |
| address | string | Home address |
| status | string | `active` / `inactive` / `graduated` |
| createdAt | timestamp | Record creation time |
| updatedAt | timestamp | Last update time |

---

### `teachers`
Teacher/staff records.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Firestore auto-generated ID |
| name | string | Teacher full name |
| email | string | Work email |
| employeeId | string | Employee ID |
| subjects | array | List of subjects taught |
| classes | array | Classes assigned |
| qualification | string | Highest qualification |
| joinDate | string | Date of joining |
| status | string | `active` / `inactive` |
| createdAt | timestamp | Record creation time |
| updatedAt | timestamp | Last update time |

---

### `announcements`
School-wide announcements.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Firestore auto-generated ID |
| title | string | Announcement title |
| content | string | Full announcement text |
| authorId | string | UID of creator |
| targetAudience | array | `['all']` / `['students']` / `['teachers']` |
| createdAt | timestamp | Creation time |

---

### `attendance`
Daily attendance records.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Firestore auto-generated ID |
| studentId | string | Reference to students doc |
| class | string | Class name |
| date | string | ISO date string |
| status | string | `present` / `absent` / `late` |
| markedBy | string | Teacher UID |
| createdAt | timestamp | Record creation time |

---

### `grades`
Academic grade records.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Firestore auto-generated ID |
| studentId | string | Reference to students doc |
| subject | string | Subject name |
| examType | string | `unit-test` / `mid-term` / `final` |
| marks | number | Marks obtained |
| maxMarks | number | Maximum marks |
| academicYear | string | e.g., "2024-2025" |
| createdAt | timestamp | Record creation time |

---

## Security Rules (Firestore)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    function isTeacher() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    function isStudent() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }

    match /users/{userId} {
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if isAdmin();
    }
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || isTeacher();
    }
    match /teachers/{teacherId} {
      allow read: if isAdmin() || isTeacher();
      allow write: if isAdmin();
    }
    match /announcements/{announcementId} {
      allow read: if true;
      allow write: if isAdmin() || isTeacher();
    }
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || isTeacher();
    }
    match /grades/{gradeId} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || isTeacher();
    }
  }
}
```
