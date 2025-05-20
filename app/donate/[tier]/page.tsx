// app/donate/[tier]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DonationForm from "@/components/donation-form-with-paypal"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Donate | ZunoBotics",
  description: "Support ZunoBotics and help democratize robotics in Africa",
}

interface DonatePageProps {
  params: {
    tier: string
  }
}

export default function DonatePage({ params }: DonatePageProps) {
  const tier = params.tier

  const tiers = {
    supporter: {
      name: "Supporter",
      description: "Help us provide basic components and tools for student projects.",
      defaultAmount: 100,
    },
    innovator: {
      name: "Innovator",
      description: "Fund a complete student project from concept to prototype.",
      defaultAmount: 1000,
    },
    pioneer: {
      name: "Pioneer",
      description: "Help us expand to a new university or technical institute.",
      defaultAmount: 5000,
    },
    visionary: {
      name: "Visionary",
      description: "Establish a fully equipped innovation lab at a partner university.",
      defaultAmount: 10000,
    },
  }

  if (!Object.keys(tiers).includes(tier)) {
    notFound()
  }

  const selectedTier = tiers[tier as keyof typeof tiers]

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="section-header">
            <h1 className="text-3xl md:text-4xl">{`Donate as a ${selectedTier.name}`}</h1>
            <p className="text-muted-foreground">{selectedTier.description}</p>
          </div>

          <Card className="card-premium">
            <CardContent className="pt-6">
              <DonationForm
                donationType={tier as "supporter" | "innovator" | "pioneer" | "visionary"}
                defaultAmount={selectedTier.defaultAmount}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}