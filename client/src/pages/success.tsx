import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase"; // Added direct firebase auth access
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SuccessPage() {
  const { refreshUser } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [purchaseType, setPurchaseType] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");

    const verifyPayment = async () => {
      setVerifying(true);
      try {
        let response;
        if (sessionId) {
          console.log("[Success] Verifying by Session ID:", sessionId);
          response = await apiRequest("GET", `/api/stripe/fulfill-session?sessionId=${sessionId}`);
        } else if (auth.currentUser?.email) {
          console.log("[Success] Verifying by Email Fallback:", auth.currentUser.email);
          response = await apiRequest("GET", `/api/stripe/fulfill-by-email?email=${auth.currentUser.email}`);
        } else {
          await refreshUser();
          return;
        }

        const data = await response.json();
        if (data.success) {
          console.log("[Success] Fulfillment confirmed!", data.type);
          setComplete(true);
          setPurchaseType(data.type);
          await refreshUser();
          toast({
            title: "Access Unlocked!",
            description: "Your premium features are now ready to use.",
          });
        }
      } catch (error) {
        console.error("[Success] Verification error:", error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [refreshUser, toast]);

  const getTargetLink = () => {
    switch(purchaseType) {
      case "injury_report": return { label: "Return to Injury Scanner", href: "/scan" };
      case "vet_chat_pack": return { label: "Start AI Vet Chat", href: "/vet" };
      case "portrait_hd":
      case "portrait_print":
      case "portrait": return { label: "Go to Your Portraits", href: "/pet-portraits" };
      default: return { label: "Return to AI Scan", href: "/" };
    }
  };

  const target = getTargetLink();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6 text-green-500">
          {verifying ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : (
            <CheckCircle2 className="w-10 h-10" />
          )}
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          {verifying ? "Verifying Payment..." : "Payment Successful!"}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 text-center max-max-w-md mx-auto">
          {verifying 
            ? "We're just confirming your transaction with Stripe. One moment..." 
            : "Thank you for your purchase! Your premium features have been unlocked automatically. You can now access your full report or chat credits."}
        </p>
        
        {!verifying && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button asChild size="lg" className="bg-[#ff6b4a] hover:bg-[#e05a3b] px-8 py-6 text-lg font-bold shadow-lg shadow-orange-500/20">
              <Link href={target.href} className="flex items-center gap-2">
                {target.label} <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6">
              <Link href="/">Main Menu</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
