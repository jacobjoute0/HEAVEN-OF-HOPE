import { motion } from 'framer-motion';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [
  { label: 'Period 1', time: '8:00 – 8:45' },
  { label: 'Period 2', time: '8:45 – 9:30' },
  { label: 'Break',   time: '9:30 – 9:45', isBreak: true },
  { label: 'Period 3', time: '9:45 – 10:30' },
  { label: 'Period 4', time: '10:30 – 11:15' },
  { label: 'Lunch',   time: '11:15 – 12:00', isBreak: true },
  { label: 'Period 5', time: '12:00 – 12:45' },
  { label: 'Period 6', time: '12:45 – 1:30' },
];

const timetable = {
  Monday:    ['Mathematics', 'English', null, 'Science', 'Social Studies', null, 'Hindi', 'Computer Science'],
  Tuesday:   ['English', 'Mathematics', null, 'Hindi', 'Computer Science', null, 'Science', 'Social Studies'],
  Wednesday: ['Science', 'Social Studies', null, 'Mathematics', 'English', null, 'Computer Science', 'Hindi'],
  Thursday:  ['Hindi', 'Computer Science', null, 'English', 'Mathematics', null, 'Social Studies', 'Science'],
  Friday:    ['Social Studies', 'Science', null, 'Computer Science', 'Hindi', null, 'Mathematics', 'English'],
  Saturday:  ['Mathematics', 'English', null, 'Science', null, null, null, null],
};

const subjectColors = {
  'Mathematics':      'bg-blue-50 text-blue-800 border border-blue-200',
  'English':          'bg-green-50 text-green-800 border border-green-200',
  'Science':          'bg-purple-50 text-purple-800 border border-purple-200',
  'Social Studies':   'bg-orange-50 text-orange-800 border border-orange-200',
  'Hindi':            'bg-pink-50 text-pink-800 border border-pink-200',
  'Computer Science': 'bg-indigo-50 text-indigo-800 border border-indigo-200',
};

const today = new Date().getDay(); // 0=Sun,1=Mon...
const dayIndex = today === 0 ? -1 : today - 1;

export default function Timetable() {
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6"
      >
        <h1 className="text-2xl font-extrabold">Class Timetable</h1>
        <p className="text-green-200 text-sm mt-0.5">Class X – Section A · Academic Year 2024-25</p>
      </motion.div>

      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden hidden md:block"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="px-4 py-3 text-left font-semibold w-36">Period / Day</th>
                {days.map((d, i) => (
                  <th key={d} className={`px-4 py-3 font-semibold text-center ${i === dayIndex ? 'bg-green-600' : ''}`}>
                    {d}
                    {i === dayIndex && <span className="block text-xs text-green-200">Today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, pi) => (
                <tr key={period.label} className={period.isBreak ? 'bg-gray-50' : 'hover:bg-green-50 transition-colors'}>
                  <td className="px-4 py-3 font-semibold text-gray-700 border-r border-green-100">
                    <div>{period.label}</div>
                    <div className="text-xs text-gray-400">{period.time}</div>
                  </td>
                  {days.map((day, di) => {
                    const subject = timetable[day]?.[pi];
                    return (
                      <td key={day} className={`px-3 py-2.5 text-center ${di === dayIndex ? 'bg-green-50/50' : ''}`}>
                        {period.isBreak ? (
                          <span className="text-xs text-gray-400 font-medium italic">
                            {period.label === 'Break' ? '☕ Break' : '🍽️ Lunch'}
                          </span>
                        ) : subject ? (
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${subjectColors[subject] || 'bg-gray-100 text-gray-700'}`}>
                            {subject}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile: Day Cards */}
      <div className="md:hidden space-y-4">
        {days.map((day, di) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: di * 0.06 }}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden ${di === dayIndex ? 'border-green-400' : 'border-green-100'}`}
          >
            <div className={`px-4 py-2.5 font-bold text-sm ${di === dayIndex ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800'}`}>
              {day} {di === dayIndex && '(Today)'}
            </div>
            <div className="divide-y divide-green-50">
              {periods.map((p, pi) => {
                const subject = timetable[day]?.[pi];
                return (
                  <div key={p.label} className="flex items-center px-4 py-2.5 gap-3">
                    <div className="w-20 text-xs text-gray-400">{p.time}</div>
                    {p.isBreak ? (
                      <span className="text-xs text-gray-400 italic">{p.label}</span>
                    ) : subject ? (
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${subjectColors[subject] || 'bg-gray-100 text-gray-700'}`}>
                        {subject}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">Free</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 bg-white rounded-xl shadow-sm border border-green-100 p-4"
      >
        <h3 className="text-sm font-bold text-green-800 mb-3">Subject Legend</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(subjectColors).map(([subject, color]) => (
            <span key={subject} className={`px-3 py-1 rounded-lg text-xs font-semibold ${color}`}>
              {subject}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
