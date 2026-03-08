import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';

const classes = ['Class IX-A', 'Class IX-B', 'Class X-A', 'Class X-B'];
const mockStudents = [
  { id: 1, rollNo: '001', name: 'Lalrinsanga Pachuau' },
  { id: 2, rollNo: '002', name: 'Malsawmi Hnamte' },
  { id: 3, rollNo: '003', name: 'Vanlalruata Ralte' },
  { id: 4, rollNo: '004', name: 'Lalduhawmi Sailo' },
  { id: 5, rollNo: '005', name: 'Zorinpuia Chhangte' },
  { id: 6, rollNo: '006', name: 'Lalthansangi Tlau' },
  { id: 7, rollNo: '007', name: 'Ramhluna Pachuau' },
  { id: 8, rollNo: '008', name: 'Zosangliani Sailo' },
  { id: 9, rollNo: '009', name: 'Lalnunmawia Ralte' },
  { id: 10, rollNo: '010', name: 'Vanlalthanpuii Hmar' },
];

export default function ManageAttendance() {
  const [selectedClass, setSelectedClass] = useState('Class X-A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState(
    Object.fromEntries(mockStudents.map((s) => [s.id, true]))
  );
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const toggleAttendance = (id) => setAttendance((p) => ({ ...p, [id]: !p[id] }));
  const markAll = (status) => setAttendance(Object.fromEntries(mockStudents.map((s) => [s.id, status])));

  const presentCount = Object.values(attendance).filter(Boolean).length;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    notify.success(`Attendance saved for ${selectedClass} on ${date}`, 'Attendance Saved');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6">
        <h1 className="text-2xl font-extrabold">Manage Attendance</h1>
        <p className="text-green-200 text-sm mt-0.5">Mark daily attendance for your class</p>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              {classes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => markAll(true)} className="flex-1 py-2.5 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-bold rounded-lg transition-colors">All Present</button>
            <button onClick={() => markAll(false)} className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-bold rounded-lg transition-colors">All Absent</button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex gap-4 mt-4 text-sm">
          <span className="text-green-700 font-bold">✓ Present: {presentCount}</span>
          <span className="text-red-600 font-bold">✗ Absent: {mockStudents.length - presentCount}</span>
          <span className="text-gray-500">Total: {mockStudents.length}</span>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-green-800 text-xs font-bold uppercase">
                <th className="px-4 py-3 text-left">Roll No</th>
                <th className="px-4 py-3 text-left">Student Name</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => {
                const isPresent = attendance[student.id];
                return (
                  <tr key={student.id} className={`border-t border-gray-50 transition-colors ${isPresent ? 'hover:bg-green-50' : 'bg-red-50/50 hover:bg-red-50'}`}>
                    <td className="px-4 py-3 font-medium text-gray-500">{student.rollNo}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{student.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isPresent ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleAttendance(student.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPresent ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${isPresent ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <button onClick={handleSave} disabled={saving}
        className="px-8 py-3 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md">
        {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : '💾 Save Attendance'}
      </button>
    </div>
  );
}
