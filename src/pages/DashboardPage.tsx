
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/contexts/UserDataContext";
import { useNavigate } from "react-router-dom";
import { GlowButton } from "@/components/ui/glow-button";

export default function DashboardPage() {
  const { userData, loading } = useUserData();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome message after 5 seconds
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-16 w-16 border-4 border-astro-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-zinc-400">Loading your data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {showWelcome && (
        <motion.div 
          className="mb-6 py-3 px-4 bg-gradient-to-r from-astro-purple/20 to-transparent border border-astro-purple/30 rounded-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-zinc-200">
            Welcome to your dashboard! Here you can track your progress and earnings.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Points" 
          value={userData?.points || 0} 
          description="Available for withdrawal"
          icon="💰"
        />
        
        <StatsCard 
          title="Captchas Solved" 
          value={userData?.captchasSolved || 0} 
          description="Total completed"
          icon="🔍"
        />
        
        <StatsCard 
          title="Last Activity" 
          value={userData?.lastCaptchaTime 
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(userData.lastCaptchaTime))
            : 'No activity yet'} 
          description="Recent captcha solved"
          icon="🕒"
          isDate
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-white/10 backdrop-blur-md bg-white/5">
          <CardHeader>
            <CardTitle className="text-gradient">Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <GlowButton 
                onClick={() => navigate("/captcha")}
                className="justify-start"
              >
                <span className="mr-2">🚀</span>
                Solve Captchas
              </GlowButton>
              
              <GlowButton 
                onClick={() => navigate("/withdraw")}
                variant="outline"
                className="justify-start"
              >
                <span className="mr-2">💎</span>
                Withdraw Points
              </GlowButton>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-white/10 backdrop-blur-md bg-white/5">
          <CardHeader>
            <CardTitle className="text-gradient">Progress</CardTitle>
            <CardDescription>Your journey so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressItem 
                title="Beginner"
                current={Math.min(userData?.captchasSolved || 0, 10)}
                max={10}
                completed={userData?.captchasSolved ? userData.captchasSolved >= 10 : false}
              />
              
              <ProgressItem 
                title="Intermediate"
                current={Math.min(Math.max(0, (userData?.captchasSolved || 0) - 10), 20)}
                max={20}
                completed={userData?.captchasSolved ? userData.captchasSolved >= 30 : false}
              />
              
              <ProgressItem 
                title="Expert"
                current={Math.min(Math.max(0, (userData?.captchasSolved || 0) - 30), 50)}
                max={50}
                completed={userData?.captchasSolved ? userData.captchasSolved >= 80 : false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

function StatsCard({ title, value, description, icon, isDate = false }: {
  title: string;
  value: number | string;
  description: string;
  icon: string;
  isDate?: boolean;
}) {
  return (
    <Card className="border border-white/10 backdrop-blur-md bg-white/5">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`text-2xl font-bold ${!isDate && typeof value === 'number' ? "text-gradient-purple" : ""}`}>
          {!isDate && typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProgressItem({ title, current, max, completed }: {
  title: string;
  current: number;
  max: number;
  completed: boolean;
}) {
  const percent = Math.min(100, (current / max) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${completed ? "bg-astro-purple" : "border-2 border-zinc-700"}`}>
            {completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className={completed ? "text-white" : "text-zinc-400"}>
            {title}
          </span>
        </div>
        <span className="text-xs text-zinc-500">
          {current}/{max}
        </span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-astro-purple"
          style={{ width: `${percent}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
