# Haven of Hope Academy — School ERP

> **"Learning Today, Leading Tomorrow"**  
> *Psalms 127:3-4*

A production-ready School ERP (Enterprise Resource Planning) web application for **Haven of Hope Academy**, located at Hmarkhawlien, Cachar, Assam — 788106.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), TailwindCSS, React Router, Framer Motion, Axios |
| Backend | Node.js, Express.js |
| Database | Firebase Firestore |
| Authentication | Firebase Auth + Admin SDK |

---

## Project Structure

```
HEAVEN-OF-HOPE/
├── frontend/                     # React (Vite) + TailwindCSS app
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js        # Firebase client SDK initialisation
│   │   ├── assets/                # Static assets (images, icons)
│   │   ├── components/            # Reusable UI components (Navbar, Footer, Sidebar, Card)
│   │   ├── context/               # React context providers (AuthContext, NotificationContext)
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx   # Wraps public pages with Navbar + Footer
│   │   │   ├── DashboardLayout.jsx# Generic authenticated portal shell
│   │   │   ├── MainLayout.jsx     # (legacy alias for PublicLayout)
│   │   │   ├── StudentLayout.jsx
│   │   │   ├── TeacherLayout.jsx
│   │   │   ├── ParentLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/                 # Page components per role
│   │   │   ├── (public)           # Home, About, Academics, Admissions, …
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   └── parent/
│   │   ├── routes/
│   │   │   ├── AppRouter.jsx      # React Router v7 route definitions
│   │   │   └── ProtectedRoute.jsx # Role-based route guard
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance with Firebase ID-token interceptor
│   │   │   ├── authService.js     # Firebase Auth helpers (login, logout, etc.)
│   │   │   └── paymentService.js
│   │   └── utils/                 # Shared formatters, validators
│   └── vite.config.js
├── backend/                       # Node.js / Express.js API
│   ├── config/
│   │   └── firebase.js            # Firebase Admin SDK initialisation
│   ├── controllers/               # Route handlers
│   ├── middleware/
│   │   ├── auth.middleware.js      # verifyToken + requireRole (primary)
│   │   └── authMiddleware.js       # Re-export alias (camelCase convention)
│   ├── models/                    # Data-shape helpers / Firestore model utils
│   ├── routes/                    # Express routers
│   ├── services/                  # Business-logic services (email, payment, …)
│   └── utils/
├── database-schema/
│   ├── firestore.rules            # Firestore security rules (deploy with Firebase CLI)
│   └── firestore-schema.md        # Annotated collection & field reference
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Firebase project (Firestore + Auth enabled)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # set VITE_API_URL
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env          # fill in Firebase credentials
# Add serviceAccountKey.json from Firebase Console → Project Settings → Service accounts
npm run dev
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://localhost:5000/api

# Firebase client SDK — from Firebase Console → Project Settings → General
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Backend (`backend/.env`)
```
PORT=5000
FRONTEND_URL=http://localhost:5173
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

---

## Available Scripts

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |

---

## Database

See [`database-schema/firestore-schema.md`](database-schema/firestore-schema.md) for the full Firestore collections, field definitions, and security rules.

Deploy the Firestore security rules with the Firebase CLI:

```bash
# Add to firebase.json:  "firestore": { "rules": "database-schema/firestore.rules" }
firebase deploy --only firestore:rules
```

---

## License

© Haven of Hope Academy. All rights reserved.
