'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface PayGateDonationButtonProps {
  amount: number;
  donationType: string;
  name: string;
  email: string;
  message?: string;
  anonymous: boolean;
}

export default function PayGateDonationButton({
  amount,
  donationType,
  name,
  email,
  message,
  anonymous,
}: PayGateDonationButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // PayGate.to wallet address from environment
  const walletAddress = process.env.NEXT_PUBLIC_PAYGATE_WALLET_ADDRESS;

  const handlePayment = async () => {
    if (amount < 1 || !email.trim()) {
      toast({
        title: 'Invalid Details',
        description: 'Please enter a valid amount and email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: 'Configuration Error',
        description: 'Payment gateway not configured. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generate unique transaction reference
      const txRef = `donation-${Date.now()}`;
      
      // Store donation data for verification
      const donationData = {
        tx_ref: txRef,
        amount,
        name: anonymous ? 'Anonymous' : name,
        email: email.trim(),
        message: message?.trim() || '',
        anonymous,
        donationType,
        timestamp: new Date().toISOString(),
      };

      // Store in localStorage for later verification
      localStorage.setItem(`donation_${txRef}`, JSON.stringify(donationData));
      
      console.log('Initiating PayGate.to payment with data:', donationData);

      // PayGate.to payment creation
      const paymentResponse = await fetch('/api/donations/paygate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          description: `${donationType.charAt(0).toUpperCase() + donationType.slice(1)} Donation to ZunoBotics`,
          customer_email: email,
          customer_name: anonymous ? 'Anonymous Donor' : name,
          tx_ref: txRef,
          wallet_address: walletAddress,
          return_url: `${window.location.origin}/thank-you?provider=paygate&tx_ref=${txRef}`,
          metadata: {
            donation_type: donationType,
            anonymous: anonymous.toString(),
            message: message || '',
            platform: 'zunobotics'
          }
        }),
      });

      const result = await paymentResponse.json();
      console.log('PayGate.to payment creation response:', result);

      if (paymentResponse.ok && result.payment_url) {
        // Redirect to PayGate.to payment page
        window.location.href = result.payment_url;
      } else {
        throw new Error(result.error || 'Failed to create payment');
      }
      
    } catch (error) {
      console.error('Error creating PayGate.to payment:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handlePayment}
        disabled={isProcessing || amount < 1 || !email.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `Donate $${amount.toFixed(2)} with PayGate.to`
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Secure payment via PayGate.to • Supports cards, Apple Pay, Google Pay
      </p>
    </div>
  );
}