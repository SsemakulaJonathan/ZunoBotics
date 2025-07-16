'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PesapalDonationButtonProps {
  amount: number;
  name: string;
  email?: string;
  message?: string;
  anonymous?: boolean;
  donationType?: string;
  className?: string;
  disabled?: boolean;
}

export default function PesapalDonationButton({
  amount,
  name,
  email,
  message,
  anonymous = false,
  donationType = 'one-time',
  className,
  disabled = false,
}: PesapalDonationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDonation = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/donations/pesapal/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          name,
          email,
          message,
          anonymous,
          donationType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      if (data.success && data.redirectUrl) {
        localStorage.setItem('pesapal_order_id', data.orderId);
        localStorage.setItem('pesapal_tracking_id', data.trackingId);
        localStorage.setItem('pesapal_donation_id', data.donationId);
        
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('Invalid response from payment service');
      }

    } catch (error) {
      console.error('Pesapal donation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process donation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDonation}
      disabled={disabled || isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Donate ${amount}
        </>
      )}
    </Button>
  );
}