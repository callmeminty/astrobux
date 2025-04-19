import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { GlowButton } from "@/components/ui/glow-button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-9xl font-bold text-gradient-purple mb-4 glow-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            404
          </motion.h1>
          
          <h2 className="text-2xl mb-6">Lost in Space?</h2>
          
          <p className="text-zinc-400 mb-8">
            The page you're looking for seems to have drifted into a black hole.
          </p>
          
          <GlowButton 
            onClick={() => navigate("/")} 
            className="mx-auto"
            size="lg"
          >
            Return to Home
          </GlowButton>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
