import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function TeacherLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => { setError(null); setForm((p) => ({ ...p, [e.target.name]: e.target.value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { notify.error('Please fill in all fields'); return; }
    setLoading(true);
    const result = await login(form.email, form.password, 'teacher');
    setLoading(false);
    if (result.success) { notify.success('Welcome back, Teacher!'); navigate('/teacher/dashboard'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">👨‍🏫</div>
          <h1 className="text-2xl font-extrabold text-green-800">Teacher Login</h1>
          <p className="text-gray-500 text-sm mt-1">Haven of Hope Academy — Teacher Portal</p>
        </div>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-5 flex items-center gap-2">
            <span>⚠️</span> {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="teacher@school.edu" required
              className="w-full px-4 py-2.5 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
              className="w-full px-4 py-2.5 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in…</> : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
          <p><Link to="/student/login" className="text-green-600 hover:underline font-medium">Student Login</Link>{' · '}<Link to="/parent/login" className="text-green-600 hover:underline font-medium">Parent Login</Link></p>
          <p><Link to="/" className="text-green-600 hover:underline">← Back to Home</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
