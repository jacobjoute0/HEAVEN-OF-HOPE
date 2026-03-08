import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const announcements = [
  { id: 1, title: 'Annual Sports Day', date: '2025-02-10', content: 'Annual Sports Day will be held on Feb 10. All students must participate.' },
  { id: 2, title: 'Mid-term Exam Schedule', date: '2025-02-05', content: 'Mid-term exams begin from Feb 15. Please refer to the exam timetable.' },
  { id: 3, title: 'Library Books Submission', date: '2025-01-28', content: 'All borrowed library books must be returned by Jan 31.' },
];

const quickLinks = [
  { label: 'View Timetable', path: '/student/timetable', icon: '🕐' },
  { label: 'Check Results',  path: '/student/results',   icon: '📊' },
  { label: 'Assignments',    path: '/student/assignments', icon: '📝' },
  { label: 'Pay Fees',       path: '/student/fees',       icon: '💳' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.name || 'Student';

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-6 mb-6 shadow-md"
      >
        <p className="text-green-200 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-extrabold">{displayName} 👋</h1>
        <p className="text-green-200 text-sm mt-1">Haven of Hope Academy · Academic Year 2024-25</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Attendance"          value="87%"  icon="📅" color="green"  trend="+2% this month" index={0} />
        <Card title="Pending Assignments" value="3"    icon="📝" color="yellow" index={1} />
        <Card title="Upcoming Exams"      value="2"    icon="📖" color="blue"   index={2} />
        <Card title="Fee Due"             value="₹4,500" icon="💳" color="red" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-green-100 p-5"
        >
          <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            📢 <span>Recent Announcements</span>
          </h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-green-800 text-sm">{a.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{a.date}</span>
                </div>
                <p className="text-gray-600 text-xs mt-1">{a.content}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
        >
          <h2 className="text-lg font-bold text-green-800 mb-4">⚡ Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-xs font-semibold text-green-800">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Attendance Summary */}
          <div className="mt-4 p-4 bg-green-800 rounded-xl text-white">
            <p className="text-green-200 text-xs mb-1">This Month's Attendance</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-extrabold">87%</span>
              <span className="text-green-300 text-xs">22/25 days</span>
            </div>
            <div className="mt-2 h-2 bg-green-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-300 rounded-full" style={{ width: '87%' }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
