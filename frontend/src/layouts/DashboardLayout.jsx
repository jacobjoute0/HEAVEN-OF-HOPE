import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/**
 * DashboardLayout
 *
 * Generic authenticated dashboard shell shared by the Student, Teacher,
 * Parent and Admin portals.  Each portal passes its own `links` array and
 * `title` / `portalLabel` so the layout stays role-agnostic.
 *
 * Usage (inside AppRouter):
 *   <Route element={<DashboardLayout links={studentLinks} title="Student Portal" />}>
 *     <Route path="/student/dashboard" element={<StudentDashboard />} />
 *   </Route>
 */
export default function DashboardLayout({
  links = [],
  title = 'Portal',
  headerTitle,
}) {
  const label = headerTitle || title;

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar links={links} title={title} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <h1 className="text-green-800 font-bold text-lg">{label}</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
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
