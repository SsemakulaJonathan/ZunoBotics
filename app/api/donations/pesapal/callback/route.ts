import { NextRequest, NextResponse } from 'next/server';
import { createPesapalClient } from '@/lib/pesapal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference');

    if (!orderTrackingId || !merchantReference) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/donate?error=invalid_callback`
      );
    }

    const pesapalClient = createPesapalClient();
    const transactionStatus = await pesapalClient.getTransactionStatus(orderTrackingId);

    const donation = await prisma.donation.findFirst({
      where: {
        pesapalOrderId: merchantReference,
      },
    });

    if (!donation) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/donate?error=donation_not_found`
      );
    }

    const isSuccessful = transactionStatus.status_code === 1;

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: isSuccessful ? 'completed' : 'failed',
        pesapalTransactionId: transactionStatus.confirmation_code,
        pesapalTrackingId: orderTrackingId,
        paidAt: isSuccessful ? new Date() : null,
      },
    });

    const redirectUrl = isSuccessful 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${merchantReference}&trackingId=${orderTrackingId}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/donate?error=payment_failed`;

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Pesapal callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/donate?error=callback_error`
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference } = body;

    if (!OrderTrackingId || !OrderMerchantReference) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const pesapalClient = createPesapalClient();
    const transactionStatus = await pesapalClient.getTransactionStatus(OrderTrackingId);

    const donation = await prisma.donation.findFirst({
      where: {
        pesapalOrderId: OrderMerchantReference,
      },
    });

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    const isSuccessful = transactionStatus.status_code === 1;

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: isSuccessful ? 'completed' : 'failed',
        pesapalTransactionId: transactionStatus.confirmation_code,
        pesapalTrackingId: OrderTrackingId,
        paidAt: isSuccessful ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      status: isSuccessful ? 'completed' : 'failed',
      transactionId: transactionStatus.confirmation_code,
    });

  } catch (error) {
    console.error('Pesapal IPN error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}