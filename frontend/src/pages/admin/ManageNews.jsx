import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeTime, truncateText } from '../../utils/formatters';

const categories = ['General', 'Academic', 'Sports', 'Events', 'Holidays', 'Exams'];

const initialNews = [
  { id: 1, title: 'Mid-term Results Released', category: 'Academic', content: 'Mid-term examination results have been uploaded to the student portal. Students can check their results by logging in.', createdAt: '2025-02-01T10:00:00Z', pinned: true },
  { id: 2, title: 'Annual Sports Day 2025',    category: 'Sports',   content: 'Annual Sports Day will be celebrated on February 10th. All students are expected to participate in at least one event.', createdAt: '2025-01-30T09:00:00Z', pinned: false },
  { id: 3, title: 'Republic Day Celebration',  category: 'Events',   content: 'Republic Day was celebrated with great enthusiasm. The flag hoisting ceremony was followed by cultural programs.', createdAt: '2025-01-26T08:00:00Z', pinned: false },
  { id: 4, title: 'Holiday Notice – Mim Kut',  category: 'Holidays', content: 'School will remain closed on February 3rd on account of Mim Kut Festival. Classes will resume on February 4th.', createdAt: '2025-02-01T11:00:00Z', pinned: true },
];

const emptyForm = { title: '', category: 'General', content: '', pinned: false };

export default function ManageNews() {
  const [news, setNews] = useState(initialNews);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [e.target.name]: val }));
  };
  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (n) => { setForm({ ...n }); setEditId(n.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { notify.error('Title and content are required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    if (editId) {
      setNews((p) => p.map((n) => n.id === editId ? { ...form, id: editId, createdAt: n.createdAt } : n));
      notify.success('News updated');
    } else {
      setNews((p) => [{ ...form, id: Date.now(), createdAt: new Date().toISOString() }, ...p]);
      notify.success('News published');
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this news post?')) return;
    setNews((p) => p.filter((n) => n.id !== id));
    notify.info('News deleted');
  };

  const togglePin = (id) => setNews((p) => p.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const catColor = { General: 'bg-gray-100 text-gray-700', Academic: 'bg-blue-100 text-blue-700', Sports: 'bg-orange-100 text-orange-700', Events: 'bg-purple-100 text-purple-700', Holidays: 'bg-red-100 text-red-700', Exams: 'bg-indigo-100 text-indigo-700' };

  const sorted = [...news].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold">Manage News & Announcements</h1><p className="text-green-200 text-sm mt-0.5">{news.length} total posts · {news.filter((n) => n.pinned).length} pinned</p></div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">+ New Post</button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">{editId ? '✏️ Edit Post' : '📰 New Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="News title" required
                    className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={5} placeholder="News content…" required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} className="w-4 h-4 text-green-600 rounded border-green-300" />
                <span className="text-sm font-semibold text-gray-700">📌 Pin this post (show at top)</span>
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : `✓ ${editId ? 'Update' : 'Publish'}`}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 py-2.5 border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-50">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sorted.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow ${n.pinned ? 'border-yellow-300' : 'border-green-100'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {n.pinned && <span className="text-yellow-500 text-sm">📌</span>}
                  <h3 className="font-bold text-gray-800 text-base">{n.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor[n.category] || catColor.General}`}>{n.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{truncateText(n.content, 150)}</p>
                <p className="text-gray-400 text-xs">{formatRelativeTime(n.createdAt)}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => togglePin(n.id)} className={`px-3 py-1 text-xs font-bold rounded-lg ${n.pinned ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {n.pinned ? '📌 Unpin' : '📌 Pin'}
                </button>
                <button onClick={() => openEdit(n)} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg">Edit</button>
                <button onClick={() => handleDelete(n.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
