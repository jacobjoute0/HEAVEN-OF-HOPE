import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

const initialEvents = [
  { id: 1, title: 'Annual Sports Day',         date: '2025-02-10', type: 'Sports',   description: 'Annual inter-house sports competition.', location: 'School Ground', time: '9:00 AM' },
  { id: 2, title: 'Science Exhibition',         date: '2025-02-20', type: 'Academic', description: 'Students showcase science projects and experiments.', location: 'School Hall', time: '10:00 AM' },
  { id: 3, title: 'Parents-Teachers Meeting',   date: '2025-03-05', type: 'Meeting',  description: 'Quarterly PTM for academic progress discussion.', location: 'Classrooms', time: '2:00 PM' },
  { id: 4, title: 'Annual Cultural Program',    date: '2025-03-15', type: 'Cultural', description: 'Annual day with cultural performances and prize distribution.', location: 'School Auditorium', time: '5:00 PM' },
];

const eventTypes = ['Academic', 'Sports', 'Cultural', 'Meeting', 'Holiday', 'Other'];
const typeColors = { Academic: 'bg-blue-100 text-blue-700', Sports: 'bg-orange-100 text-orange-700', Cultural: 'bg-purple-100 text-purple-700', Meeting: 'bg-green-100 text-green-700', Holiday: 'bg-red-100 text-red-700', Other: 'bg-gray-100 text-gray-700' };

const emptyForm = { title: '', date: '', time: '', type: 'Academic', description: '', location: '' };

export default function ManageEvents() {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (e) => { setForm({ ...e }); setEditId(e.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { notify.error('Title and date are required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    if (editId) {
      setEvents((p) => p.map((ev) => ev.id === editId ? { ...form, id: editId } : ev));
      notify.success('Event updated');
    } else {
      setEvents((p) => [...p, { ...form, id: Date.now() }]);
      notify.success('Event created');
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this event?')) return;
    setEvents((p) => p.filter((ev) => ev.id !== id));
    notify.info('Event deleted');
  };

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold">Manage Events</h1><p className="text-green-200 text-sm mt-0.5">School events calendar</p></div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">+ Add Event</button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">{editId ? '✏️ Edit Event' : '➕ Create Event'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Event title" required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  {eventTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Time</label>
                <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 9:00 AM"
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Venue"
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Event description…"
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
              <div className="sm:col-span-3 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : `✓ ${editId ? 'Update' : 'Create'} Event`}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 py-2.5 border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-50">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sorted.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-gray-800 text-base">{ev.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[ev.type] || typeColors.Other}`}>{ev.type}</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{ev.description}</p>
                <div className="flex gap-3 text-xs text-gray-400 flex-wrap">
                  <span>📅 {formatDate(ev.date)}</span>
                  {ev.time && <span>🕐 {ev.time}</span>}
                  {ev.location && <span>📍 {ev.location}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(ev)} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg">Edit</button>
                <button onClick={() => handleDelete(ev.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
