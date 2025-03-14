import { Link } from "wouter";
import { GlowingOrb } from "@/components/ui/3d-animation";

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-dark bg-opacity-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-10">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-6">
              <GlowingOrb className="mr-2" />
              <span className="font-orbitron text-2xl font-bold text-gradient">NextLevelYT AI</span>
            </div>
            <p className="text-gray-400 max-w-xs mb-6">
              The ultimate platform for YouTube creators to grow their channels with AI-powered tools and analytics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-orbitron font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a className="hover:text-primary transition-colors">Features</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Pricing</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Testimonials</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">FAQ</a></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-orbitron font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a className="hover:text-primary transition-colors">Blog</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Tutorials</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Support</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Documentation</a></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-orbitron font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a className="hover:text-primary transition-colors">About Us</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Careers</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Privacy Policy</a></Link></li>
                <li><Link href="/"><a className="hover:text-primary transition-colors">Terms of Service</a></Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} NextLevelYT AI. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/"><a className="hover:text-primary transition-colors">Privacy Policy</a></Link>
            <Link href="/"><a className="hover:text-primary transition-colors">Terms of Service</a></Link>
            <Link href="/"><a className="hover:text-primary transition-colors">Cookie Policy</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}