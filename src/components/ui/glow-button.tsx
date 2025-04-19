
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  glowIntensity?: "low" | "medium" | "high";
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ 
    className, 
    children, 
    variant = "default", 
    size = "default", 
    glowIntensity = "medium",
    ...props 
  }, ref) => {
    
    const variantStyles = {
      default: "bg-astro-purple text-white border-transparent hover:bg-astro-purple-dark",
      outline: "bg-transparent text-astro-purple border-astro-purple hover:bg-astro-purple/10",
      ghost: "bg-transparent text-astro-purple border-transparent hover:bg-astro-purple/10",
    };
    
    const sizeStyles = {
      sm: "h-9 px-3 rounded-md text-sm",
      default: "h-10 px-4 py-2 rounded-md",
      lg: "h-12 px-6 rounded-md text-lg",
    };
    
    const glowStyles = {
      low: "after:opacity-20 after:blur-md",
      medium: "after:opacity-40 after:blur-lg",
      high: "after:opacity-60 after:blur-xl",
    };

    const buttonClasses = cn(
      "relative font-medium border-2 transition-colors duration-200",
      "inline-flex items-center justify-center",
      "focus:outline-none focus:ring-2 focus:ring-astro-purple focus:ring-offset-2 focus:ring-offset-astro-dark",
      "disabled:opacity-50 disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      "glow-purple",
      glowStyles[glowIntensity],
      className
    );
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        {...props}
      >
        <motion.span 
          className="flex items-center justify-center w-full h-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.span>
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";
