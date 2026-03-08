import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { getInitials } from '../../utils/formatters';

const initialTeachers = [
  { id: 1, name: 'Vanlalhruaia Tlau',  employeeId: 'TCH-001', subject: 'Mathematics',   email: 'vanlal@school.edu',  phone: '+91 98765 11111', status: 'active', qualification: 'M.Sc. Mathematics' },
  { id: 2, name: 'Lalnunmawii Ralte',  employeeId: 'TCH-002', subject: 'English',        email: 'lalnu@school.edu',   phone: '+91 98765 22222', status: 'active', qualification: 'M.A. English' },
  { id: 3, name: 'Zoramthanga Sailo',  employeeId: 'TCH-003', subject: 'Science',        email: 'zoram@school.edu',   phone: '+91 98765 33333', status: 'active', qualification: 'M.Sc. Physics' },
  { id: 4, name: 'Thangpuii Hnamte',   employeeId: 'TCH-004', subject: 'Social Studies', email: 'thang@school.edu',   phone: '+91 98765 44444', status: 'active', qualification: 'M.A. History' },
  { id: 5, name: 'Lalhmangaiha Chawn', employeeId: 'TCH-005', subject: 'Computer Sci',  email: 'lalhman@school.edu', phone: '+91 98765 55555', status: 'inactive', qualification: 'B.Tech. CS' },
];

const emptyForm = { name: '', email: '', phone: '', subject: 'Mathematics', employeeId: '', qualification: '', status: 'active' };
const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education'];

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (t) => { setForm({ ...t }); setEditId(t.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.employeeId) { notify.error('Name and Employee ID are required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    if (editId) {
      setTeachers((p) => p.map((t) => t.id === editId ? { ...form, id: editId } : t));
      notify.success('Teacher updated');
    } else {
      setTeachers((p) => [...p, { ...form, id: Date.now() }]);
      notify.success('Teacher added');
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!confirm('Remove this teacher?')) return;
    setTeachers((p) => p.filter((t) => t.id !== id));
    notify.info('Teacher removed');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Manage Teachers</h1>
          <p className="text-green-200 text-sm mt-0.5">{teachers.length} total staff members</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">+ Add Teacher</button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">{editId ? '✏️ Edit Teacher' : '➕ Add Teacher'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true },
                { label: 'Employee ID', name: 'employeeId', type: 'text', required: true },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone', type: 'tel' },
                { label: 'Qualification', name: 'qualification', type: 'text' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{f.label}{f.required && ' *'}</label>
                  <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange} required={f.required}
                    className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : `✓ ${editId ? 'Update' : 'Add'} Teacher`}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 py-2.5 border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-50">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, subject, or ID…"
          className="w-full px-4 py-3 border border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-green-800 text-xs font-bold uppercase">
                <th className="px-4 py-3 text-left">Teacher</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Qualification</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0">{getInitials(t.name)}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.employeeId}</td>
                  <td className="px-4 py-3 text-gray-600">{t.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{t.qualification || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(t)} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400"><p className="text-4xl mb-2">🔍</p><p>No teachers found</p></div>}
      </motion.div>
    </div>
  );
}
