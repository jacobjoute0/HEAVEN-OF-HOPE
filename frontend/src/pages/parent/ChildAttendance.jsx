import { motion } from 'framer-motion';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const subjectAttendance = [
  { subject: 'Mathematics',      present: 22, total: 25, percentage: 88 },
  { subject: 'English',          present: 24, total: 25, percentage: 96 },
  { subject: 'Science',          present: 20, total: 25, percentage: 80 },
  { subject: 'Social Studies',   present: 23, total: 25, percentage: 92 },
  { subject: 'Hindi',            present: 21, total: 25, percentage: 84 },
  { subject: 'Computer Science', present: 18, total: 20, percentage: 90 },
];

const monthlySummary = [
  { month: 'Apr', present: 23, total: 24 }, { month: 'May', present: 20, total: 22 },
  { month: 'Jun', present: 19, total: 20 }, { month: 'Jul', present: 22, total: 25 },
  { month: 'Aug', present: 20, total: 23 }, { month: 'Sep', present: 21, total: 24 },
  { month: 'Oct', present: 18, total: 22 }, { month: 'Nov', present: 22, total: 25 },
  { month: 'Dec', present: 17, total: 20 }, { month: 'Jan', present: 22, total: 25 },
];

function getBarColor(pct) {
  if (pct >= 85) return 'bg-green-500';
  if (pct >= 75) return 'bg-yellow-400';
  return 'bg-red-400';
}

export default function ChildAttendance() {
  const overall = Math.round(subjectAttendance.reduce((a, s) => a + s.percentage, 0) / subjectAttendance.length);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Child's Attendance</h1>
          <p className="text-green-200 text-sm mt-0.5">Lalrinsanga Pachuau · Class X-A</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-extrabold">{overall}%</p>
          <p className="text-green-200 text-xs">Overall</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${overall >= 75 ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}>
            {overall >= 75 ? '✓ Eligible' : '✗ Low Attendance'}
          </span>
        </div>
      </motion.div>

      {/* Monthly Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-5">
        <h2 className="text-base font-bold text-green-800 mb-4">📅 Monthly Attendance Summary</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {monthlySummary.map((m) => {
            const pct = Math.round((m.present / m.total) * 100);
            return (
              <div key={m.month} className="text-center">
                <div className={`w-full h-16 rounded-lg flex items-end justify-center pb-1 ${getBarColor(pct)}`}
                  style={{ opacity: pct / 100 + 0.3 }}>
                  <span className="text-white text-xs font-bold">{pct}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{m.month}</p>
                <p className="text-xs text-gray-400">{m.present}/{m.total}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Subject-wise */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
        <h2 className="text-base font-bold text-green-800 mb-4">📚 Subject-wise Attendance</h2>
        <div className="space-y-4">
          {subjectAttendance.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-700">{s.subject}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{s.present}/{s.total} classes</span>
                  <span className={`text-sm font-bold ${s.percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>{s.percentage}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.percentage}%` }} transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${getBarColor(s.percentage)}`} />
              </div>
            </div>
          ))}
        </div>

        {overall < 75 && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-semibold text-sm">⚠️ Low Attendance Warning</p>
            <p className="text-red-600 text-xs mt-1">Your child's attendance is below the required 75%. Please ensure regular attendance to avoid academic consequences.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
