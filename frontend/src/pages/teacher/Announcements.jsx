import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeTime } from '../../utils/formatters';

const audiences = ['All', 'Students', 'Parents', 'Teachers', 'Class X', 'Class IX'];

const initialAnnouncements = [
  { id: 1, title: 'Annual Sports Day', content: 'Annual Sports Day will be held on Feb 10. All students must participate.', audience: 'All', createdAt: '2025-02-01T09:00:00Z' },
  { id: 2, title: 'Mid-term Exam Schedule', content: 'Mid-term exams begin from Feb 15. Please refer to the exam timetable posted on the board.', audience: 'Students', createdAt: '2025-02-03T10:30:00Z' },
  { id: 3, title: 'Library Books Submission', content: 'All borrowed library books must be returned by Jan 31. Late returns will incur a fine.', audience: 'Students', createdAt: '2025-01-28T08:00:00Z' },
];

const emptyForm = { title: '', content: '', audience: 'All' };

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { notify.error('Title and content are required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setAnnouncements((p) => [{ id: Date.now(), ...form, createdAt: new Date().toISOString() }, ...p]);
    setForm(emptyForm);
    setShowForm(false);
    notify.success('Announcement posted successfully!');
  };

  const handleDelete = (id) => {
    setAnnouncements((p) => p.filter((a) => a.id !== id));
    notify.info('Announcement removed');
  };

  const audienceColor = (a) => {
    const m = { All: 'bg-green-100 text-green-700', Students: 'bg-blue-100 text-blue-700', Parents: 'bg-purple-100 text-purple-700', Teachers: 'bg-orange-100 text-orange-700' };
    return m[a] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Announcements</h1>
          <p className="text-green-200 text-sm mt-0.5">Post and manage school announcements</p>
        </div>
        <button onClick={() => setShowForm((p) => !p)}
          className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">
          {showForm ? '✕ Cancel' : '+ New Announcement'}
        </button>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">📢 Post Announcement</h2>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Announcement title" required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Audience *</label>
                <select name="audience" value={form.audience} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  {audiences.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={4} placeholder="Announcement content…" required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Posting…</> : '📢 Post Announcement'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4">
        {announcements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-gray-800 text-base">{a.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${audienceColor(a.audience)}`}>{a.audience}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{a.content}</p>
                <p className="text-gray-400 text-xs mt-2">{formatRelativeTime(a.createdAt)}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600 text-xl flex-shrink-0">🗑</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
