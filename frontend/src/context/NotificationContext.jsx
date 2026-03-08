import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext(null);

let notifId = 0;

function NotificationToast({ notification, onRemove }) {
  const typeStyles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error:   'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info:    'bg-blue-50 border-blue-400 text-blue-800',
  };
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.85 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg max-w-sm w-full ${typeStyles[notification.type] || typeStyles.info}`}
    >
      <span className="text-lg flex-shrink-0">{icons[notification.type] || icons.info}</span>
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className="font-semibold text-sm mb-0.5">{notification.title}</p>
        )}
        <p className="text-sm">{notification.message}</p>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity ml-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </motion.div>
  );
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({});

  const removeNotification = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      const id = ++notifId;
      const notification = { id, title, message, type, timestamp: Date.now() };
      setNotifications((prev) => [notification, ...prev.slice(0, 4)]);

      if (duration > 0) {
        timers.current[id] = setTimeout(() => removeNotification(id), duration);
      }
      return id;
    },
    [removeNotification]
  );

  const clearAll = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setNotifications([]);
  }, []);

  const notify = {
    success: (message, title) => addNotification({ type: 'success', message, title }),
    error:   (message, title) => addNotification({ type: 'error',   message, title, duration: 6000 }),
    warning: (message, title) => addNotification({ type: 'warning', message, title }),
    info:    (message, title) => addNotification({ type: 'info',    message, title }),
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notify,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence initial={false}>
          {notifications.map((n) => (
            <div key={n.id} className="pointer-events-auto">
              <NotificationToast notification={n} onRemove={removeNotification} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return context;
}

export { NotificationContext };
export default NotificationContext;
