// components/PayPalDonationButton.tsx
'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface PayPalDonationButtonProps {
  amount: number;
  donationType: string;
  name: string;
  email: string;
  message?: string;
  anonymous: boolean;
}

export default function PayPalDonationButton({
  amount,
  donationType,
  name,
  email,
  message,
  anonymous,
}: PayPalDonationButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
        disabled={isProcessing || amount < 1 || !email.trim()}
        forceReRender={[amount, donationType, name, email, message, anonymous]}
        createOrder={(data, actions) => {
          console.log('Creating PayPal order:', { amount, donationType });
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                  currency_code: 'USD',
                },
                description: `${donationType.charAt(0).toUpperCase() + donationType.slice(1)} Donation to ZunoBotics`,
              },
            ],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
            },
          });
        }}
        onApprove={async (data, actions) => {
          setIsProcessing(true);
          try {
            console.log('PayPal order approved, capturing...', { orderID: data.orderID });
            const details = await actions.order!.capture();
            console.log('PayPal order captured successfully:', { 
              orderID: data.orderID, 
              transactionID: details.id,
              status: details.status,
              amount: details.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value 
            });

            const donationData = {
              orderID: data.orderID,
              paypalTransactionID: details.id,
              amount,
              name: anonymous ? 'Anonymous' : name,
              email: email.trim() || undefined,
              message: message?.trim() || undefined,
              anonymous,
              donationType,
            };

            console.log('Sending donation data to API:', donationData);

            const response = await fetch('/api/donations/paypal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(donationData),
            });

            const responseData = await response.json();
            console.log('API response:', { status: response.status, data: responseData });

            if (!response.ok) {
              console.error('API returned error:', responseData);
              throw new Error(responseData.error || 'Failed to record donation');
            }

            console.log('Donation recorded successfully, redirecting to thank you page');
            router.push(`/thank-you?provider=paypal&orderID=${data.orderID}`);
          } catch (error) {
            console.error('PayPal donation processing error:', error);
            toast({
              title: 'Payment Processing Error',
              description: `Your payment was processed but we couldn't record it. Please contact support with order ID: ${data.orderID}`,
              variant: 'destructive',
            });
            // Still redirect to thank you page since payment went through
            router.push(`/thank-you?provider=paypal&orderID=${data.orderID}&error=recording`);
          } finally {
            setIsProcessing(false);
          }
        }}
        onError={(err) => {
          console.error('PayPal SDK error:', err);
          toast({
            title: 'PayPal Error',
            description: 'An error occurred with PayPal. Please try again later.',
            variant: 'destructive',
          });
          setIsProcessing(false);
        }}
      />
    </div>
  );
}