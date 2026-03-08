import { useState } from 'react';
import { motion } from 'framer-motion';

const mockAssignments = [
  { id: 1, title: 'Quadratic Equations – Practice Set', subject: 'Mathematics', dueDate: '2025-02-12', status: 'pending', description: 'Complete exercises 5.1 to 5.4 from the textbook.' },
  { id: 2, title: 'Essay: My Favourite Festival', subject: 'English', dueDate: '2025-02-08', status: 'submitted', description: 'Write a 500-word essay about your favourite festival.' },
  { id: 3, title: 'Periodic Table Quiz Preparation', subject: 'Science', dueDate: '2025-02-14', status: 'pending', description: 'Memorize elements 1-30 with symbols and atomic numbers.' },
  { id: 4, title: 'Map Work – India', subject: 'Social Studies', dueDate: '2025-02-06', status: 'overdue', description: 'Mark all major rivers and mountain ranges on an outline map of India.' },
  { id: 5, title: 'Python Basics Program', subject: 'Computer Science', dueDate: '2025-02-15', status: 'pending', description: 'Write a Python program that prints multiplication tables 1-10.' },
  { id: 6, title: 'Hindi Nibandh', subject: 'Hindi', dueDate: '2025-01-30', status: 'submitted', description: 'मेरे जीवन का लक्ष्य पर 300 शब्दों में निबंध लिखें।' },
];

const statusConfig = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  submitted: { label: 'Submitted', bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  overdue:   { label: 'Overdue',   bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400' },
};

export default function Assignments() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? mockAssignments
    : mockAssignments.filter((a) => a.status === filter);

  const counts = mockAssignments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl font-extrabold">Assignments</h1>
          <p className="text-green-200 text-sm">Class X · Academic Year 2024-25</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-2xl font-extrabold">{counts.pending || 0}</p>
            <p className="text-yellow-200 text-xs">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold">{counts.submitted || 0}</p>
            <p className="text-green-200 text-xs">Submitted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold">{counts.overdue || 0}</p>
            <p className="text-red-200 text-xs">Overdue</p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', 'pending', 'submitted', 'overdue'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
              filter === f ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
            }`}
          >
            {f === 'all' ? `All (${mockAssignments.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filtered.map((assignment, i) => {
          const sc = statusConfig[assignment.status];
          const isOverdue = assignment.status === 'overdue';
          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base">{assignment.title}</h3>
                  <span className="inline-block mt-0.5 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {assignment.subject}
                  </span>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                  {sc.label}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                  📅 Due: {assignment.dueDate}
                </p>
                {assignment.status === 'pending' && (
                  <button className="px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">
                    Submit ↗
                  </button>
                )}
                {assignment.status === 'submitted' && (
                  <span className="text-xs text-green-600 font-semibold flex items-center gap-1">✅ Submitted</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-semibold">No {filter} assignments</p>
        </div>
      )}
    </div>
  );
}
