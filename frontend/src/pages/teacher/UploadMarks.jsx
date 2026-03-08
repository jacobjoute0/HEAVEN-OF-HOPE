import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { validateMarks } from '../../utils/validators';

const classes = ['Class IX-A', 'Class IX-B', 'Class X-A', 'Class X-B'];
const exams = ['First Term', 'Mid-Term', 'Second Term', 'Final Exam'];
const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Computer Science'];
const mockStudents = [
  { id: 1, rollNo: '001', name: 'Lalrinsanga Pachuau' },
  { id: 2, rollNo: '002', name: 'Malsawmi Hnamte' },
  { id: 3, rollNo: '003', name: 'Vanlalruata Ralte' },
  { id: 4, rollNo: '004', name: 'Lalduhawmi Sailo' },
  { id: 5, rollNo: '005', name: 'Zorinpuia Chhangte' },
];

export default function UploadMarks() {
  const [selectedClass, setSelectedClass] = useState('Class X-A');
  const [selectedExam, setSelectedExam] = useState('Mid-Term');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [maxMarks, setMaxMarks] = useState(100);
  const [marks, setMarks] = useState(Object.fromEntries(mockStudents.map((s) => [s.id, ''])));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const handleMarkChange = (id, value) => {
    setMarks((p) => ({ ...p, [id]: value }));
    if (value !== '') {
      const { valid, error } = validateMarks(value, maxMarks);
      setErrors((p) => ({ ...p, [id]: valid ? '' : error }));
    } else {
      setErrors((p) => ({ ...p, [id]: '' }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    let hasError = false;
    mockStudents.forEach((s) => {
      const v = marks[s.id];
      if (v === '') { newErrors[s.id] = 'Please enter marks for this student'; hasError = true; return; }
      const { valid, error } = validateMarks(v, maxMarks);
      if (!valid) { newErrors[s.id] = error; hasError = true; }
    });
    setErrors(newErrors);
    if (hasError) { notify.error('Please fix the errors before saving'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    notify.success(`Marks uploaded for ${selectedSubject} – ${selectedExam} – ${selectedClass}`, 'Marks Saved');
  };

  const getGradeBadge = (mark, max) => {
    if (mark === '') return null;
    const pct = (mark / max) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-700' };
    if (pct >= 80) return { grade: 'A',  color: 'bg-green-50 text-green-600' };
    if (pct >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-700' };
    if (pct >= 60) return { grade: 'B',  color: 'bg-blue-50 text-blue-600' };
    if (pct >= 50) return { grade: 'C',  color: 'bg-yellow-100 text-yellow-700' };
    if (pct >= 40) return { grade: 'D',  color: 'bg-orange-100 text-orange-700' };
    return { grade: 'F', color: 'bg-red-100 text-red-700' };
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6">
        <h1 className="text-2xl font-extrabold">Upload Marks</h1>
        <p className="text-green-200 text-sm mt-0.5">Enter exam marks for students</p>
      </motion.div>

      {/* Selectors */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Class', value: selectedClass, setValue: setSelectedClass, options: classes },
            { label: 'Exam',  value: selectedExam,  setValue: setSelectedExam,  options: exams },
            { label: 'Subject', value: selectedSubject, setValue: setSelectedSubject, options: subjects },
          ].map((sel) => (
            <div key={sel.label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{sel.label}</label>
              <select value={sel.value} onChange={(e) => sel.setValue(e.target.value)}
                className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                {sel.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Marks</label>
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} min={1} max={200}
              className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
      </motion.div>

      {/* Marks Entry Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-5">
        <div className="px-5 py-3 bg-green-50 border-b border-green-100">
          <h2 className="font-bold text-green-800 text-sm">{selectedSubject} · {selectedExam} · {selectedClass} · Max: {maxMarks}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50/50 text-green-800 text-xs font-bold uppercase border-b border-green-100">
              <th className="px-4 py-3 text-left w-20">Roll No</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-center w-36">Marks (/{maxMarks})</th>
              <th className="px-4 py-3 text-center w-24">Grade</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map((student) => {
              const badge = getGradeBadge(Number(marks[student.id]), maxMarks);
              return (
                <tr key={student.id} className="border-t border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-medium">{student.rollNo}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{student.name}</td>
                  <td className="px-4 py-3">
                    <div>
                      <input type="number" value={marks[student.id]}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        min={0} max={maxMarks} placeholder="0"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-400 ${errors[student.id] ? 'border-red-400' : 'border-green-200'}`} />
                      {errors[student.id] && <p className="text-red-500 text-xs mt-0.5">{errors[student.id]}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {badge && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>{badge.grade}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <button onClick={handleSave} disabled={saving}
        className="px-8 py-3 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md">
        {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : '💾 Save Marks'}
      </button>
    </div>
  );
}
