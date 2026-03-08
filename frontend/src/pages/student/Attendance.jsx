import { useState } from 'react';
import { motion } from 'framer-motion';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const subjectAttendance = [
  { subject: 'Mathematics',       present: 22, total: 25, percentage: 88 },
  { subject: 'English',           present: 24, total: 25, percentage: 96 },
  { subject: 'Science',           present: 20, total: 25, percentage: 80 },
  { subject: 'Social Studies',    present: 23, total: 25, percentage: 92 },
  { subject: 'Hindi',             present: 21, total: 25, percentage: 84 },
  { subject: 'Computer Science',  present: 18, total: 20, percentage: 90 },
];

// Calendar data for January 2025
const calendarData = {
  year: 2025, month: 0,
  days: [
    null, null, null, null,
    { day: 1, status: 'present' }, { day: 2, status: 'present' }, { day: 3, status: 'holiday' },
    { day: 4, status: 'holiday' }, { day: 5, status: 'holiday' }, { day: 6, status: 'present' },
    { day: 7, status: 'present' }, { day: 8, status: 'present' }, { day: 9, status: 'present' },
    { day: 10, status: 'absent' }, { day: 11, status: 'holiday' }, { day: 12, status: 'holiday' },
    { day: 13, status: 'present' }, { day: 14, status: 'present' }, { day: 15, status: 'present' },
    { day: 16, status: 'present' }, { day: 17, status: 'absent' }, { day: 18, status: 'holiday' },
    { day: 19, status: 'holiday' }, { day: 20, status: 'present' }, { day: 21, status: 'present' },
    { day: 22, status: 'present' }, { day: 23, status: 'present' }, { day: 24, status: 'present' },
    { day: 25, status: 'holiday' }, { day: 26, status: 'holiday' }, { day: 27, status: 'present' },
    { day: 28, status: 'present' }, { day: 29, status: 'present' }, { day: 30, status: 'present' },
    { day: 31, status: 'present' },
  ],
};

const statusStyle = {
  present: 'bg-green-500 text-white',
  absent:  'bg-red-400 text-white',
  holiday: 'bg-gray-200 text-gray-400',
};

function getBarColor(pct) {
  if (pct >= 85) return 'bg-green-500';
  if (pct >= 75) return 'bg-yellow-400';
  return 'bg-red-400';
}

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const overall = Math.round(subjectAttendance.reduce((a, s) => a + s.percentage, 0) / subjectAttendance.length);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold">My Attendance</h1>
          <p className="text-green-200 text-sm mt-0.5">Academic Year 2024-25</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-extrabold">{overall}%</p>
          <p className="text-green-200 text-xs">Overall Attendance</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${overall >= 75 ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}>
            {overall >= 75 ? '✓ Eligible' : '✗ Low'}
          </span>
        </div>
      </motion.div>

      {/* Month Selector */}
      <div className="flex gap-2 flex-wrap mb-5">
        {months.map((m, i) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              selectedMonth === i ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
        >
          <h2 className="text-base font-bold text-green-800 mb-4">
            📅 {months[selectedMonth]} 2025
          </h2>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarData.days.map((d, i) => (
              d === null
                ? <div key={`null-${i}`} />
                : <div
                    key={d.day}
                    className={`rounded-lg text-xs font-semibold flex items-center justify-center h-8 ${statusStyle[d.status]}`}
                  >
                    {d.day}
                  </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs font-medium">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Present</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span> Absent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 inline-block"></span> Holiday</span>
          </div>
        </motion.div>

        {/* Subject-wise Attendance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
        >
          <h2 className="text-base font-bold text-green-800 mb-4">📚 Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjectAttendance.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">{s.subject}</span>
                  <span className={`text-sm font-bold ${s.percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full ${getBarColor(s.percentage)}`}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{s.present}/{s.total} classes attended</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
