// components/impact.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Users, Code, School, Globe, Activity, Target, Award, TrendingUp } from 'lucide-react';

interface ImpactMetric {
  id: string;
  icon: string;
  count: string;
  label: string;
  description: string;
  order: number;
}

export default function Impact() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/impact-metrics');
        if (response.ok) {
          const data = await response.json();
          setImpactMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users size={24} />;
      case 'code': return <Code size={24} />;
      case 'school': return <School size={24} />;
      case 'globe': return <Globe size={24} />;
      case 'activity': return <Activity size={24} />;
      case 'target': return <Target size={24} />;
      case 'award': return <Award size={24} />;
      case 'trending-up': return <TrendingUp size={24} />;
      default: return <Users size={24} />;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % impactMetrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, impactMetrics.length]);

  if (loading) {
    return (
      <section ref={sectionRef} className="bg-background py-16">
        <div className="container">
          <h2 className={`text-3xl font-bold text-center mb-12 text-foreground transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Our Impact <span className="text-primary">So Far</span>
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (impactMetrics.length === 0) {
    return (
      <section ref={sectionRef} className="bg-background py-16">
        <div className="container">
          <h2 className={`text-3xl font-bold text-center mb-12 text-foreground transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Our Impact <span className="text-primary">So Far</span>
          </h2>
          <p className="text-center text-muted-foreground">No impact metrics available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="bg-background py-16 overflow-hidden">
      <div className="container">
        <h2 className={`text-3xl font-bold text-center mb-12 text-foreground transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Our Impact <span className="text-primary">So Far</span>
        </h2>
        <div className="relative max-w-6xl mx-auto">
          {/* Mobile Slider */}
          <div className="md:hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {impactMetrics.map((metric, index) => (
                  <div
                    key={metric.id}
                    className="flex-shrink-0 w-full px-4"
                  >
                    <div
                      className={`bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-all duration-1000 transform ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                        {getIconComponent(metric.icon)}
                      </div>
                      <h3 className="text-4xl font-bold text-primary mb-2">{metric.count}</h3>
                      <h4 className="text-xl font-semibold text-foreground mb-2">{metric.label}</h4>
                      <p className="text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {impactMetrics.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <div
                key={metric.id}
                className={`bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-all duration-1000 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                  {getIconComponent(metric.icon)}
                </div>
                <h3 className="text-4xl font-bold text-primary mb-2">{metric.count}</h3>
                <h4 className="text-xl font-semibold text-foreground mb-2">{metric.label}</h4>
                <p className="text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
