// app/about/page.tsx
"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Mission from '@/components/mission'
import Logo from '@/components/logo'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Mission />
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
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <div className="bg-blue-600 rounded-lg p-2 flex items-center justify-center">
                  <Logo className="h-8 w-8" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">ZunoBotics</span>
              </Link>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <Link href="/about" className="hover:text-blue-600">About</Link>
              <Link href="/impact" className="hover:text-blue-600">Impact</Link>
              <Link href="/projects" className="hover:text-blue-600">Projects</Link>
              <Link href="/resources" className="hover:text-blue-600">Resources</Link>
              <Link href="/support" className="hover:text-blue-600">Support Us</Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © 2025 ZunoBotics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}