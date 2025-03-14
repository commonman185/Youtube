
import { Link, useLocation } from "wouter";
import { GlowingOrb } from "@/components/ui/3d-animation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Get current user from query cache
  const { data: user } = useQuery<User | null>({
    queryKey: ['/api/auth/current'],
    queryFn: () => null, // This is a placeholder, in a real app we'd check the session
    initialData: null
  });
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleLogout = () => {
    // Clear user data from cache
    queryClient.setQueryData(['/api/auth/current'], null);
    closeMenu();
  };
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Content Tools", path: "/content-suggestions" },
    { name: "Optimization", path: "/optimization-tips" },
    { name: "Engagement", path: "/engagement-strategies" },
    { name: "AI Tools", path: "/ai-comment-assistant" }
  ];
  
  return (
    <nav className="fixed w-full top-0 z-50 glass">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <GlowingOrb className="mr-2" />
              <span className="font-orbitron text-2xl font-bold text-gradient">NextLevelYT</span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={cn(
                "hover:text-primary transition-colors",
                location === link.path && "text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-primary bg-opacity-20 hover:bg-opacity-30 text-primary">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="bg-primary bg-opacity-20 hover:bg-opacity-30 text-primary"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                onClick={() => {
                  window.location.href = "/signup";
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
        
        <button className="md:hidden text-2xl" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass py-4 px-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={cn(
                  "hover:text-primary transition-colors",
                  location === link.path && "text-primary"
                )}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Button
                  className="bg-primary bg-opacity-20 hover:bg-opacity-30 text-primary"
                  onClick={() => {
                    window.location.href = "/dashboard";
                    closeMenu();
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 py-2 px-4 rounded-lg text-center"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-primary bg-opacity-20 hover:bg-opacity-30 text-primary"
                  onClick={() => {
                    window.location.href = "/login";
                    closeMenu();
                  }}
                >
                  Login
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={() => {
                    window.location.href = "/signup";
                    closeMenu();
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
