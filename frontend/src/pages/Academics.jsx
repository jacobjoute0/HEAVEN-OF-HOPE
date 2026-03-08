import { motion } from 'framer-motion';

const programs = [
  { level: 'Pre-Primary', grades: 'Nursery - KG', description: 'Foundation years with play-based learning.' },
  { level: 'Primary', grades: 'Class I - V', description: 'Core subjects with emphasis on fundamentals.' },
  { level: 'Middle School', grades: 'Class VI - VIII', description: 'Comprehensive curriculum with co-curricular activities.' },
  { level: 'Secondary', grades: 'Class IX - X', description: 'CBSE/State board preparation with career guidance.' },
];

export default function Academics() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3">Academics</h1>
          <p className="text-gray-600">Our comprehensive educational programs</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-md border border-green-100"
            >
              <h3 className="text-xl font-bold text-green-800 mb-1">{prog.level}</h3>
              <p className="text-green-600 text-sm font-semibold mb-2">{prog.grades}</p>
              <p className="text-gray-600">{prog.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
