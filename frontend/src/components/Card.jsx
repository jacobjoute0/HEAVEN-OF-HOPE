import { motion } from 'framer-motion';

const colorMap = {
  green:  { bg: 'bg-green-50',  icon: 'bg-green-100',  text: 'text-green-700',  accent: 'text-green-600' },
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100',   text: 'text-blue-700',   accent: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100', text: 'text-yellow-700', accent: 'text-yellow-600' },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-100',    text: 'text-red-700',    accent: 'text-red-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-700', accent: 'text-purple-600' },
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100', text: 'text-indigo-700', accent: 'text-indigo-600' },
};

export default function Card({ title, value, icon, color = 'green', trend, subtitle, index = 0 }) {
  const colors = colorMap[color] || colorMap.green;
  const trendPositive = trend && !trend.startsWith('-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
      className={`${colors.bg} border border-white rounded-xl p-5 shadow-sm flex items-start gap-4 cursor-default`}
    >
      {/* Icon */}
      <div className={`${colors.icon} rounded-lg p-3 flex-shrink-0 flex items-center justify-center text-2xl`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 truncate">{title}</p>
        <p className={`text-2xl font-extrabold ${colors.text} leading-tight truncate`}>{value}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-1 truncate">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${trendPositive ? 'text-green-600' : 'text-red-500'}`}>
            <span>{trendPositive ? '▲' : '▼'}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
