import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { GridBackground } from "@/components/ui/3d-animation";

interface BaseLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showGridBackground?: boolean;
}

export default function BaseLayout({
  children,
  showFooter = true,
  showGridBackground = true
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-[#121212] text-[#F8F9FA] font-inter">
      <Navbar />
      
      <main className="relative overflow-hidden pt-[72px]">
        {showGridBackground && <GridBackground />}
        <div className="relative z-10">
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
