// app/donate/page.tsx
"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Fundraising from '@/components/fundraising'

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Fundraising />
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Support Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Help us empower the next generation of African innovators through robotics and technology education.
          </p>
          <Button
            asChild
            className="btn-elegant px-6 py-3 rounded-md flex items-center justify-center mx-auto"
          >
            <Link href="/contact">
              Contact Us
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
