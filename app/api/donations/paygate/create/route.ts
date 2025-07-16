import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const payGatePaymentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default('USD'),
  description: z.string(),
  customer_email: z.string().email(),
  customer_name: z.string(),
  tx_ref: z.string(),
  wallet_address: z.string(),
  return_url: z.string().url(),
  metadata: z.object({
    donation_type: z.string(),
    anonymous: z.string(),
    message: z.string().optional(),
    platform: z.string()
  })
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = payGatePaymentSchema.parse(body);

    console.log('Creating PayGate.to payment:', validatedData);

    // PayGate.to payment creation
    // Based on research, PayGate.to uses a simple payment link generation approach
    // Since they mention "no API keys" and Postman documentation, 
    // we'll create a payment URL following their pattern
    
    const paymentData = {
      amount: validatedData.amount,
      currency: validatedData.currency,
      description: validatedData.description,
      customer_email: validatedData.customer_email,
      customer_name: validatedData.customer_name,
      reference: validatedData.tx_ref,
      wallet_address: validatedData.wallet_address,
      return_url: validatedData.return_url,
      cancel_url: `${new URL(validatedData.return_url).origin}/donate`,
      metadata: validatedData.metadata
    };

    // For now, we'll create a basic payment URL structure
    // In a real implementation, you would call PayGate.to's API
    // Since PayGate.to mentions no API keys and instant approval,
    // the actual implementation might be simpler
    
    // This is a placeholder implementation that would need to be
    // replaced with actual PayGate.to API integration
    const paymentUrl = `https://paygate.to/pay?` + new URLSearchParams({
      amount: validatedData.amount.toString(),
      currency: validatedData.currency,
      reference: validatedData.tx_ref,
      email: validatedData.customer_email,
      name: validatedData.customer_name,
      description: validatedData.description,
      wallet: validatedData.wallet_address,
      return_url: validatedData.return_url
    }).toString();

    console.log('Generated PayGate.to payment URL:', paymentUrl);

    return NextResponse.json({
      success: true,
      payment_url: paymentUrl,
      reference: validatedData.tx_ref,
      message: 'Payment URL created successfully'
    });

  } catch (error) {
    console.error('PayGate.to payment creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment' 
      },
      { status: 500 }
    );
  }
}