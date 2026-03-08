import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';

const outstandingFees = [
  { id: 'F001', description: 'Tuition Fee – Term 2',   amount: 3500, dueDate: '2025-02-28', status: 'unpaid' },
  { id: 'F002', description: 'Lab Fee',                amount:  500, dueDate: '2025-02-28', status: 'unpaid' },
  { id: 'F003', description: 'Library Fee',            amount:  200, dueDate: '2025-02-28', status: 'unpaid' },
  { id: 'F004', description: 'Sports Fee',             amount:  300, dueDate: '2025-03-15', status: 'unpaid' },
];

const paymentHistory = [
  { id: 'P001', description: 'Tuition Fee – Term 1',   amount: 3500, date: '2024-10-05', status: 'paid', receipt: 'RCP-001' },
  { id: 'P002', description: 'Admission Fee',           amount: 2000, date: '2024-04-01', status: 'paid', receipt: 'RCP-002' },
  { id: 'P003', description: 'Annual Development Fund', amount: 1500, date: '2024-04-01', status: 'paid', receipt: 'RCP-003' },
];

export default function Fees() {
  const [paying, setPaying] = useState(null);
  const { notify } = useNotifications();

  const totalDue = outstandingFees.reduce((s, f) => s + f.amount, 0);

  const handlePayNow = (fee) => {
    setPaying(fee.id);
    // Simulate payment flow
    setTimeout(() => {
      setPaying(null);
      notify.success(`Payment of ${formatCurrency(fee.amount)} initiated! You will be redirected to payment gateway.`, 'Payment Initiated');
    }, 1200);
  };

  const handlePayAll = () => {
    setPaying('all');
    setTimeout(() => {
      setPaying(null);
      notify.success(`Payment of ${formatCurrency(totalDue)} initiated for all dues!`, 'Bulk Payment Initiated');
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl font-extrabold">Fee Portal</h1>
          <p className="text-green-200 text-sm">Class X · Roll No: STU-2024-042</p>
        </div>
        <div className="text-right">
          <p className="text-green-200 text-xs">Total Outstanding</p>
          <p className="text-3xl font-extrabold">{formatCurrency(totalDue)}</p>
        </div>
      </motion.div>

      {/* Outstanding Fees */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-green-800">💳 Outstanding Fees</h2>
          <button
            onClick={handlePayAll}
            disabled={paying === 'all'}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {paying === 'all' ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            Pay All ({formatCurrency(totalDue)})
          </button>
        </div>

        <div className="space-y-3">
          {outstandingFees.map((fee) => (
            <div key={fee.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{fee.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">Due: {fee.dueDate} · ID: {fee.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-red-700 text-sm">{formatCurrency(fee.amount)}</span>
                <button
                  onClick={() => handlePayNow(fee)}
                  disabled={paying === fee.id}
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  {paying === fee.id
                    ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : '💳 Pay Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Razorpay note */}
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          🔒 Payments are processed securely via Razorpay Payment Gateway
        </p>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
      >
        <h2 className="text-base font-bold text-green-800 mb-4">📜 Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-green-800 text-xs font-bold uppercase">
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Receipt</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.description}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs text-blue-600 hover:underline font-medium">📥 {p.receipt}</button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
