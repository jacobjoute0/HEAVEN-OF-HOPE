import { motion } from 'framer-motion';

export default function Admissions() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3">Admissions</h1>
          <p className="text-gray-600">Join the Haven of Hope Academy family</p>
        </motion.div>
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">How to Apply</h2>
          <ol className="space-y-4">
            {[
              'Download and complete the application form',
              'Submit required documents (birth certificate, previous school records)',
              'Attend an entrance assessment',
              'Receive admission confirmation',
              'Complete fee payment and enrollment',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
