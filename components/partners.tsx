"use client";

import { useEffect, useRef, useState } from "react";

interface Partner {
  id: string;
  name: string;
  logo?: string;
  type: string;
  description?: string;
  website?: string;
  location?: string;
}

export default function Partners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        if (response.ok) {
          const data = await response.json();
          setPartners(data.partners || []);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
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
        setCurrentIndex((prev) => (prev + 1) % partners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, partners.length]);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Partners</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Partners</h2>
            <p className="text-lg text-muted-foreground">No partners available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Partners</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading universities, tech companies, and communities to empower African innovation in robotics and automation.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {partners.map((partner, index) => (
                <div key={partner.id} className="flex-shrink-0 w-full">
                  <div className="bg-card hover:bg-card/90 rounded-lg p-6 mx-4 shadow-md border border-border hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 w-24 h-24 flex justify-center items-center bg-background rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <img
                          src={partner.logo || "/images/partners/default.jpeg"}
                          alt={partner.name}
                          className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{partner.name}</h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                        {partner.type}
                      </span>
                      {partner.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {partner.description}
                        </p>
                      )}
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        >
                          Visit Website →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {partners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? "bg-primary" : "bg-muted hover:bg-muted-foreground"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to partner ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div
          className={`mt-12 flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-foreground">University Partners</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-foreground">Corporate Partners</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-foreground">NGO Partners</span>
          </div>
        </div>
      </div>
    </section>
  );
}
