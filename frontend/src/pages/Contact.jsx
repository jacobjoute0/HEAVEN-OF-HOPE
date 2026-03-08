import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3">Contact Us</h1>
          <p className="text-gray-600">Get in touch with Haven of Hope Academy</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">Our Location</h2>
            <p className="text-gray-700">Hmarkhawlien</p>
            <p className="text-gray-700">Cachar, Assam</p>
            <p className="text-gray-700">788106</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <h2 className="text-xl font-bold text-green-800 mb-4">Send a Message</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                rows={4}
                placeholder="Your Message"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="w-full py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
