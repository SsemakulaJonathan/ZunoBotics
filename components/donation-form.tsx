// components/donation-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import PesapalDonationButton from "./pesapal-donation-button"

interface DonationFormProps {
  donationType: "one-time" | "supporter" | "innovator" | "pioneer" | "visionary"
  defaultAmount?: number
}

export default function DonationForm({ donationType, defaultAmount = 50 }: DonationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState(defaultAmount)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"pesapal">("pesapal")

  // Get slider range based on donation type
  const getSliderRange = () => {
    switch (donationType) {
      case "supporter":
        return { min: 25, max: 499, step: 5 }
      case "innovator":
        return { min: 500, max: 2499, step: 25 }
      case "pioneer":
        return { min: 2500, max: 9999, step: 100 }
      case "visionary":
        return { min: 10000, max: 50000, step: 500 }
      default: // one-time
        return { min: 1, max: 500, step: 1 }
    }
  }

  const sliderRange = getSliderRange()

  const handleDonationChange = (value: number[]) => {
    setDonationAmount(value[0])
  }

  return (
    <form className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="amount" className="text-foreground">Donation Amount (USD)</Label>
        <div className="mt-2">
          <Slider
            id="amount"
            defaultValue={[defaultAmount]}
            min={sliderRange.min}
            max={sliderRange.max}
            step={sliderRange.step}
            value={[donationAmount]}
            onValueChange={handleDonationChange}
            className="my-6"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${sliderRange.min.toLocaleString()}</span>
            <span>${donationAmount.toLocaleString()}</span>
            <span>${sliderRange.max.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAnonymous}
            placeholder="Your name"
            className="mt-1 bg-background text-foreground border-input"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="mt-1 bg-background text-foreground border-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-foreground">Message (Optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share why you're supporting ZunoBotics..."
            className="mt-1 bg-background text-foreground border-input"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            className="border-input"
          />
          <Label htmlFor="anonymous" className="text-foreground">Make my donation anonymous</Label>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <PesapalDonationButton
          amount={donationAmount}
          donationType={donationType}
          name={name || "Anonymous"}
          email={email}
          message={message}
          anonymous={isAnonymous}
        />
      </div>
    </form>
  )
}