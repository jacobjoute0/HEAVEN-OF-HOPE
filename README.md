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
├── frontend/                  # React Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, Footer)
│   │   ├── pages/             # Page components (Home, About, Academics…)
│   │   ├── layouts/           # Layout wrappers (MainLayout)
│   │   └── services/          # Axios API service
│   └── vite.config.js
├── backend/                   # Node.js Express API
│   ├── config/                # Firebase config
│   ├── controllers/           # Route controllers
│   ├── middleware/             # Auth middleware
│   ├── models/                # Data models / validators
│   └── routes/                # Express routers
├── database-schema/
│   └── firestore-schema.md    # Firestore collections & security rules
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

---

## License

© Haven of Hope Academy. All rights reserved.
