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
        disabled={isProcessing || amount < 1 || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
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
            const details = await actions.order!.capture();
            console.log('PayPal order captured:', { orderID: data.orderID, transactionID: details.id });
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

            const response = await fetch('/api/donations/paypal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(donationData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Failed to record donation:', errorData);
              throw new Error(errorData.error || 'Failed to record donation');
            }

            console.log('Donation recorded successfully:', donationData);
            router.push('/thank-you?provider=paypal');
          } catch (error) {
            console.error('PayPal donation error:', error);
            toast({
              title: 'Error',
              description: 'Failed to process donation. Please try again.',
              variant: 'destructive',
            });
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