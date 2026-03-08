import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatters';

const events = [
  {
    id: 1,
    title: 'Annual Sports Day 2025',
    date: '2025-02-10',
    time: '9:00 AM – 4:00 PM',
    location: 'School Sports Ground',
    type: 'Sports',
    description: 'Join us for our Annual Sports Day featuring inter-house competitions in athletics, team sports, and fun events for all age groups.',
    image: '🏃',
  },
  {
    id: 2,
    title: 'Science Exhibition',
    date: '2025-02-20',
    time: '10:00 AM – 2:00 PM',
    location: 'School Hall',
    type: 'Academic',
    description: 'Students from Classes VI to XII will present their innovative science projects, models, and experiments for judges and parents.',
    image: '🔬',
  },
  {
    id: 3,
    title: 'Annual Cultural Program',
    date: '2025-03-15',
    time: '5:00 PM onwards',
    location: 'School Auditorium',
    type: 'Cultural',
    description: 'Celebrate talent and creativity at our Annual Day with cultural performances, prize distribution, and a grand finale.',
    image: '🎭',
  },
  {
    id: 4,
    title: 'Parents-Teachers Meeting',
    date: '2025-03-05',
    time: '2:00 PM – 5:00 PM',
    location: 'Respective Classrooms',
    type: 'Meeting',
    description: 'Quarterly PTM for parents to discuss academic progress, attendance, and behaviour of their children with respective teachers.',
    image: '🤝',
  },
  {
    id: 5,
    title: 'Christmas Celebration',
    date: '2024-12-23',
    time: '10:00 AM – 1:00 PM',
    location: 'School Hall',
    type: 'Cultural',
    description: 'The school joyfully celebrated Christmas with carols, prayers, a special nativity play, and exchange of gifts among students.',
    image: '🎄',
  },
  {
    id: 6,
    title: 'Republic Day Celebration',
    date: '2025-01-26',
    time: '8:00 AM',
    location: 'School Ground',
    type: 'National',
    description: 'Republic Day was celebrated with flag hoisting ceremony, patriotic songs, and cultural performances by students.',
    image: '🇮🇳',
  },
];

const typeColors = {
  Sports:   'bg-orange-100 text-orange-700',
  Academic: 'bg-blue-100 text-blue-700',
  Cultural: 'bg-purple-100 text-purple-700',
  Meeting:  'bg-green-100 text-green-700',
  National: 'bg-yellow-100 text-yellow-700',
  Holiday:  'bg-red-100 text-red-700',
};

export default function Events() {
  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past     = events.filter((e) => new Date(e.date) < today).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-green-200 text-sm font-semibold uppercase tracking-widest mb-2">School Life</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Events & Activities</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Stay updated with all the exciting events, activities, and celebrations at Haven of Hope Academy.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="text-2xl font-extrabold text-green-800 mb-1">📅 Upcoming Events</h2>
              <p className="text-gray-500">Mark your calendars for these exciting upcoming events.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event, i) => (
                <motion.div key={event.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="gradient-bg p-6 flex items-center gap-4">
                    <div className="text-5xl">{event.image}</div>
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white mb-1 inline-block`}>{event.type}</span>
                      <p className="text-white font-extrabold text-lg leading-tight">{event.title}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    <div className="space-y-1.5 text-sm text-gray-500">
                      <div className="flex items-center gap-2"><span>📅</span><span>{formatDate(event.date)}</span></div>
                      <div className="flex items-center gap-2"><span>🕐</span><span>{event.time}</span></div>
                      <div className="flex items-center gap-2"><span>📍</span><span>{event.location}</span></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="text-2xl font-extrabold text-green-800 mb-1">🕐 Past Events</h2>
              <p className="text-gray-500">A glimpse at our recent celebrations and activities.</p>
            </motion.div>
            <div className="space-y-4">
              {past.map((event, i) => (
                <motion.div key={event.id}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-sm border border-green-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="text-4xl">{event.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-base">{event.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[event.type] || 'bg-gray-100 text-gray-700'}`}>{event.type}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{event.description}</p>
                    <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                      <span>📅 {formatDate(event.date)}</span>
                      <span>📍 {event.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
