
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Check, Sparkles, Zap, Trophy, ArrowRight, ArrowLeft, Gift } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const PRICING_TIERS = [
  {
    id: "free",
    name: "Free Plan",
    tokens: 40,
    price: 0,
    description: "Get started with 40 free tokens on your first signup.",
    icon: Gift,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    isFree: true,
    features: ["40 Welcome Tokens (one-time)", "Access all AI features", "No credit card required", "Use tokens across all services"]
  },
  {
    id: "tier_1",
    name: "Starter Pack",
    tokens: 150,
    price: 9.99,
    description: "Perfect for regular pet wellness tracking.",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    features: ["150 Universal Tokens", "Valid for all AI services", "Instant fulfillment", "No expiration"]
  },
  {
    id: "tier_2",
    name: "Pro Pack",
    tokens: 350,
    price: 19.99,
    description: "The best value for multi-pet households.",
    icon: Sparkles,
    color: "from-[#ff6b4a] to-orange-600",
    shadow: "shadow-orange-500/20",
    featured: true,
    features: ["350 Universal Tokens", "Priority AI Processing", "Valid for all AI services", "Instant fulfillment", "No expiration"]
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handlePurchase = async (tierId: string) => {
    setLoadingTier(tierId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "credit_topup",
          userId: user?.dbId,
          metadata: { package: tierId }
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.details || data.error || "Payment generation failed");
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: e.message || "Failed to initiate purchase."
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="mb-8">
           <Link href="/">
             <Button variant="ghost" className="hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl">
               <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
               Back to Dashboard
             </Button>
           </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Zap className="w-3 h-3" /> Universal Credits
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white"
          >
            Empower Your Pet's Health
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            One wallet for all AI services. Use your tokens for health scans, nutrition advice, vet consultations, and artistic portraits.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 3) }}
            >
              <Card className={`relative overflow-hidden border-0 ${tier.shadow} ${(tier as any).featured ? 'scale-105 z-10' : ''} bg-white dark:bg-gray-900 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2`}>
                {(tier as any).featured && (
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#ff6b4a] to-orange-600" />
                )}
                
                <CardHeader className="pt-10 px-8 pb-4">
                  <div className={`w-14 h-14 rounded-2xl mb-6 bg-gradient-to-br ${tier.color} flex items-center justify-center text-white shadow-lg`}>
                    <tier.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-black">{tier.name}</CardTitle>
                  <CardDescription className="text-sm font-medium mt-2">{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="px-8 py-6">
                  <div className="flex items-baseline gap-1 mb-8">
                    {(tier as any).isFree ? (
                      <span className="text-5xl font-black tracking-tighter">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-black tracking-tighter">${tier.price}</span>
                        <span className="text-muted-foreground font-bold text-sm tracking-wider uppercase">USD</span>
                      </>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-8">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      {(tier as any).isFree ? 'Your Balance' : 'Includes'}
                    </p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      {(tier as any).isFree ? `${user?.appTokenBalance || 0} Tokens` : `${tier.tokens} Universal Tokens`}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {tier.features.map(feature => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="px-8 pb-10">
                  {((tier.id === 'free' && (!user?.lastPackage || user?.lastPackage === 'free')) || user?.lastPackage === tier.id) ? (
                    <div className="w-full h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                      <Check className="w-5 h-5" /> Current Plan
                    </div>
                  ) : tier.id === 'free' ? (
                    <div className="w-full h-14" /> // Keep blank for free tier if not current
                  ) : (
                    <Button
                      onClick={() => handlePurchase(tier.id)}
                      disabled={loadingTier === tier.id}
                      className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        (tier as any).featured 
                          ? 'bg-[#ff6b4a] hover:bg-[#e05a3b] text-white shadow-orange-500/40 hover:shadow-xl' 
                          : 'bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white hover:shadow-lg'
                      }`}
                    >
                      {loadingTier === tier.id ? (
                        <Zap className="w-6 h-6 animate-pulse" />
                      ) : (
                        <>Select Pack <ArrowRight className="w-5 h-5 ml-2" /></>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black mb-2 tracking-tight">Questions about tokens?</h2>
            </div>
            <Link href="/faq">
              <Button className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-black hover:text-white transition-all duration-300 font-black shadow-xl">
                VIEW FAQ
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
