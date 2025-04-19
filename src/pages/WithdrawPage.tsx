
import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowButton } from "@/components/ui/glow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/contexts/UserDataContext";
import { toast } from "sonner";

export default function WithdrawPage() {
  const { userData, withdrawPoints } = useUserData();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWithdraw = async () => {
    if (!username.trim()) {
      toast.error("Please enter your Roblox username");
      return;
    }
    
    const withdrawAmount = parseInt(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!userData || userData.points < withdrawAmount) {
      toast.error("Insufficient balance");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the user's points
      await withdrawPoints(withdrawAmount);
      
      setSuccess(true);
      setUsername("");
      setAmount("");
      
      toast.success("Withdrawal request submitted successfully!");
      
      // Reset success state after a few seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      toast.error("Failed to process withdrawal");
      console.error(error);
    } finally {
      setIsProcessing(false);
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Withdraw Rewards</h1>
          <p className="text-zinc-400">
            Convert your earned points to rewards.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="border border-white/10 backdrop-blur-md bg-white/5">
            <CardHeader>
              <CardTitle className="text-gradient">Available Balance</CardTitle>
              <CardDescription>Your current points available for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-astro-purple/20 rounded-full p-3">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-purple">
                    {userData?.points || 0}
                  </div>
                  <p className="text-sm text-zinc-500">Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-white/10 backdrop-blur-md bg-white/5">
            <CardHeader>
              <CardTitle className="text-gradient">Exchange Rate</CardTitle>
              <CardDescription>Current conversion rate for rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎮</span>
                    <span>100 Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gradient-purple">10 Robux</span>
                    <span className="text-xl">💎</span>
                  </div>
                </div>
                
                <div className="text-xs text-zinc-500 italic">
                  Note: The minimum withdrawal amount is 100 points (10 Robux)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border border-white/10 backdrop-blur-md bg-white/5">
          <CardHeader>
            <CardTitle className="text-gradient">Request Withdrawal</CardTitle>
            <CardDescription>
              Fill in the details below to withdraw your points as rewards
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Roblox Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Roblox username"
                  className="bg-white/5 border-white/10"
                  disabled={isProcessing || success}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Points to Withdraw</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-white/5 border-white/10 pr-24"
                    min={100}
                    step={100}
                    disabled={isProcessing || success}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-zinc-500">
                    = {amount ? Math.floor(parseInt(amount) / 10) : 0} Robux
                  </div>
                </div>
                
                <p className="text-xs text-zinc-500">
                  Minimum withdrawal: 100 points (10 Robux)
                </p>
              </div>
              
              <div className="pt-4">
                <GlowButton
                  onClick={handleWithdraw}
                  className="w-full"
                  glowIntensity="high"
                  disabled={isProcessing || success || !username || !amount}
                >
                  {isProcessing ? "Processing..." : success ? "Request Submitted!" : "Submit Withdrawal Request"}
                </GlowButton>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-md p-4 text-sm text-zinc-400">
                <h3 className="font-medium text-white mb-2">Important Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Withdrawals are processed within 24-48 hours</li>
                  <li>Make sure your username is correct</li>
                  <li>The amount will be credited to your Roblox account</li>
                  <li>Points are non-refundable once converted</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
