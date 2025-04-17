// app/api/donations/paypal/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSql, generateId } from '@/lib/db';

// PayPal donation schema
const paypalDonationSchema = z.object({
  orderID: z.string(),
  paypalTransactionID: z.string(),
  amount: z.number().min(1),
  name: z.string().min(1),
  email: z.string().email().optional(),
  message: z.string().optional(),
  anonymous: z.boolean(),
  donationType: z.enum(['one-time', 'supporter', 'innovator', 'pioneer', 'visionary']),
});

// Validate required environment variables
function validateEnv() {
  const required = [
    'DATABASE_URL',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_SECRET',
    'NEXT_PUBLIC_APP_URL',
  ];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing environment variable: ${key}`);
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
  // Debug: Log Client IDs to ensure they match
  console.log('PayPal Client IDs:', {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  });
}

// Get PayPal access token for verification
async function getPayPalAccessToken() {
  try {
    const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get PayPal access token:', response.status, errorText);
      throw new Error(`Failed to get PayPal access token: ${response.status}`);
    }
    const { access_token } = await response.json();
    return access_token;
  } catch (error) {
    console.error('getPayPalAccessToken error:', error);
    throw error;
  }
}

// Verify PayPal order
async function verifyPayPalOrder(orderID: string) {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to verify PayPal order:', response.status, errorText);
      throw new Error(`Failed to verify PayPal order: ${response.status}`);
    }
    const order = await response.json();
    console.log('PayPal order verified:', { orderID, status: order.status });
    return order.status === 'COMPLETED';
  } catch (error) {
    console.error('verifyPayPalOrder error:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    // Validate environment variables in production
    if (process.env.NODE_ENV === 'production') {
      validateEnv();
    }

    // Get database client
    const sql = getSql();
    if (!sql) {
      console.error('Database not available');
      return NextResponse.json({ error: 'Database not available in this environment' }, { status: 503 });
    }

    const body = await req.json();
    const data = paypalDonationSchema.parse(body);
    const { orderID, paypalTransactionID, amount, name, email, message, anonymous, donationType } = data;

    // Verify PayPal order
    if (!(await verifyPayPalOrder(orderID))) {
      console.error('Invalid PayPal order:', { orderID });
      return NextResponse.json({ error: 'Invalid PayPal order' }, { status: 400 });
    }

    // Generate unique ID
    const id = generateId();

    // Store donation
    await sql`
      INSERT INTO donations (
        id, amount, name, email, message, anonymous, donation_type, status, 
        paypal_transaction_id, paid_at, created_at, updated_at
      )
      VALUES (
        ${id}, ${amount}, ${name}, ${email || null}, ${message || null}, 
        ${anonymous}, ${donationType}, 'completed', 
        ${paypalTransactionID}, NOW(), NOW(), NOW()
      )
    `;
    console.log('Donation recorded:', { id, amount, donationType });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayPal donation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
  }
}