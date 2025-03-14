import { useEffect, useRef } from "react";
import { createHeroAnimation, createStatsAnimation } from "@/lib/three-utils";

interface HeroAnimationProps {
  className?: string;
  height?: string;
}

export function HeroAnimation({ className = "", height = "h-80 md:h-96" }: HeroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create and start the animation
    const cleanup = createHeroAnimation({
      container: containerRef.current,
      colors: ['#0CFFE1', '#8A2BE2', '#FF1493', '#FFFFFF']
    });
    
    // Cleanup on unmount
    return cleanup;
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full ${height} relative animate-float ${className}`}
      aria-label="3D animation of geometric shapes"
    />
  );
}

interface StatsAnimationProps {
  className?: string;
  height?: string;
  data: { label: string; value: number }[];
}

export function StatsAnimation({ className = "", height = "h-64", data }: StatsAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create and start the animation
    const cleanup = createStatsAnimation(containerRef.current, data);
    
    // Cleanup on unmount
    return cleanup;
  }, [data]);
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full ${height} relative ${className}`}
      aria-label="3D animation of statistics"
    />
  );
}

interface GlowingOrbitProps {
  className?: string;
  size?: string;
  color?: string;
}

export function GlowingOrb({ 
  className = "", 
  size = "w-8 h-8", 
  color = "bg-gradient-to-br from-primary to-secondary" 
}: GlowingOrbitProps) {
  return (
    <div className={`${size} ${color} rounded-lg animate-glow ${className}`} />
  );
}

interface GridBackgroundProps {
  className?: string;
}

export function GridBackground({ className = "" }: GridBackgroundProps) {
  return (
    <div className={`grid-lines absolute inset-0 z-0 ${className}`} />
  );
}

export function GlassCard({
  children,
  className = "",
  hover = false,
  padding = "p-8"
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
}) {
  return (
    <div className={`glass ${padding} rounded-xl ${hover ? "hover:glow-border transition-all" : ""} ${className}`}>
      {children}
    </div>
  );
}
