"use client"

import type { ReactNode } from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

interface PayPalProviderProps {
  children: ReactNode
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}