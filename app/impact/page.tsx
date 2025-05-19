// app/impact/page.tsx
"use client"

import React from 'react'
import { Users, Code, School, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Impact from '@/components/Impact' // Assuming the Impact component is in a components directory

export default function ImpactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" fill="white" />
              <rect x="4" y="14" width="6" height="6" fill="white" />
              <rect x="14" y="4" width="6" height="6" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-xl">ZunoBotics</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="/about" className="text-gray-600 hover:text-blue-600">About</a>
          <a href="/projects" className="text-gray-600 hover:text-blue-600">Projects</a>
          <a href="/resources" className="text-gray-600 hover:text-blue-600">Resources</a>
          <a href="/support" className="text-gray-600 hover:text-blue-600">Support Us</a>
        </nav>
        
        <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Get Involved
        </Button>
      </header>

      {/* Impact Section */}
      <Impact />

      {/* Footer CTA */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the ZunoBotics Movement</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Be part of our mission to democratize robotics and automation innovation in Africa.
          </p>
          <Button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition flex items-center justify-center mx-auto"
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