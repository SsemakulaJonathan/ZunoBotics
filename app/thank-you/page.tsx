import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Suspense } from "react"
import PesapalVerification from "@/components/pesapal-verification"

export const metadata: Metadata = {
  title: "Thank You | ZunoBotics",
  description: "Thank you for your donation to ZunoBotics",
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const sessionId = params.session_id
  const orderID = params.orderID || params.orderId
  const txRef = params.tx_ref
  const reference = params.reference
  const trackingId = params.trackingId
  const provider = params.provider
  const hasError = params.error
  const verified = params.verified
  const isMock = params.mock === "true"
  const isDev = params.dev === "true"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {!isDev && (
        <Suspense fallback={<div>Loading...</div>}>
          <PesapalVerification 
            orderId={orderID as string}
            trackingId={trackingId as string}
          />
        </Suspense>
      )}
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold">Thank You for Your Support!</h1>
        <p className="mb-8 text-gray-600">
          Your donation will help us democratize robotics and automation technology across Africa.
          {provider === 'paypal' && !hasError && " PayPal will send a receipt to your email."}
          {provider === 'paygate' && !hasError && " PayGate.to will send a receipt to your email."}
          {provider === 'pesapal' && !hasError && " Pesapal will send a receipt to your email."}
          {!isMock && !provider && " We've sent a receipt to your email."}
        </p>
        
        {hasError === 'recording' && (
          <div className="mb-8 rounded-md bg-orange-50 p-4 text-sm text-orange-800">
            <p>
              <strong>Payment Successful:</strong> Your payment was processed successfully through {provider === 'paygate' ? 'PayGate.to' : provider === 'paypal' ? 'PayPal' : 'our payment provider'}, but there was an issue recording it in our system. 
              {orderID && ` Please save this Order ID for your records: ${orderID}`}
              {txRef && ` Please save this Transaction Reference for your records: ${txRef}`}
            </p>
          </div>
        )}
        
        {provider === 'paypal' && orderID && !hasError && (
          <div className="mb-8 rounded-md bg-green-50 p-4 text-sm text-green-800">
            <p>
              <strong>Payment Successful:</strong> Your PayPal donation has been processed.
              <br />Order ID: {orderID}
            </p>
          </div>
        )}
        
        {provider === 'paygate' && txRef && !hasError && (
          <div className="mb-8 rounded-md bg-green-50 p-4 text-sm text-green-800">
            <p>
              <strong>Payment Successful:</strong> Your PayGate.to donation has been processed.
              <br />Transaction Reference: {txRef}
              {verified === 'true' && <><br /><span className="text-green-600">✓ Payment verified and recorded</span></>}
              {verified === 'false' && <><br /><span className="text-orange-600">⚠ Payment verification pending</span></>}
            </p>
          </div>
        )}
        
        {provider === 'pesapal' && orderID && !hasError && (
          <div className="mb-8 rounded-md bg-green-50 p-4 text-sm text-green-800">
            <p>
              <strong>Payment Successful:</strong> Your Pesapal donation has been processed.
              {isDev && <><br /><span className="text-blue-600">(Development Mode)</span></>}
              <br />Order ID: {orderID}
              {trackingId && <><br />Tracking ID: {trackingId}</>}
            </p>
          </div>
        )}
        
        
        {isMock && (
          <div className="mb-8 rounded-md bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              <strong>Preview Mode:</strong> This is a simulated donation. In production, you would be redirected to
              Stripe for payment processing.
            </p>
          </div>
        )}
        <div className="space-y-4">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/">Return to Homepage</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/projects">Explore Projects</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
