import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { getInitials } from '../../utils/formatters';

const initialParents = [
  { id: 1, name: 'Thangtinlal Pachuau', email: 'thangt@email.com', phone: '+91 94356 12345', children: ['Lalrinsanga Pachuau'], occupation: 'Government Employee', status: 'active' },
  { id: 2, name: 'Lalthanpuia Hnamte',  email: 'laltha@email.com', phone: '+91 94356 23456', children: ['Malsawmi Hnamte'],     occupation: 'Business',           status: 'active' },
  { id: 3, name: 'Lalnunmawia Ralte',   email: 'lalnun@email.com', phone: '+91 94356 34567', children: ['Vanlalruata Ralte'],   occupation: 'Teacher',            status: 'active' },
  { id: 4, name: 'Zoramthanga Sailo',   email: 'zorams@email.com', phone: '+91 94356 45678', children: ['Lalduhawmi Sailo'],   occupation: 'Farmer',             status: 'active' },
];

const emptyForm = { name: '', email: '', phone: '', occupation: '', address: '', status: 'active' };

export default function ManageParents() {
  const [parents, setParents] = useState(initialParents);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const filtered = parents.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditId(p.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { notify.error('Name is required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    if (editId) {
      setParents((p) => p.map((par) => par.id === editId ? { ...form, id: editId, children: par.children } : par));
      notify.success('Parent updated');
    } else {
      setParents((p) => [...p, { ...form, id: Date.now(), children: [] }]);
      notify.success('Parent added');
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!confirm('Remove this parent?')) return;
    setParents((p) => p.filter((par) => par.id !== id));
    notify.info('Parent removed');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Manage Parents</h1>
          <p className="text-green-200 text-sm mt-0.5">{parents.length} registered parents</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">+ Add Parent</button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-5 mb-5 overflow-hidden">
            <h2 className="text-base font-bold text-green-800 mb-4">{editId ? '✏️ Edit Parent' : '➕ Add Parent'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true },
                { label: 'Email',     name: 'email', type: 'email' },
                { label: 'Phone',     name: 'phone', type: 'tel' },
                { label: 'Occupation', name: 'occupation', type: 'text' },
                { label: 'Address',   name: 'address', type: 'text' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{f.label}{f.required && ' *'}</label>
                  <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange} required={f.required}
                    className="w-full px-3 py-2.5 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              ))}
              <div className="sm:col-span-3 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : `✓ ${editId ? 'Update' : 'Add'} Parent`}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 py-2.5 border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-50">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parents by name or email…"
          className="w-full px-4 py-3 border border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-green-800 text-xs font-bold uppercase">
                <th className="px-4 py-3 text-left">Parent</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Children</th>
                <th className="px-4 py-3 text-left">Occupation</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-bold text-xs flex-shrink-0">{getInitials(p.name)}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.children?.join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.occupation || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400"><p className="text-4xl mb-2">🔍</p><p>No parents found</p></div>}
      </motion.div>
    </div>
  );
}
