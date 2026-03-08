import { motion } from 'framer-motion';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const todaysClasses = [
  { time: '8:00 – 8:45',   class: 'Class X-A', subject: 'Mathematics' },
  { time: '9:45 – 10:30',  class: 'Class IX-B', subject: 'Mathematics' },
  { time: '12:00 – 12:45', class: 'Class X-B', subject: 'Mathematics' },
];

const pendingTasks = [
  { task: 'Grade Assignment: Quadratic Equations', class: 'Class X-A', due: '2025-02-08' },
  { task: 'Upload Mid-Term Marks',               class: 'Class IX-B', due: '2025-02-10' },
  { task: 'Review Assignment: Python Program',   class: 'Class X-B',  due: '2025-02-12' },
];

const recentAnnouncements = [
  { title: 'Staff Meeting',         date: '2025-02-05', content: 'All staff meeting on Feb 7 at 3:00 PM in the conference room.' },
  { title: 'Exam Schedule Released', date: '2025-02-03', content: 'Final exam schedule has been released. Please prepare students.' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.name || 'Teacher';

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-6 mb-6 shadow-md">
        <p className="text-green-200 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-extrabold">{displayName} 👋</h1>
        <p className="text-green-200 text-sm mt-1">Haven of Hope Academy · {new Date().toDateString()}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Students"      value="127" icon="🎓" color="green"  trend="+3 this month" index={0} />
        <Card title="Classes Today"       value="3"   icon="📅" color="blue"   index={1} />
        <Card title="Pending to Grade"    value="8"   icon="📝" color="yellow" index={2} />
        <Card title="Announcements"       value="2"   icon="📢" color="indigo" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Classes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <h2 className="text-base font-bold text-green-800 mb-4">📅 Today's Classes</h2>
          <div className="space-y-3">
            {todaysClasses.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xs text-center leading-tight flex-shrink-0">
                  {c.time.split('–')[0].trim()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{c.subject}</p>
                  <p className="text-xs text-gray-500">{c.class} · {c.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <h2 className="text-base font-bold text-green-800 mb-4">⏳ Pending Tasks</h2>
          <div className="space-y-3">
            {pendingTasks.map((t, i) => (
              <div key={i} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-800">{t.task}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{t.class}</span>
                  <span className="text-xs text-red-500 font-semibold">Due: {t.due}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
          <h2 className="text-base font-bold text-green-800 mb-4">📢 Announcements</h2>
          <div className="space-y-3">
            {recentAnnouncements.map((a, i) => (
              <div key={i} className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <p className="text-sm font-semibold text-green-800">{a.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{a.content}</p>
                <p className="text-xs text-gray-400 mt-1">{a.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
