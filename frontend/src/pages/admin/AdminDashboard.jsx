import { motion } from 'framer-motion';
import Card from '../../components/Card';

const recentActivity = [
  { icon: '🎓', text: 'New student Lalbiakmawia enrolled in Class IX-A', time: '2 hours ago' },
  { icon: '👨‍🏫', text: 'Teacher Vanlalhruaia updated attendance for Class X-B', time: '4 hours ago' },
  { icon: '📋', text: 'New admission application received from Zonunsanga', time: '6 hours ago' },
  { icon: '💳', text: 'Fee payment of ₹3,500 received from Parent Thangtinlal', time: '1 day ago' },
  { icon: '📢', text: 'Sports Day announcement published by Principal', time: '2 days ago' },
];

const quickStats = [
  { label: 'Boys',   value: '278', bg: 'bg-blue-50 text-blue-700' },
  { label: 'Girls',  value: '234', bg: 'bg-pink-50 text-pink-700' },
  { label: 'Staff',  value: '42',  bg: 'bg-purple-50 text-purple-700' },
  { label: 'Classes', value: '18', bg: 'bg-orange-50 text-orange-700' },
];

export default function AdminDashboard() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-6 mb-6 shadow-md">
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <p className="text-green-200 text-sm mt-1">Haven of Hope Academy · {new Date().toDateString()}</p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Students"  value="512"  icon="🎓" color="green"  trend="+8 this month" index={0} />
        <Card title="Teachers"        value="40"   icon="👨‍🏫" color="blue"  trend="+2 this month" index={1} />
        <Card title="Parents"         value="380"  icon="👪" color="purple" index={2} />
        <Card title="Pending Admits"  value="15"   icon="📋" color="yellow" index={3} />
      </div>

      {/* Quick Breakdown */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-6">
        <h2 className="text-base font-bold text-green-800 mb-3">📊 School Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickStats.map((s) => (
            <div key={s.label} className={`p-4 rounded-xl text-center ${s.bg}`}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-sm font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <h2 className="text-base font-bold text-green-800 mb-4">🕐 Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-green-50 last:border-0">
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <h2 className="text-base font-bold text-green-800 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Student',  icon: '➕🎓', path: '/admin/students' },
              { label: 'Add Teacher',  icon: '➕👨‍🏫', path: '/admin/teachers' },
              { label: 'View Admissions', icon: '📋', path: '/admin/admissions' },
              { label: 'Post News',    icon: '📰', path: '/admin/news' },
              { label: 'Add Event',   icon: '🗓️',   path: '/admin/events' },
              { label: 'Manage Parents', icon: '👪', path: '/admin/parents' },
            ].map((a) => (
              <a key={a.label} href={a.path}
                className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center cursor-pointer">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-semibold text-green-800">{a.label}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
