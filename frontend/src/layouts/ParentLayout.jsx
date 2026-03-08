import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const parentLinks = [
  { name: 'Dashboard',      path: '/parent/dashboard',  icon: '🏠' },
  { name: 'Attendance',     path: '/parent/attendance', icon: '📅' },
  { name: 'Results',        path: '/parent/results',    icon: '📊' },
  { name: 'Fee Payment',    path: '/parent/fees',       icon: '💳' },
];

export default function ParentLayout() {
  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar links={parentLinks} title="Parent Portal" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <h1 className="text-green-800 font-bold text-lg">Parent Portal</h1>
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
