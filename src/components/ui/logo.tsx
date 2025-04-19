
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "text-xl md:text-2xl",
    default: "text-2xl md:text-3xl",
    large: "text-3xl md:text-5xl"
  };

  return (
    <Link to="/">
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div 
            className={`font-bold ${sizeClasses[size]} text-gradient-purple retro-text`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span>Astro</span>
            <span className="text-white">Captcha</span>
          </motion.div>
          <div className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-astro-purple to-transparent" />
        </div>
      </motion.div>
    </Link>
  );
}
