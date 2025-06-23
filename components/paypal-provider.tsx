"use client"

import type { ReactNode } from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

interface PayPalProviderProps {
  children: ReactNode
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  // Force production PayPal for real payments
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!

  console.log('PayPal Environment:', process.env.NODE_ENV)
  console.log('PayPal Client ID (first 10 chars):', clientId?.substring(0, 10))
  
  if (!clientId) {
    console.error('PayPal Client ID is missing! Check your environment variables.')
    return <div>PayPal configuration error - missing client ID</div>
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: "USD",
        intent: "capture",
        environment: 'production',
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}