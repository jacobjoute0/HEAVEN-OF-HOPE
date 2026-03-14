import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError(null);
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      notify.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (!result.success) {
      return;
    }

    const redirectMap = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      parent: '/parent/dashboard',
      admin: '/admin/dashboard',
    };

    if (!result.role || !redirectMap[result.role]) {
      const message = 'Your account does not have a portal role yet. Please contact the school administrator.';
      setError(message);
      notify.error(message);
      return;
    }

    notify.success('Welcome back!');
    navigate(redirectMap[result.role]);
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            H
          </div>
          <h1 className="text-2xl font-bold text-green-800">Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Haven of Hope Academy Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-gray-500 text-sm mt-6 space-y-3">
          <p>
            Use your school email and password. If you already know your portal, you can also use the dedicated login pages below.
          </p>
          <p>
            <Link to="/student/login" className="text-green-600 hover:underline font-medium">Student</Link>
            {' · '}
            <Link to="/teacher/login" className="text-green-600 hover:underline font-medium">Teacher</Link>
            {' · '}
            <Link to="/parent/login" className="text-green-600 hover:underline font-medium">Parent</Link>
            {' · '}
            <Link to="/admin/login" className="text-green-600 hover:underline font-medium">Admin</Link>
          </p>
          <p>
            Need help?{' '}
            <Link to="/contact" className="text-green-600 hover:underline">Contact us</Link>
          </p>
          <p className="text-center text-sm text-gray-400">
          <Link to="/" className="text-green-600 hover:underline">← Back to Home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
