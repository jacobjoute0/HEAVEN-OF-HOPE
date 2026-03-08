import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Lalrinsanga Pachuau',
    email: user?.email || 'lalrin@havenofhope.edu',
    phone: user?.phone || '+91 98765 43210',
    dob: user?.dob || '2008-04-15',
    address: user?.address || 'Hmarkhawlien, Cachar, Assam',
    bloodGroup: user?.bloodGroup || 'B+',
    guardianName: user?.guardianName || 'Thangtinlal Pachuau',
    guardianContact: user?.guardianContact || '+91 94356 12345',
  });

  const info = [
    { label: 'Roll Number', value: 'STU-2024-042' },
    { label: 'Class',       value: 'Class X - Section A' },
    { label: 'Academic Year', value: '2024-25' },
    { label: 'Admission Date', value: '01 Apr 2019' },
    { label: 'Status',      value: 'Active' },
  ];

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-6 mb-6 flex items-center gap-5"
      >
        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0">
          {getInitials(form.name)}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">{form.name}</h1>
          <p className="text-green-200 text-sm">Class X · Roll No: STU-2024-042</p>
          <span className="inline-block mt-1 px-3 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full">Active Student</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
        >
          <h2 className="text-base font-bold text-green-800 mb-4 border-b border-green-100 pb-2">👤 Personal Information</h2>
          <div className="space-y-3">
            {[
              { label: 'Full Name',       name: 'name',     type: 'text' },
              { label: 'Email',           name: 'email',    type: 'email' },
              { label: 'Phone',           name: 'phone',    type: 'tel' },
              { label: 'Date of Birth',   name: 'dob',      type: 'date' },
              { label: 'Blood Group',     name: 'bloodGroup', type: 'text' },
              { label: 'Address',         name: 'address',  type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{field.label}</label>
                {editing ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                ) : (
                  <p className="text-gray-800 text-sm mt-0.5 font-medium">{form[field.name] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-5">
          {/* Academic Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
          >
            <h2 className="text-base font-bold text-green-800 mb-4 border-b border-green-100 pb-2">🎓 Academic Info</h2>
            <div className="space-y-3">
              {info.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.label === 'Status' ? 'text-green-600' : 'text-gray-800'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Guardian Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
          >
            <h2 className="text-base font-bold text-green-800 mb-4 border-b border-green-100 pb-2">👪 Guardian Info</h2>
            <div className="space-y-3">
              {[
                { label: 'Guardian Name',    name: 'guardianName' },
                { label: 'Guardian Contact', name: 'guardianContact' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{field.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  ) : (
                    <p className="text-gray-800 text-sm mt-0.5 font-medium">{form[field.name] || '—'}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex gap-3 mt-5"
      >
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              className="px-6 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-6 py-2.5 border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            ✏️ Edit Profile
          </button>
        )}
      </motion.div>
    </div>
  );
}
