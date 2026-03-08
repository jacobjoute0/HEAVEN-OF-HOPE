import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

const initialAdmissions = [
  { id: 1, studentName: 'Zonunsanga Colney',   class: 'Class IX', dob: '2009-05-10', guardian: 'Colneysanga',  contact: '+91 94555 11111', status: 'pending',  appliedOn: '2025-01-20' },
  { id: 2, studentName: 'Lalbiakdiki Sailo',   class: 'Class X',  dob: '2008-08-22', guardian: 'Sailopuia',    contact: '+91 94555 22222', status: 'approved', appliedOn: '2025-01-18' },
  { id: 3, studentName: 'Hmangaiha Pachuau',   class: 'Class IX', dob: '2009-02-14', guardian: 'Ngurdamawii',  contact: '+91 94555 33333', status: 'pending',  appliedOn: '2025-01-25' },
  { id: 4, studentName: 'Lalnghakhlua Tlau',   class: 'Class X',  dob: '2008-11-30', guardian: 'Tlauhnuna',    contact: '+91 94555 44444', status: 'rejected', appliedOn: '2025-01-15' },
  { id: 5, studentName: 'Vanlalzuali Chhangte', class: 'Class IX', dob: '2009-07-04', guardian: 'Chhangtepuia', contact: '+91 94555 55555', status: 'pending',  appliedOn: '2025-01-28' },
];

const statusConfig = {
  pending:  { label: 'Pending',  bg: 'bg-yellow-100', text: 'text-yellow-700' },
  approved: { label: 'Approved', bg: 'bg-green-100',  text: 'text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100',    text: 'text-red-700' },
};

export default function ManageAdmissions() {
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const { notify } = useNotifications();

  const filtered = filter === 'all' ? admissions : admissions.filter((a) => a.status === filter);
  const counts = admissions.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    await new Promise((r) => setTimeout(r, 600));
    setAdmissions((p) => p.map((a) => a.id === id ? { ...a, status: newStatus } : a));
    setUpdating(null);
    notify.success(`Application ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this application?')) return;
    setAdmissions((p) => p.filter((a) => a.id !== id));
    notify.info('Application deleted');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6">
        <h1 className="text-2xl font-extrabold">Manage Admissions</h1>
        <p className="text-green-200 text-sm mt-0.5">Review and process admission applications</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total',    value: admissions.length, bg: 'bg-gray-100', text: 'text-gray-700' },
          { label: 'Pending',  value: counts.pending || 0,  bg: 'bg-yellow-100', text: 'text-yellow-700' },
          { label: 'Approved', value: counts.approved || 0, bg: 'bg-green-100',  text: 'text-green-700' },
          { label: 'Rejected', value: counts.rejected || 0, bg: 'bg-red-100',    text: 'text-red-700' },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl text-center ${s.bg}`}>
            <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className={`text-sm font-semibold ${s.text}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${filter === f ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${admissions.length})` : `(${counts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((a, i) => {
          const sc = statusConfig[a.status];
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{a.studentName}</h3>
                  <p className="text-gray-500 text-sm">Applying for: <strong>{a.class}</strong> · Applied: {formatDate(a.appliedOn)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${sc.bg} ${sc.text}`}>{sc.label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                <div><span className="text-xs text-gray-400 font-semibold block">Date of Birth</span>{formatDate(a.dob)}</div>
                <div><span className="text-xs text-gray-400 font-semibold block">Guardian</span>{a.guardian}</div>
                <div><span className="text-xs text-gray-400 font-semibold block">Contact</span>{a.contact}</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {a.status !== 'approved' && (
                  <button onClick={() => updateStatus(a.id, 'approved')} disabled={updating === a.id}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                    {updating === a.id ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '✓ Approve'}
                  </button>
                )}
                {a.status !== 'rejected' && (
                  <button onClick={() => updateStatus(a.id, 'rejected')} disabled={updating === a.id}
                    className="px-4 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs font-bold rounded-lg">
                    ✗ Reject
                  </button>
                )}
                {a.status === 'rejected' && (
                  <button onClick={() => updateStatus(a.id, 'pending')} disabled={updating === a.id}
                    className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white text-xs font-bold rounded-lg">
                    ↩ Reset to Pending
                  </button>
                )}
                <button onClick={() => handleDelete(a.id)} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg ml-auto">🗑 Delete</button>
              </div>
            </motion.div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><p className="text-5xl mb-3">📭</p><p>No {filter} applications</p></div>}
    </div>
  );
}
