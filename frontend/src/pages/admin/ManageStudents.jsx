import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, getInitials } from '../../utils/formatters';

const initialStudents = [
  { id: 1, name: 'Lalrinsanga Pachuau', rollNo: 'STU-001', class: 'Class X-A', email: 'lalrin@school.edu', status: 'active', dob: '2008-04-15', guardian: 'Thangtinlal Pachuau' },
  { id: 2, name: 'Malsawmi Hnamte',     rollNo: 'STU-002', class: 'Class X-B', email: 'malsaw@school.edu', status: 'active', dob: '2008-07-22', guardian: 'Lalthanpuia Hnamte' },
  { id: 3, name: 'Vanlalruata Ralte',   rollNo: 'STU-003', class: 'Class IX-A', email: 'vanral@school.edu', status: 'active', dob: '2009-01-10', guardian: 'Lalnunmawia Ralte' },
  { id: 4, name: 'Lalduhawmi Sailo',    rollNo: 'STU-004', class: 'Class IX-B', email: 'laldu@school.edu',  status: 'inactive', dob: '2009-03-05', guardian: 'Zoramthanga Sailo' },
  { id: 5, name: 'Zorinpuia Chhangte',  rollNo: 'STU-005', class: 'Class X-A', email: 'zorin@school.edu',  status: 'active', dob: '2008-11-18', guardian: 'Thangpuia Chhangte' },
];

const emptyForm = { name: '', email: '', rollNo: '', class: 'Class X-A', dob: '', guardian: '', guardianContact: '', address: '', status: 'active' };
const classes = ['Class IX-A', 'Class IX-B', 'Class X-A', 'Class X-B'];

export default function ManageStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ ...s }); setEditId(s.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rollNo) { notify.error('Name and Roll No are required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    if (editId) {
      setStudents((p) => p.map((s) => s.id === editId ? { ...form, id: editId } : s));
      notify.success('Student updated successfully');
    } else {
      setStudents((p) => [...p, { ...form, id: Date.now() }]);
      notify.success('Student added successfully');
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this student?')) return;
    setStudents((p) => p.filter((s) => s.id !== id));
    notify.info('Student removed');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Manage Students</h1>
          <p className="text-green-200 text-sm mt-0.5">{students.length} total students enrolled</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">+ Add Student</button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">{editId ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true },
                { label: 'Roll Number', name: 'rollNo', type: 'text', required: true },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Date of Birth', name: 'dob', type: 'date' },
                { label: 'Guardian Name', name: 'guardian', type: 'text' },
                { label: 'Guardian Contact', name: 'guardianContact', type: 'tel' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}{field.required && ' *'}</label>
                  <input type={field.type} name={field.name} value={form[field.name] || ''} onChange={handleChange} required={field.required}
                    className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class *</label>
                <select name="class" value={form.class} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  {classes.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : `✓ ${editId ? 'Update' : 'Add'} Student`}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="px-6 py-2.5 border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-50">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, roll number, or class…"
          className="w-full px-4 py-3 border border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-green-800 text-xs font-bold uppercase">
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Roll No</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Guardian</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xs flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.rollNo}</td>
                  <td className="px-4 py-3 text-gray-600">{s.class}</td>
                  <td className="px-4 py-3 text-gray-600">{s.guardian || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(s)} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">🔍</p>
            <p>No students found for "{search}"</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
