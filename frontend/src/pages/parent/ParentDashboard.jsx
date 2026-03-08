import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const child = {
  name: 'Lalrinsanga Pachuau',
  class: 'Class X – Section A',
  rollNo: 'STU-2024-042',
  photo: null,
};

const recentResults = [
  { subject: 'Mathematics',    marks: 82, max: 100, exam: 'Mid-Term' },
  { subject: 'English',        marks: 91, max: 100, exam: 'Mid-Term' },
  { subject: 'Science',        marks: 77, max: 100, exam: 'Mid-Term' },
];

const notifications = [
  { id: 1, message: 'Lalrinsanga was absent on Jan 17', type: 'warning', date: '2025-01-17' },
  { id: 2, message: 'Mid-term exam results published', type: 'info',    date: '2025-02-01' },
  { id: 3, message: 'Fee payment due by Feb 28',       type: 'error',   date: '2025-02-03' },
];

const notifStyle = { warning: 'bg-yellow-50 border-yellow-300 text-yellow-800', info: 'bg-blue-50 border-blue-300 text-blue-800', error: 'bg-red-50 border-red-300 text-red-800' };

export default function ParentDashboard() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.name || 'Parent';

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-6 mb-6 shadow-md">
        <p className="text-green-200 text-sm mb-1">Welcome,</p>
        <h1 className="text-2xl font-extrabold">{displayName} 👋</h1>
        <p className="text-green-200 text-sm mt-1">Haven of Hope Academy · Parent Portal</p>
      </motion.div>

      {/* Child Info Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Your Child</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-2xl font-bold text-green-800 flex-shrink-0">
            {child.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{child.name}</p>
            <p className="text-gray-500 text-sm">{child.class} · Roll: {child.rollNo}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Attendance"     value="87%"   icon="📅" color="green"  trend="+2% this month" index={0} />
        <Card title="Overall Grade"  value="B+"    icon="📊" color="blue"   index={1} />
        <Card title="Fee Due"        value="₹4,500" icon="💳" color="red"   index={2} />
        <Card title="Pending Assign" value="3"     icon="📝" color="yellow" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Results */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-green-800">📊 Recent Results</h2>
            <Link to="/parent/results" className="text-xs text-green-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentResults.map((r) => {
              const pct = Math.round((r.marks / r.max) * 100);
              return (
                <div key={r.subject} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.subject}</p>
                    <p className="text-xs text-gray-400">{r.exam}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{r.marks}/{r.max}</p>
                    <p className="text-xs text-gray-400">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <h2 className="text-base font-bold text-green-800 mb-4">🔔 Notifications</h2>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`p-3 rounded-lg border ${notifStyle[n.type]}`}>
                <p className="text-sm font-semibold">{n.message}</p>
                <p className="text-xs opacity-70 mt-0.5">{n.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
