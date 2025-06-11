"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Repositories from "@/components/repositories";

export default function RepositoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Repositories Section */}
      <main className="flex-grow">
        <Repositories />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}