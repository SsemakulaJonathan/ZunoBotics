// app/page.tsx
"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Impact from "@/components/impact";
import Projects from "@/components/projects";
import Mission from "@/components/mission";
import Timeline from "@/components/timeline"; // Removed lazy loading for Timeline
import Tools from "@/components/tools"; // Removed lazy loading for Tools
import Partners from "@/components/partners"; // Removed lazy loading for Partners
import Fundraising from "@/components/fundraising";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Impact Section */}
      <Impact />

      {/* Projects Section */}
      <Projects />

      {/* Mission Section */}
      <Mission />

      {/* Timeline Section */}
      <Timeline />

      {/* Tools Section */}
      <Tools />

      {/* Fundraising Section */}
      <Fundraising />

      {/* Partners Section */}
      <Partners />

      {/* Footer */}
      <Footer />
    </main>
  );
}