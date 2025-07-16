import { NextRequest, NextResponse } from 'next/server';
import { createPesapalClient, generateOrderId, formatAmount } from '@/lib/pesapal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, name, email, message, anonymous, donationType } = body;

    if (!amount || !name || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount and name are required' },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();
    const formattedAmount = formatAmount(amount);

    const donation = await prisma.donation.create({
      data: {
        amount: formattedAmount,
        name,
        email,
        message,
        anonymous: anonymous || false,
        donationType: donationType || 'one-time',
        status: 'pending',
        paymentProvider: 'pesapal',
        pesapalOrderId: orderId,
      },
    });

    // Using live Pesapal credentials

    const pesapalClient = createPesapalClient();

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/donations/pesapal/callback`;
    
    let notificationId;
    
    // Check if we're in development mode
    if (process.env.PESAPAL_DEV_MODE === 'true') {
      // Development mode - simulate successful payment without Pesapal API
      const trackingId = `DEV-${Date.now()}`;
      
      await prisma.donation.update({
        where: { id: donation.id },
        data: { 
          pesapalTrackingId: trackingId,
          status: 'completed', // Mark as completed for dev mode
          paidAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        orderId,
        trackingId,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${orderId}&trackingId=${trackingId}&provider=pesapal&dev=true`,
        donationId: donation.id,
        devMode: true,
      });
    }
    
    // Production mode - use real Pesapal API
    // Try without notification_id first since IPN URL is pre-registered
    const orderRequest = {
      id: orderId,
      currency: 'USD',
      amount: formattedAmount,
      description: `Donation to ZunoBotics${message ? ` - ${message}` : ''}`,
      callback_url: callbackUrl,
      billing_address: {
        email_address: email || '',
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
      },
    };

    const orderResponse = await pesapalClient.submitOrder(orderRequest);

    if (orderResponse.error) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: 'failed' },
      });

      return NextResponse.json(
        { error: 'Failed to create payment', details: orderResponse.error },
        { status: 500 }
      );
    }

    await prisma.donation.update({
      where: { id: donation.id },
      data: { 
        pesapalTrackingId: orderResponse.order_tracking_id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      trackingId: orderResponse.order_tracking_id,
      redirectUrl: orderResponse.redirect_url,
      donationId: donation.id,
    });

  } catch (error) {
    console.error('Pesapal payment creation error:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}