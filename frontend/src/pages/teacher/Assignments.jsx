import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

const classes = ['Class IX-A', 'Class IX-B', 'Class X-A', 'Class X-B'];

const initialAssignments = [
  { id: 1, title: 'Quadratic Equations – Practice Set', class: 'Class X-A', dueDate: '2025-02-12', description: 'Complete exercises 5.1 to 5.4.', submissions: 18, total: 24 },
  { id: 2, title: 'Python Basics Program',              class: 'Class IX-B', dueDate: '2025-02-15', description: 'Write a multiplication table program.', submissions: 10, total: 22 },
  { id: 3, title: 'Trigonometry Problems',              class: 'Class X-B', dueDate: '2025-02-18', description: 'Solve all problems from Chapter 8.', submissions: 5,  total: 26 },
];

const emptyForm = { title: '', description: '', dueDate: '', class: 'Class X-A' };

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) { notify.error('Title and due date are required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    const newAssignment = { id: Date.now(), ...form, submissions: 0, total: 24 };
    setAssignments((p) => [newAssignment, ...p]);
    setForm(emptyForm);
    setShowForm(false);
    notify.success('Assignment created successfully!');
  };

  const handleDelete = (id) => {
    setAssignments((p) => p.filter((a) => a.id !== id));
    notify.info('Assignment deleted');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Assignments</h1>
          <p className="text-green-200 text-sm mt-0.5">Create and manage student assignments</p>
        </div>
        <button onClick={() => setShowForm((p) => !p)}
          className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">
          {showForm ? '✕ Cancel' : '+ New Assignment'}
        </button>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">📝 Create New Assignment</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Assignment title" required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class *</label>
                <select name="class" value={form.class} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  {classes.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Due Date *</label>
                <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the assignment…"
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</> : '✓ Create Assignment'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((a, i) => {
          const pct = Math.round((a.submissions / a.total) * 100);
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800">{a.title}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{a.class}</span>
                    <span className="text-xs text-red-600 font-semibold">Due: {formatDate(a.dueDate)}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600 text-xl leading-none flex-shrink-0">🗑</button>
              </div>
              <p className="text-gray-500 text-sm mb-3">{a.description}</p>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Submissions</span>
                  <span className="font-bold">{a.submissions}/{a.total} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
