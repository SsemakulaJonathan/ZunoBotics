"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Tools from "@/components/tools"; // Direct import without lazy-loading
import Footer from "@/components/footer";

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Tools Section */}
      <section id="tools">
        <Tools />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}