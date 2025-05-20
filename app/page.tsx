// app/page.tsx
"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Impact from '@/components/impact'
import Projects from '@/components/projects'
import Mission from '@/components/mission'
import Fundraising from '@/components/fundraising'
import Footer from '@/components/footer'

// Lazy-load non-critical components
const Timeline = dynamic(() => import('@/components/timeline'), { ssr: false })
const Tools = dynamic(() => import('@/components/tools'), { ssr: false })
const Partners = dynamic(() => import('@/components/partners'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Impact />
      <Projects />
      <Mission />
      <Timeline />
      <Tools />
      <Fundraising />
      <Partners />
      <Footer />
    </main>
  )
}