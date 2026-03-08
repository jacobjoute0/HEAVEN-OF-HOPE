import crypto from 'crypto';

// Razorpay order creation stub
export async function initiateRazorpayOrder(amount, currency = 'INR', receipt = null) {
  // In production: use the official Razorpay SDK
  // const Razorpay = (await import('razorpay')).default;
  // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  // return razorpay.orders.create({ amount: amount * 100, currency, receipt: receipt || `order_${Date.now()}` });

  // Stub implementation for development
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('[PaymentService] Razorpay credentials not configured – using stub');
    return {
      id: `order_stub_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  try {
    const { default: Razorpay } = await import('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    return order;
  } catch (error) {
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
}

// Razorpay payment verification
export function verifyRazorpayPayment(orderId, paymentId, signature) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.warn('[PaymentService] RAZORPAY_KEY_SECRET not set – skipping verification in dev mode');
    return true;
  }

  // Validate that signature looks like a valid hex string before comparing
  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return false;
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

// Record payment in Firestore
export async function recordPayment(db, paymentData) {
  const record = {
    ...paymentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const docRef = await db.collection('payments').add(record);
  return { id: docRef.id, ...record };
}

// Get payment history for a student
export async function getPaymentHistory(db, studentId) {
  const snapshot = await db
    .collection('payments')
    .where('studentId', '==', studentId)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Generate receipt number
export function generateReceiptNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RCP-${y}${m}${d}-${rand}`;
}
