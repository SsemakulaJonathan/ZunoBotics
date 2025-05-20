// components/fundraising-stats.tsx
"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Donation {
  id: string
  name: string
  amount: number
  message?: string
  donationType: string
  createdAt: string
}

interface FundraisingStatsProps {
  goal?: number
}

export default function FundraisingStats({ goal = 100000 }: FundraisingStatsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRaised, setTotalRaised] = useState(0)
  const [recentDonations, setRecentDonations] = useState<Donation[]>([])

  useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/donations")

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        setTotalRaised(data.totalRaised)
        setRecentDonations(data.recentDonations)
      } catch (error) {
        console.error("Failed to fetch donation stats:", error)
        setError("Unable to load donation statistics. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonationStats()
  }, [])

  const progressPercentage = (totalRaised / goal) * 100

  // Function to format currency with commas
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
        <div className="h-20 w-full animate-pulse rounded bg-muted"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between mb-2">
          <span className="text-lg font-medium text-foreground">{formatCurrency(totalRaised)} raised</span>
          <span className="text-lg font-medium text-foreground">{formatCurrency(goal)} goal</span>
        </div>
        <Progress value={progressPercentage} className="h-3 bg-muted" indicatorClassName="bg-primary" />
        <p className="text-muted-foreground text-sm">{progressPercentage.toFixed(0)}% of our goal reached</p>
      </div>

      {recentDonations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Recent Supporters</h3>
          <div className="space-y-3">
            {recentDonations.map((donation) => (
              <Card key={donation.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{donation.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                      </p>
                      {donation.message && <p className="text-sm mt-1 italic text-muted-foreground">"{donation.message}"</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(donation.amount)}</p>
                      <p className="text-xs text-primary">{donation.donationType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}