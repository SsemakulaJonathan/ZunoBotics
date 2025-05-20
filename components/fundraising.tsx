// components/fundraising.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Building, GraduationCap, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DonationFormWithPayPal from "@/components/donation-form-with-paypal"
import FundraisingStats from "@/components/fundraising-stats"

export default function Fundraising() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Fundraising goal
  const goal = 100000

  const donationTiers = [
    {
      name: "Supporter",
      range: "$25 - $499",
      description: "Help us provide basic components and tools for student projects.",
      benefits: ["Recognition on our website", "Project updates newsletter"],
    },
    {
      name: "Innovator",
      range: "$500 - $2,499",
      description: "Fund a complete student project from concept to prototype.",
      benefits: ["All Supporter benefits", "Annual impact report", "Invitation to virtual showcase events"],
    },
    {
      name: "Pioneer",
      range: "$2,500 - $9,999",
      description: "Help us expand to a new university or technical institute.",
      benefits: [
        "All Innovator benefits",
        "Named recognition on funded projects",
        "Exclusive behind-the-scenes updates",
      ],
    },
    {
      name: "Visionary",
      range: "$10,000+",
      description: "Establish a fully equipped innovation lab at a partner university.",
      benefits: [
        "All Pioneer benefits",
        "Naming opportunity for lab space",
        "Annual in-person visit and demonstration",
        "Strategic advisory role",
      ],
    },
  ]

  const supportOptions = [
    {
      title: "Corporate Sponsorship",
      description: "Become a corporate partner with brand visibility and talent nurturing opportunities.",
      icon: <Building className="h-6 w-6 text-primary" />,
      badge: "Enterprise",
      contact: "partnerships@zunobotics.org",
    },
    {
      title: "Educational Partnership",
      description: "Partner with us as an educational institution to expand our reach.",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      badge: "Education",
      contact: "education@zunobotics.org",
    },
    {
      title: "Volunteer",
      description: "Share your skills and time to help us grow our community.",
      icon: <Users className="h-6 w-6 text-primary" />,
      badge: "Community",
      contact: "volunteer@zunobotics.org",
    },
  ]

  return (
    <section id="support" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-muted text-muted-foreground">Support Our Work</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Support Our Mission</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us democratize innovation across Africa. Your contribution powers our labs, provides components to
            students, and helps us expand to new universities.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto mb-16">
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-muted p-1 rounded-full">
              <TabsTrigger
                value="donate"
                className="rounded-full py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                One-time Donation
              </TabsTrigger>
              <TabsTrigger
                value="tiers"
                className="rounded-full py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Donation Tiers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donate">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card border-border">
                  <CardContent className="pt-8 pb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6">Donate</h3>
                    <DonationFormWithPayPal donationType="one-time" defaultAmount={50} />
                  </CardContent>
                </Card>

                <div>
                  <FundraisingStats goal={goal} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tiers">
              <div className="grid md:grid-cols-2 gap-6">
                {donationTiers.map((tier, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                        <Badge className="bg-primary hover:bg-primary/80 text-primary-foreground">{tier.range}</Badge>
                      </div>
                      <p className="text.ncbi-foreground mb-4">{tier.description}</p>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-primary">Benefits:</h4>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="text-muted-foreground text-sm flex items-start">
                              <span className="text-primary mr-2">•</span> {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-6">
                      <Button
                        className="w-full btn-elegant"
                        onClick={() => (window.location.href = `/donate/${tier.name.toLowerCase()}`)}
                      >
                        Donate as {tier.name} <Heart className="ml-2 h-5 w-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <h3 className="text-3xl font-bold text-foreground mb-8">Other Ways to Support</h3>

        <div className="grid md:grid-cols-3 gap-8">
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
            >
              <Card className="bg-card border-border h-full flex flex-col">
                <CardContent className="pt-8 pb-4 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="rounded-full bg-muted p-4 w-16 h-16 flex items-center justify-center">
                      {option.icon}
                    </div>
                    <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">{option.badge}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{option.title}</h3>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-6 flex flex-col space-y-3">
                  <Button className="w-full btn-elegant flex items-center justify-center gap-2">
                    Contact: {option.contact}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}