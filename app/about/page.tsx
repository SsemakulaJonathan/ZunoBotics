// app/about/page.tsx
"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Mission from '@/components/mission'
import Tools from '@/components/tools'
import Timeline from '@/components/timeline'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Mission />
      <Timeline />
      <section className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Be part of ZunoBotics by contributing as a student, mentor, or supporter. Help us build a future where
            African innovation thrives.
          </p>
          <Button
            asChild
            className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 transition flex items-center justify-center mx-auto"
          >
            <Link href="/support">
              Get Involved
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}