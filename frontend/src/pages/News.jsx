import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatRelativeTime, truncateText } from '../utils/formatters';

const allNews = [
  {
    id: 1,
    title: 'Mid-term Examination Results Published',
    category: 'Academic',
    content: 'Mid-term examination results for all classes have been published and are now accessible through the student portal. Students can log in with their credentials to view their subject-wise marks and grades. Parents are also encouraged to check their ward\'s performance.',
    date: '2025-02-01T10:00:00Z',
    pinned: true,
    author: 'Academic Office',
  },
  {
    id: 2,
    title: 'Annual Sports Day – Call for Participation',
    category: 'Sports',
    content: 'The Annual Sports Day is scheduled for February 10th at the School Sports Ground. All students from Class III onwards are encouraged to participate in at least one event. Registrations are open at the Sports Department office.',
    date: '2025-01-30T09:00:00Z',
    pinned: true,
    author: 'Sports Department',
  },
  {
    id: 3,
    title: 'Republic Day Celebrated with Enthusiasm',
    category: 'Events',
    content: 'Haven of Hope Academy celebrated Republic Day on January 26th with a flag hoisting ceremony, patriotic songs, and cultural performances. The Principal delivered an inspiring speech about the significance of the day and encouraged students to be responsible citizens.',
    date: '2025-01-26T08:00:00Z',
    pinned: false,
    author: 'Administration',
  },
  {
    id: 4,
    title: 'Holiday Notice – Mim Kut Festival',
    category: 'Holidays',
    content: 'School will remain closed on February 3rd, 2025 on account of the Mim Kut Festival. Classes will resume as normal from February 4th. Students are reminded to complete their pending assignments during the holiday.',
    date: '2025-02-01T11:00:00Z',
    pinned: false,
    author: 'Principal\'s Office',
  },
  {
    id: 5,
    title: 'New Computer Lab Inaugurated',
    category: 'Infrastructure',
    content: 'A state-of-the-art computer laboratory with 30 workstations has been inaugurated at our school. The new facility is equipped with high-speed internet and the latest software to enhance the digital learning experience for students.',
    date: '2025-01-20T14:00:00Z',
    pinned: false,
    author: 'Administration',
  },
  {
    id: 6,
    title: 'Scholarship Applications Open for 2025-26',
    category: 'Academic',
    content: 'Applications for merit-based scholarships for the academic year 2025-26 are now open. Students who scored above 85% in the previous year\'s final exams are eligible to apply. Application forms are available at the school office.',
    date: '2025-01-15T09:30:00Z',
    pinned: false,
    author: 'Academic Office',
  },
];

const categories = ['All', 'Academic', 'Sports', 'Events', 'Holidays', 'Infrastructure'];
const catColor = {
  Academic:       'bg-blue-100 text-blue-700',
  Sports:         'bg-orange-100 text-orange-700',
  Events:         'bg-purple-100 text-purple-700',
  Holidays:       'bg-red-100 text-red-700',
  Infrastructure: 'bg-green-100 text-green-700',
};

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = (activeCategory === 'All' ? allNews : allNews.filter((n) => n.category === activeCategory))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date) - new Date(a.date));

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-green-200 text-sm font-semibold uppercase tracking-widest mb-2">Stay Informed</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">News & Announcements</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Keep up to date with the latest happenings, announcements, and news from Haven of Hope Academy.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* News List */}
        <div className="space-y-5">
          {filtered.map((news, i) => {
            const isExpanded = expanded === news.id;
            return (
              <motion.article key={news.id}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow ${news.pinned ? 'border-yellow-300' : 'border-green-100'}`}>
                <div className="flex items-start gap-3 mb-3 flex-wrap">
                  {news.pinned && <span className="text-yellow-500 text-lg">📌</span>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor[news.category] || 'bg-gray-100 text-gray-700'}`}>{news.category}</span>
                      <span className="text-xs text-gray-400">{formatRelativeTime(news.date)}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-800">{news.title}</h2>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {isExpanded ? news.content : truncateText(news.content, 160)}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-gray-400">By {news.author}</p>
                  {news.content.length > 160 && (
                    <button onClick={() => setExpanded(isExpanded ? null : news.id)}
                      className="text-green-600 hover:text-green-700 text-xs font-semibold hover:underline">
                      {isExpanded ? '↑ Read less' : '↓ Read more'}
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📭</p>
            <p className="font-semibold text-lg">No news in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
