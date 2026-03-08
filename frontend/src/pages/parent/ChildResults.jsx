import { motion } from 'framer-motion';
import { formatGrade, getGradeColor } from '../../utils/formatters';

const exams = [
  {
    id: 1,
    name: 'First Term',
    period: 'Apr – Jun 2024',
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
    name: 'Mid-Term',
    period: 'Sep 2024',
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

export default function ChildResults() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6">
        <h1 className="text-2xl font-extrabold">Child's Exam Results</h1>
        <p className="text-green-200 text-sm mt-0.5">Lalrinsanga Pachuau · Class X-A · 2024-25</p>
      </motion.div>

      <div className="space-y-6">
        {exams.map((exam, ei) => {
          const total = exam.results.reduce((s, r) => s + r.marks, 0);
          const maxTotal = exam.results.reduce((s, r) => s + r.max, 0);
          const percentage = ((total / maxTotal) * 100).toFixed(1);
          const grade = formatGrade(Number(percentage));
          const gradeColor = getGradeColor(grade);

          return (
            <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ei * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="gradient-bg text-white px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{exam.name}</h3>
                  <p className="text-green-200 text-sm">{exam.period}</p>
                </div>
                <div className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-extrabold ${gradeColor}`}>{grade}</span>
                  <p className="text-green-200 text-xs mt-1">{total}/{maxTotal} ({percentage}%)</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                      return (
                        <tr key={r.subject} className="border-t border-gray-50 hover:bg-green-50">
                          <td className="px-4 py-3 font-medium">{r.subject}</td>
                          <td className="px-4 py-3 text-center font-bold">{r.marks}</td>
                          <td className="px-4 py-3 text-center text-gray-400">{r.max}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{subPct}%</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getGradeColor(subGrade)}`}>{subGrade}</span>
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
        })}
      </div>
    </div>
  );
}
