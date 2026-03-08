import { motion } from 'framer-motion';

export default function Gallery() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3">Gallery</h1>
          <p className="text-gray-600">Moments from our school life</p>
        </motion.div>
        <div className="bg-green-50 rounded-2xl p-12 text-center border border-green-100">
          <p className="text-green-700 text-lg">Gallery photos coming soon...</p>
        </div>
      </div>
    </div>
  );
}
