import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const payGateDonationSchema = z.object({
  tx_ref: z.string(),
  transaction_id: z.string().optional(),
  payment_reference: z.string().optional(),
  amount: z.number().min(1),
  name: z.string(),
  email: z.union([z.string().email(), z.string().length(0), z.undefined()]).optional(),
  message: z.string().optional(),
  anonymous: z.boolean().optional(),
  donationType: z.enum(["one-time", "supporter", "innovator", "pioneer", "visionary"]),
  status: z.string().optional().default("completed")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received PayGate.to donation data:', body);

    const validatedData = payGateDonationSchema.parse(body);

    // Check if donation already exists to prevent duplicates
    const existingDonation = await prisma.donation.findFirst({
      where: {
        OR: [
          { paygateRef: validatedData.tx_ref },
          { paygateTransactionId: validatedData.transaction_id }
        ]
      }
    });

    if (existingDonation) {
      console.log('Donation already exists:', existingDonation.id);
      return NextResponse.json({
        success: true,
        message: 'Donation already recorded',
        donationId: existingDonation.id
      });
    }

    // Create new donation record
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,
        name: validatedData.name,
        email: validatedData.email || null,
        message: validatedData.message || null,
        anonymous: validatedData.anonymous || false,
        donationType: validatedData.donationType,
        status: 'completed',
        paymentProvider: 'paygate',
        paygateRef: validatedData.tx_ref,
        paygateTransactionId: validatedData.transaction_id || null,
        paygatePaymentReference: validatedData.payment_reference || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('PayGate.to donation created successfully:', donation.id);

    return NextResponse.json({
      success: true,
      message: 'Donation recorded successfully',
      donationId: donation.id,
      donation: {
        id: donation.id,
        amount: donation.amount,
        name: donation.name,
        donationType: donation.donationType,
        anonymous: donation.anonymous,
        createdAt: donation.createdAt
      }
    });

  } catch (error) {
    console.error('PayGate.to donation processing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid donation data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process donation' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get('tx_ref');
    const reference = searchParams.get('reference');

    // If specific transaction lookup
    if (txRef || reference) {
      // Look up donation by reference
      const donation = await prisma.donation.findFirst({
        where: {
          OR: [
            { paygateRef: txRef },
            { paygatePaymentReference: reference }
          ]
        },
        select: {
          id: true,
          amount: true,
          name: true,
          donationType: true,
          anonymous: true,
          status: true,
          createdAt: true,
          paygateRef: true,
          paygatePaymentReference: true
        }
      });

      if (!donation) {
        return NextResponse.json(
          { success: false, error: 'Donation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        donation
      });
    }

    // Otherwise return donation statistics
    const donations = await prisma.donation.findMany({
      where: {
        status: 'completed'
      },
      select: {
        id: true,
        amount: true,
        name: true,
        message: true,
        donationType: true,
        anonymous: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate total raised
    const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Get recent donations (last 10, non-anonymous)
    const recentDonations = donations
      .filter(donation => !donation.anonymous)
      .slice(0, 10)
      .map(donation => ({
        id: donation.id,
        name: donation.name,
        amount: donation.amount,
        message: donation.message,
        donationType: donation.donationType,
        createdAt: donation.createdAt.toISOString()
      }));

    return NextResponse.json({
      success: true,
      totalRaised,
      recentDonations,
      totalDonations: donations.length
    });

  } catch (error) {
    console.error('PayGate.to donation stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donation statistics' },
      { status: 500 }
    );
  }
}