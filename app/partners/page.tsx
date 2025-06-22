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
            <a 
              href="mailto:zunobotics@gmail.com?subject=Partnership%20Opportunity%20with%20ZunoBotics&body=Hello%20ZunoBotics%20team,%0D%0A%0D%0AI'm%20interested%20in%20exploring%20partnership%20opportunities%20with%20ZunoBotics.%20Our%20organization%20would%20like%20to%20support%20African%20innovation%20in%20robotics%20and%20automation.%0D%0A%0D%0APlease%20let%20me%20know%20how%20we%20can%20collaborate.%0D%0A%0D%0ABest%20regards"
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