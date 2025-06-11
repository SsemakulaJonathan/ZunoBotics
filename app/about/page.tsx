"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Mission from "@/components/mission";
import Impact from "@/components/impact"; // Directly import Impact component
import Partners from "@/components/partners"; // Directly import Partners component
import Timeline from "@/components/timeline"; // Directly import Timeline component

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Mission Section */}
      <Mission />

      {/* Impact Section */}
      <Impact />

      {/* Timeline Section */}
      <Timeline />

      {/* Partners Section */}
      <Partners />

      {/* Call-to-Action Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Be part of ZunoBotics by contributing as a student, mentor, or supporter. Help us build a future where
            African innovation thrives.
          </p>
          <Button
            asChild
            className="btn-elegant px-6 py-3 rounded-md flex items-center justify-center mx-auto"
          >
            <Link href="/support">
              Get Involved
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}