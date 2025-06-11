// app/resources/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Tutorials from "@/components/tutorials";
import CommunityResources from "@/components/communityresources";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Tutorials Section */}
      {Tutorials ? <Tutorials /> : <div>Error: Tutorials component not found</div>}

      {/* Community Resources Section */}
      {CommunityResources ? (
        <CommunityResources />
      ) : (
        <div>Error: CommunityResources component not found</div>
      )}

      {/* Call-to-Action Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Innovating Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Leverage ZunoBotics' extensive resources to build your next robotics project. Join our community of innovators.
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