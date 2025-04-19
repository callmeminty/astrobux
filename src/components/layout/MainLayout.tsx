
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Logo } from "@/components/ui/logo";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export function MainLayout({ children, showNav = true, className = "" }: MainLayoutProps) {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      <ParticleBackground />
      
      {showNav && (
        <motion.header 
          className="w-full border-b border-white/10 backdrop-blur-md bg-astro-dark/50 sticky top-0 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Logo size="small" />
            
            <div className="flex items-center gap-6">
              {currentUser ? (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/captcha">Earn Points</NavLink>
                  <NavLink to="/withdraw">Withdraw</NavLink>
                  <UserNav />
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </div>
          </div>
        </motion.header>
      )}
      
      <main className={`flex-1 container mx-auto px-4 py-8 ${className}`}>
        {children}
      </main>
      
      <footer className="w-full border-t border-white/10 backdrop-blur-md bg-astro-dark/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" />
            <p className="text-sm text-zinc-400 mt-2 md:mt-0">
              © {new Date().getFullYear()} AstroCaptcha Quest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link 
      to={to} 
      className="text-zinc-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-astro-purple transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
