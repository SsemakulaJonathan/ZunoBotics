'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PesapalVerificationProps {
  orderId?: string;
  trackingId?: string;
  onVerificationComplete?: (status: 'success' | 'failed') => void;
}

export default function PesapalVerification({
  orderId,
  trackingId,
  onVerificationComplete,
}: PesapalVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | null>(null);
  const [donationDetails, setDonationDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId && trackingId) {
      verifyPayment();
    }
  }, [orderId, trackingId]);

  const verifyPayment = async () => {
    if (!orderId || !trackingId) return;

    setVerificationStatus('loading');

    try {
      const response = await fetch('/api/donations/pesapal/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OrderTrackingId: trackingId,
          OrderMerchantReference: orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      const status = data.status === 'completed' ? 'success' : 'failed';
      setVerificationStatus(status);

      if (status === 'success') {
        toast.success('Payment verified successfully!');
        
        localStorage.removeItem('pesapal_order_id');
        localStorage.removeItem('pesapal_tracking_id');
        localStorage.removeItem('pesapal_donation_id');
      } else {
        toast.error('Payment verification failed');
      }

      onVerificationComplete?.(status);

    } catch (error) {
      console.error('Pesapal verification error:', error);
      setVerificationStatus('failed');
      toast.error(error instanceof Error ? error.message : 'Verification failed');
      onVerificationComplete?.('failed');
    }
  };

  const handleRetryVerification = () => {
    verifyPayment();
  };

  if (!orderId || !trackingId) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Verification Error
          </CardTitle>
          <CardDescription>
            Missing payment information for verification
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {verificationStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
          {verificationStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {verificationStatus === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
          
          {verificationStatus === 'loading' && 'Verifying Payment...'}
          {verificationStatus === 'success' && 'Payment Successful!'}
          {verificationStatus === 'failed' && 'Payment Failed'}
        </CardTitle>
        <CardDescription>
          {verificationStatus === 'loading' && 'Please wait while we verify your payment with Pesapal...'}
          {verificationStatus === 'success' && 'Your donation has been processed successfully.'}
          {verificationStatus === 'failed' && 'We could not verify your payment. Please try again.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID:</span>
            <span className="font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tracking ID:</span>
            <span className="font-mono">{trackingId}</span>
          </div>
        </div>

        {verificationStatus === 'failed' && (
          <Button 
            onClick={handleRetryVerification}
            variant="outline"
            className="w-full"
          >
            Retry Verification
          </Button>
        )}

        {verificationStatus === 'success' && (
          <div className="text-center text-sm text-muted-foreground">
            Thank you for your generous donation to ZunoBotics!
          </div>
        )}
      </CardContent>
    </Card>
  );
}