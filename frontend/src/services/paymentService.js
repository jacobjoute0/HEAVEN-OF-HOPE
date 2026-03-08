import api from './api';

export async function initiatePayment(amount, studentId, description = 'School Fee') {
  const response = await api.post('/payments/initiate', { amount, studentId, description });
  return response.data;
}

export async function verifyPayment(orderId, paymentId, signature) {
  const response = await api.post('/payments/verify', { orderId, paymentId, signature });
  return response.data;
}

export async function getFeeHistory(studentId) {
  const response = await api.get(`/payments/history/${studentId}`);
  return response.data;
}

export async function getOutstandingFees(studentId) {
  const response = await api.get(`/payments/outstanding/${studentId}`);
  return response.data;
}

export async function downloadReceipt(paymentId) {
  const response = await api.get(`/payments/receipt/${paymentId}`, { responseType: 'blob' });
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `receipt-${paymentId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Mock Razorpay checkout opener (used when backend provides order_id)
export function openRazorpayCheckout({ orderId, amount, currency = 'INR', name, email, contact, onSuccess, onFailure }) {
  if (typeof window.Razorpay === 'undefined') {
    console.warn('Razorpay SDK not loaded');
    onFailure?.('Razorpay SDK not loaded');
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    amount: amount * 100,
    currency,
    name: 'Haven of Hope Academy',
    description: 'Fee Payment',
    order_id: orderId,
    prefill: { name, email, contact },
    theme: { color: '#16a34a' },
    handler: (response) => onSuccess?.(response),
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (resp) => onFailure?.(resp.error));
  rzp.open();
}
