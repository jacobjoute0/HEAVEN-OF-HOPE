import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '📚',
    title: 'Quality Education',
    description: 'Comprehensive curriculum designed to nurture intellectual growth and academic excellence.',
  },
  {
    icon: '🌱',
    title: 'Character Development',
    description: 'We shape students with strong moral values and Christ-centered principles.',
  },
  {
    icon: '🏆',
    title: 'Excellence in All',
    description: 'Encouraging students to pursue excellence in academics, sports, and the arts.',
  },
  {
    icon: '🤝',
    title: 'Community Focus',
    description: 'Building a supportive community of learners, teachers, and families.',
  },
];

const stats = [
  { label: 'Students Enrolled', value: '500+' },
  { label: 'Qualified Teachers', value: '40+' },
  { label: 'Years of Excellence', value: '15+' },
  { label: 'Pass Rate', value: '98%' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25 }}
          >
            <p className="text-green-200 text-sm font-semibold uppercase tracking-widest mb-3">
              Welcome to
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Haven of Hope Academy
            </h1>
            <p className="text-xl md:text-2xl text-green-200 italic mb-2">
              "Learning Today, Leading Tomorrow"
            </p>
            <p className="text-green-300 mb-8 text-sm">— Psalms 127:3-4</p>
            <p className="text-lg text-green-100 max-w-2xl mx-auto mb-10">
              Providing quality education rooted in faith, character, and excellence at
              Hmarkhawlien, Cachar, Assam.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/admissions"
                className="px-8 py-3 bg-white text-green-800 font-bold rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-lg"
              >
                Apply Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-800 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.7 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-extrabold text-green-700">{stat.value}</p>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold gradient-text mb-3">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              At Haven of Hope Academy, we are committed to nurturing the whole child — mind, body, and spirit.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-green-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-green-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bible Verse Banner */}
      <section className="gradient-bg text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl md:text-3xl font-light italic leading-relaxed mb-4">
              "Children are a heritage from the Lord, offspring a reward from him. Like arrows in the
              hands of a warrior are children born in one's youth."
            </p>
            <p className="text-green-300 font-semibold">— Psalms 127:3-4 (NIV)</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-green-800 mb-4">Ready to Join Our Family?</h2>
          <p className="text-gray-600 mb-8">
            Take the first step toward a bright future. Admissions are open for the upcoming academic year.
          </p>
          <Link
            to="/admissions"
            className="px-10 py-4 gradient-bg text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg text-lg"
          >
            Start Your Application
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
