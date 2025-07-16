import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Return donation statistics for all payment providers
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
        paymentProvider: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate total raised from all payment providers
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
        paymentProvider: donation.paymentProvider,
        createdAt: donation.createdAt.toISOString()
      }));

    return NextResponse.json({
      success: true,
      totalRaised,
      recentDonations,
      totalDonations: donations.length,
      donationsByProvider: {
        paygate: donations.filter(d => d.paymentProvider === 'paygate').length,
        pesapal: donations.filter(d => d.paymentProvider === 'pesapal').length,
        paypal: donations.filter(d => d.paymentProvider === 'paypal').length,
      }
    });

  } catch (error) {
    console.error('Donation stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donation statistics' },
      { status: 500 }
    );
  }
}