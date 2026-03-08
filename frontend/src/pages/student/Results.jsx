import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatGrade, getGradeColor } from '../../utils/formatters';

const exams = [
  {
    id: 1,
    name: 'First Term Examination',
    period: 'April – June 2024',
    results: [
      { subject: 'Mathematics',      marks: 82, max: 100 },
      { subject: 'English',          marks: 91, max: 100 },
      { subject: 'Science',          marks: 77, max: 100 },
      { subject: 'Social Studies',   marks: 88, max: 100 },
      { subject: 'Hindi',            marks: 74, max: 100 },
      { subject: 'Computer Science', marks: 93, max: 100 },
    ],
  },
  {
    id: 2,
    name: 'Mid-Term Examination',
    period: 'September 2024',
    results: [
      { subject: 'Mathematics',      marks: 78, max: 100 },
      { subject: 'English',          marks: 85, max: 100 },
      { subject: 'Science',          marks: 72, max: 100 },
      { subject: 'Social Studies',   marks: 90, max: 100 },
      { subject: 'Hindi',            marks: 68, max: 100 },
      { subject: 'Computer Science', marks: 88, max: 100 },
    ],
  },
];

function ExamCard({ exam }) {
  const total = exam.results.reduce((s, r) => s + r.marks, 0);
  const maxTotal = exam.results.reduce((s, r) => s + r.max, 0);
  const percentage = ((total / maxTotal) * 100).toFixed(1);
  const grade = formatGrade(Number(percentage));
  const gradeColor = getGradeColor(grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden"
    >
      {/* Exam Header */}
      <div className="gradient-bg text-white px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{exam.name}</h3>
          <p className="text-green-200 text-sm">{exam.period}</p>
        </div>
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-extrabold ${gradeColor}`}>
            {grade}
          </span>
          <p className="text-green-200 text-xs mt-1">{percentage}%</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-green-50 text-green-800 text-xs font-bold uppercase">
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-center">Marks</th>
              <th className="px-4 py-3 text-center">Max</th>
              <th className="px-4 py-3 text-center">%</th>
              <th className="px-4 py-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {exam.results.map((r) => {
              const subPct = ((r.marks / r.max) * 100).toFixed(1);
              const subGrade = formatGrade(r.marks, r.max);
              const subColor = getGradeColor(subGrade);
              return (
                <tr key={r.subject} className="border-t border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.subject}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800">{r.marks}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{r.max}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{subPct}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${subColor}`}>{subGrade}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-green-800 text-white font-bold">
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3 text-center">{total}</td>
              <td className="px-4 py-3 text-center">{maxTotal}</td>
              <td className="px-4 py-3 text-center">{percentage}%</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor}`}>{grade}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
}

export default function Results() {
  const [selectedExam, setSelectedExam] = useState(null);
  const displayed = selectedExam ? exams.filter((e) => e.id === selectedExam) : exams;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6"
      >
        <h1 className="text-2xl font-extrabold">Exam Results</h1>
        <p className="text-green-200 text-sm mt-0.5">Academic Year 2024-25 · Class X Section A</p>
      </motion.div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setSelectedExam(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${!selectedExam ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'}`}
        >
          All Exams
        </button>
        {exams.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedExam(e.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${selectedExam === e.id ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'}`}
          >
            {e.name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {displayed.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
      </div>
    </div>
  );
}
