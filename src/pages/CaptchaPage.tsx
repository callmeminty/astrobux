
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowButton } from "@/components/ui/glow-button";
import { Input } from "@/components/ui/input";
import { generateCaptcha, verifyCaptcha, calculatePoints } from "@/lib/captchaUtils";
import { useUserData } from "@/contexts/UserDataContext";
import { toast } from "sonner";

export default function CaptchaPage() {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [captchaStartTime, setCaptchaStartTime] = useState<number | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [points, setPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const { userData, addPoints, incrementCaptchasSolved } = useUserData();
  const inputRef = useRef<HTMLInputElement>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [cooldown]);

  const generateNewCaptcha = () => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before generating a new captcha`);
      return;
    }
    
    setIsGenerating(true);
    setShowCaptcha(false);
    setUserInput("");
    
    // Add a small delay to make it feel like it's processing
    setTimeout(() => {
      const newCaptcha = generateCaptcha(8);
      setCaptcha(newCaptcha);
      setCaptchaStartTime(Date.now());
      setShowCaptcha(true);
      setIsGenerating(false);
      
      // Focus the input after captcha appears
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }, 800);
  };

  const handleVerify = async () => {
    if (!captcha || !userInput) return;
    if (!captchaStartTime) return;
    
    setIsVerifying(true);
    
    // Calculate time taken
    const timeTaken = (Date.now() - captchaStartTime) / 1000;
    
    if (verifyCaptcha(captcha, userInput)) {
      // Calculate points based on captcha complexity and time
      const earnedPoints = calculatePoints(captcha.length, timeTaken);
      
      // Bonus for consecutive correct answers
      const newConsecutive = consecutiveCorrect + 1;
      const streakBonus = Math.floor(newConsecutive / 3) * 2;
      const totalPoints = earnedPoints + streakBonus;
      
      // Update points
      setPointsEarned(totalPoints);
      setPoints(prev => prev + totalPoints);
      setConsecutiveCorrect(newConsecutive);
      
      // Update user data in Firebase
      try {
        await addPoints(totalPoints);
        await incrementCaptchasSolved();
        
        toast.success(`Correct! +${totalPoints} points`);
        
        if (streakBonus > 0) {
          toast.success(`Streak bonus: +${streakBonus} points!`);
        }
      } catch (err) {
        toast.error("Failed to update points");
        console.error(err);
      }
      
      // Short cooldown between captchas
      setCooldown(2);
      
      // Reset for next captcha
      setShowCaptcha(false);
      setCaptcha("");
      setUserInput("");
    } else {
      toast.error("Incorrect captcha. Please try again.");
      setConsecutiveCorrect(0);
      setCooldown(3);
    }
    
    setIsVerifying(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.toUpperCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userInput) {
      handleVerify();
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Solve Captchas</h1>
          <p className="text-zinc-400">
            Complete captchas correctly to earn points. Faster completion times and streaks earn bonus points!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InfoCard 
            title="Points Earned" 
            value={points} 
            icon="💎"
            description="Current session" 
          />
          <InfoCard 
            title="Streak" 
            value={consecutiveCorrect} 
            icon="🔥"
            description={consecutiveCorrect >= 3 ? `Bonus active: +${Math.floor(consecutiveCorrect / 3) * 2}` : "Get 3 in a row for bonus"} 
          />
          <InfoCard 
            title="Total Balance" 
            value={userData?.points || 0} 
            icon="💰"
            description="Available points" 
          />
        </div>
        
        <Card className="border border-white/10 backdrop-blur-md bg-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-gradient">Captcha Challenge</CardTitle>
            <CardDescription>
              Type the code you see to earn points
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                {!showCaptcha && !isGenerating && (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="my-6"
                  >
                    <GlowButton 
                      onClick={generateNewCaptcha} 
                      size="lg"
                      disabled={cooldown > 0}
                    >
                      {cooldown > 0 
                        ? `Generate Captcha (${cooldown}s)` 
                        : "Generate Captcha"}
                    </GlowButton>
                  </motion.div>
                )}
                
                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-40"
                  >
                    <div className="h-10 w-10 border-4 border-astro-purple border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-zinc-400">Generating captcha...</p>
                  </motion.div>
                )}
                
                {showCaptcha && (
                  <motion.div
                    key="captcha"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col items-center py-6"
                  >
                    <div className="relative mb-8 px-6 py-4 rounded-lg bg-gradient-to-r from-astro-purple/10 to-blue-600/10 border border-white/10">
                      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] rounded-lg" />
                      <div className="relative">
                        {/* Generate individual letter spans with random distortions */}
                        <div className="flex items-center justify-center tracking-wider">
                          {captcha.split('').map((char, index) => (
                            <motion.span
                              key={index}
                              className="text-3xl md:text-4xl font-mono font-bold text-white"
                              style={{ 
                                textShadow: "0 0 8px rgba(139, 92, 246, 0.8)",
                                display: "inline-block"
                              }}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                rotate: Math.random() * 16 - 8,
                                scale: 0.9 + Math.random() * 0.3
                              }}
                              transition={{ 
                                delay: index * 0.05, 
                                duration: 0.3,
                                type: "spring",
                                stiffness: 300
                              }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full max-w-sm space-y-4">
                      <Input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type the captcha here"
                        className="bg-white/5 border-white/10 text-center text-lg tracking-wider"
                        maxLength={captcha.length}
                        autoComplete="off"
                        disabled={isVerifying}
                      />
                      
                      <GlowButton
                        onClick={handleVerify}
                        className="w-full"
                        disabled={!userInput || isVerifying}
                      >
                        {isVerifying ? "Verifying..." : "Verify"}
                      </GlowButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {pointsEarned > 0 && (
                <AnimatePresence>
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    initial={{ opacity: 1, scale: 0.5, y: 0 }}
                    animate={{ opacity: 0, scale: 2, y: -100 }}
                    transition={{ duration: 1.5 }}
                    onAnimationComplete={() => setPointsEarned(0)}
                  >
                    <span className="text-4xl font-bold text-astro-purple">+{pointsEarned}</span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-astro-dark-lighter border-t border-white/5 flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-sm text-zinc-400">
            <p>Faster completion times earn more points</p>
            <p>Keep your streak going for bonuses!</p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}

function InfoCard({ title, value, icon, description }: { 
  title: string, 
  value: number, 
  icon: string, 
  description: string 
}) {
  return (
    <Card className="border border-white/10 backdrop-blur-md bg-white/5">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-2xl font-bold text-gradient-purple">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
