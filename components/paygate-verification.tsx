'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PayGateVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const provider = searchParams.get('provider');
    const txRef = searchParams.get('tx_ref');
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transaction_id');
    const reference = searchParams.get('reference');

    // Only verify if this is a PayGate redirect and payment was successful
    if (provider === 'paygate' && txRef && !isVerifying) {
      verifyPayment(txRef, transactionId, reference, status);
    }
  }, [searchParams, isVerifying]);

  const verifyPayment = async (
    txRef: string, 
    transactionId?: string | null, 
    reference?: string | null,
    status?: string | null
  ) => {
    setIsVerifying(true);
    
    try {
      console.log('Verifying PayGate.to payment:', { txRef, transactionId, reference, status });
      
      // Get stored donation data from localStorage
      const storedDonationData = localStorage.getItem(`donation_${txRef}`);
      let donationData = null;
      
      if (storedDonationData) {
        donationData = JSON.parse(storedDonationData);
        console.log('Retrieved donation data from localStorage:', donationData);
      }

      // If status is successful, proceed with verification
      if (status === 'successful' || status === 'completed' || status === 'success') {
        const verificationData = {
          tx_ref: txRef,
          transaction_id: transactionId,
          payment_reference: reference,
          amount: donationData?.amount || 0,
          name: donationData?.name || 'Anonymous',
          email: donationData?.email || '',
          message: donationData?.message || '',
          anonymous: donationData?.anonymous || false,
          donationType: donationData?.donationType || 'one-time',
          status: 'completed'
        };

        console.log('Sending verification data to API:', verificationData);

        const response = await fetch('/api/donations/paygate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verificationData),
        });

        const result = await response.json();
        console.log('Verification result:', result);

        // Clean up localStorage
        if (storedDonationData) {
          localStorage.removeItem(`donation_${txRef}`);
        }

        // Update URL to include verification status
        const currentUrl = new URL(window.location.href);
        if (result.success) {
          currentUrl.searchParams.set('verified', 'true');
          if (result.donationId) {
            currentUrl.searchParams.set('donation_id', result.donationId);
          }
        } else {
          currentUrl.searchParams.set('verified', 'false');
          currentUrl.searchParams.set('error', 'verification_failed');
        }
        
        // Replace the current URL without triggering a reload
        window.history.replaceState({}, '', currentUrl.toString());
        
      } else if (status === 'cancelled' || status === 'canceled') {
        console.log('Payment was cancelled by user');
        // Redirect back to donation page
        router.push('/donate');
        
      } else {
        console.log('Payment failed or status unknown:', status);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('verified', 'false');
        currentUrl.searchParams.set('error', 'payment_failed');
        window.history.replaceState({}, '', currentUrl.toString());
      }
      
    } catch (error) {
      console.error('Error verifying PayGate.to payment:', error);
      
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('verified', 'false');
      currentUrl.searchParams.set('error', 'verification_failed');
      window.history.replaceState({}, '', currentUrl.toString());
      
    } finally {
      setIsVerifying(false);
    }
  };

  // This component doesn't render anything, it just handles verification
  return null;
}