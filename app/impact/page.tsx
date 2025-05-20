// app/impact/page.tsx
"use client"

import React from 'react'
import { Users, Code, School, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Impact from '@/components/impact'
import Navbar from '@/components/navbar'

export default function ImpactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Impact />
      <footer className="bg-muted py-12">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the ZunoBotics Movement</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Be part of our mission to democratize robotics and automation innovation in Africa.
          </p>
          <Button
            className="btn-elegant px-6 py-3 rounded-md flex items-center justify-center mx-auto"
            asChild
          >
            <a href="/projects">
              Explore Projects
              <ArrowRight size={20} className="ml-2" />
            </a>
          </Button>
        </div>
      </footer>
    </div>
  )
}