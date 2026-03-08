import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Haven of Hope Academy</h3>
            <p className="text-green-300 text-sm italic mb-2">"Learning Today, Leading Tomorrow"</p>
            <p className="text-green-400 text-sm">Psalms 127:3-4</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-green-200">Quick Links</h4>
            <ul className="space-y-2 text-green-300 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-green-200">Contact Us</h4>
            <p className="text-green-300 text-sm">Hmarkhawlien, Cachar</p>
            <p className="text-green-300 text-sm">Assam, 788106</p>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-6 text-center text-green-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Haven of Hope Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
