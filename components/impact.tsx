// components/impact.tsx
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
    <section className="bg-background py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Our Impact <span className="text-primary">So Far</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition"
            >
              <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                {metric.icon}
              </div>
              <h3 className="text-4xl font-bold text-primary mb-2">{metric.count}</h3>
              <h4 className="text-xl font-semibold text-foreground mb-2">{metric.label}</h4>
              <p className="text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}