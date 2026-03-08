import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3">About Us</h1>
          <p className="text-gray-600">Learn more about Haven of Hope Academy</p>
        </motion.div>
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Haven of Hope Academy is dedicated to providing quality education rooted in Christian values,
            academic excellence, and holistic development. We believe every child is a gift from God and
            deserves the best education possible.
          </p>
        </div>
        <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To be the leading educational institution in Cachar, Assam, producing students who are
            academically proficient, morally upright, and spiritually grounded — ready to lead
            tomorrow's world.
          </p>
        </div>
      </div>
    </div>
  );
}
