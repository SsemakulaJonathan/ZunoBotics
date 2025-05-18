"use client";

import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Mission from "@/components/mission";
import Timeline from "@/components/timeline";
import Tools from "@/components/tools";
import Projects from "@/components/projects";
import Fundraising from "@/components/fundraising";
import Partners from "@/components/partners";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Mission />
      <Timeline />
      <Tools />
      <Projects />
      <Fundraising />
      <Partners />
      <Footer />
    </main>
  );
}