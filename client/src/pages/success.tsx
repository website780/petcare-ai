import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function SuccessPage() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Refresh user state immediately to reflect new credits/scans
    refreshUser();
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6 text-green-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-md mx-auto">
          Thank you for your purchase. Your premium features have been unlocked. 
          You can now access your full report or chat credits.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-[#ff6b4a] hover:bg-[#e05a3b]">
            <Link href="/" className="flex items-center gap-2">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/scan">New Injury Scan</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
