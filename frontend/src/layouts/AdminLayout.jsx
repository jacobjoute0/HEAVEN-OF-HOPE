import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const adminLinks = [
  { name: 'Dashboard',   path: '/admin/dashboard',   icon: '🏠' },
  { name: 'Students',    path: '/admin/students',    icon: '🎓' },
  { name: 'Teachers',    path: '/admin/teachers',    icon: '👨‍🏫' },
  { name: 'Parents',     path: '/admin/parents',     icon: '👪' },
  { name: 'Admissions',  path: '/admin/admissions',  icon: '📋' },
  { name: 'Events',      path: '/admin/events',      icon: '🗓️' },
  { name: 'News',        path: '/admin/news',        icon: '📰' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar links={adminLinks} title="Admin Panel" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <h1 className="text-green-800 font-bold text-lg">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
