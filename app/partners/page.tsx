// app/partners/page.tsx
"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Partners from '@/components/partners'

export default function PartnersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Partners />
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Become a Partner</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join ZunoBotics to support African innovation in robotics. Partner with us to provide resources, mentorship, or funding.
          </p>
          <Button
            asChild
            className="btn-elegant px-6 py-3 rounded-md flex items-center justify-center mx-auto"
          >
            <Link href="/support">
              Contact Us
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}