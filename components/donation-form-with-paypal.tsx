// components/donation-form-with-paypal.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PayPalDonationButton from "./paypal-donation-button"
import PayPalProvider from "./paypal-provider"

interface DonationFormWithPayPalProps {
  donationType: "one-time" | "supporter" | "innovator" | "pioneer" | "visionary"
  defaultAmount?: number
}

export default function DonationFormWithPayPal({ donationType, defaultAmount = 50 }: DonationFormWithPayPalProps) {
  const [error, setError] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState(defaultAmount)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")

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
            min={10}
            max={500}
            step={5}
            value={[donationAmount]}
            onValueChange={handleDonationChange}
            className="my-6"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$10</span>
            <span>${donationAmount}</span>
            <span>$500</span>
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

      <div className="space-y-4">
        <Label className="text-foreground">Payment Method</Label>
        <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as "stripe" | "paypal")}>
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="stripe" className="text-foreground">Credit Card</TabsTrigger>
            <TabsTrigger value="paypal" className="text-foreground">PayPal</TabsTrigger>
          </TabsList>
          <TabsContent value="stripe" className="pt-4">
            <Button
              type="submit"
              className="w-full btn-elegant py-6 text-lg"
              formAction="/api/donations"
            >
              Donate ${donationAmount} <Heart className="ml-2 h-5 w-5" />
            </Button>
          </TabsContent>
          <TabsContent value="paypal" className="pt-4">
            <PayPalProvider>
              <PayPalDonationButton
                amount={donationAmount}
                donationType={donationType}
                name={name || "Anonymous"}
                email={email}
                message={message}
                anonymous={isAnonymous}
              />
            </PayPalProvider>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  )
}