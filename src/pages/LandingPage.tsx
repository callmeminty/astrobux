
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { GlowButton } from "@/components/ui/glow-button";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <MainLayout showNav={false} className="flex flex-col items-center justify-center">
      <motion.div
        className="flex flex-col items-center justify-center gap-12 text-center max-w-3xl mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Logo size="large" />
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold glow-text leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="text-gradient">Solve Captchas.</span>
          <br />
          <span className="text-gradient-purple">Earn Rewards.</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-zinc-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Join our cosmic community and earn points by solving simple captchas. 
          Convert your points to rewards and level up your collection.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <GlowButton 
            size="lg" 
            glowIntensity="high"
            onClick={handleGetStarted}
          >
            Start Earning
          </GlowButton>
          
          <GlowButton 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/about")}
          >
            Learn More
          </GlowButton>
        </motion.div>
        
        <motion.div 
          className="w-full max-w-md mx-auto mt-12 rounded-lg p-6 border border-white/10 backdrop-blur-md bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gradient">How It Works</h3>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <span className="bg-astro-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
              <span>Create your account and log in</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-astro-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
              <span>Solve simple alphanumeric captchas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-astro-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
              <span>Earn points for each correct captcha</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-astro-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">4</span>
              <span>Convert your points to rewards</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
