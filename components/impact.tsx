"use client"

import React from 'react'
import { Users, Code, School, Globe } from 'lucide-react'

export default function Impact() {
  const impactMetrics = [
    {
      icon: <Users size={24} />,
      count: '150+',
      label: 'Students Supported',
      description: 'Across multiple universities in Uganda'
    },
    {
      icon: <Code size={24} />,
      count: '42',
      label: 'Open-Source Projects',
      description: 'Solving real community challenges'
    },
    {
      icon: <School size={24} />,
      count: '5',
      label: 'University Partners',
      description: 'Growing network of academic institutions'
    },
    {
      icon: <Globe size={24} />,
      count: '12',
      label: 'Communities Impacted',
      description: 'Direct benefits to local populations'
    }
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Impact <span className="text-blue-600">So Far</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 mb-4">
                {metric.icon}
              </div>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">{metric.count}</h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{metric.label}</h4>
              <p className="text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}