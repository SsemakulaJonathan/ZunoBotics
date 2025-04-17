// components/PayPalProvider.tsx
'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface PayPalProviderProps {
  children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error('PayPal Client ID is missing. Check NEXT_PUBLIC_PAYPAL_CLIENT_ID in environment variables.');
    return <div>Error: PayPal configuration missing. Please try again later.</div>;
  }

  console.log('PayPal SDK initializing with Client ID:', clientId);

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}