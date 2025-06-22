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
            <a 
              href="https://wa.me/256785330180?text=Hello%20ZunoBotics!%20I'm%20interested%20in%20supporting%20your%20mission%20to%20empower%20African%20innovators%20through%20robotics.%20I'd%20love%20to%20discuss%20how%20I%20can%20contribute%20to%20your%20programs."
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
              <ArrowRight size={20} className="ml-2" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
