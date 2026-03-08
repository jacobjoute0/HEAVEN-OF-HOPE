import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * PublicLayout
 *
 * Wraps all public-facing pages (Home, About, Admissions, etc.) with the
 * shared Navbar and Footer.  Renders child routes via <Outlet />.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
