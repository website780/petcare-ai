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
  const { user, refreshUser } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [purchaseType, setPurchaseType] = useState<string | null>(null);
  const [purchaseMetadata, setPurchaseMetadata] = useState<any>(null);
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
          // Try to fulfill any recent paid scan or injury report for this email
          console.log("[Success] Verifying by Email Forensics:", auth.currentUser.email);
          
          // Try types in order of likelihood
          const typesToTry = ["credit_topup", "injury_report", "vet_chat_pack", "portrait_hd", "portrait_print", "home_analysis"];
          let foundData = null;

          for (const type of typesToTry) {
            const forensicRes = await apiRequest("GET", `/api/stripe/fulfill-by-email?email=${auth.currentUser.email}&type=${type}`);
            const forensicData = await forensicRes.json();
            if (forensicData.success) {
              foundData = forensicData;
              break;
            }
          }

          if (foundData) {
            const finalData = foundData;
            response = { json: async () => finalData };
          } else {
            await refreshUser();
            return;
          }
        } else {
          await refreshUser();
          return;
        }

        const data = await response.json();
        if (data.success) {
          console.log("[Success] Fulfillment confirmed!", data.type);
          setComplete(true);
          setPurchaseType(data.type);
          setPurchaseMetadata(data.metadata || null);
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
      case "injury_report": 
        return { 
          label: "Go to Injury Scanner", 
          href: purchaseMetadata?.scanId ? `/scan?id=${purchaseMetadata.scanId}` : "/scan" 
        };
      case "vet_chat_pack": 
      case "vet_chat": return { label: "Go to AI Vet", href: "/vet" };
      case "portrait_hd":
      case "portrait_print":
      case "portrait": return { label: "Go to AI Portraits", href: "/pet-portraits" };
      case "home_analysis": return { label: "Go to Injury Scanner", href: "/scan" };
      case "credit_topup": return { label: "Return to Dashboard", href: "/" };
      default: return { label: "Return to Dashboard", href: "/" };
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
        
        <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">
          {verifying ? "Verifying Transaction..." : (purchaseType === "credit_topup" ? "Tokens Added!" : "Access Unlocked!")}
        </h1>

        {!verifying && user && (
          <p className="text-emerald-600 font-bold mb-2">
            Welcome back, {user.displayName}!
          </p>
        )}
        
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-md mx-auto leading-relaxed">
          {verifying 
            ? "We're just confirming your transaction with Stripe. One moment while we upgrade your access..." 
            : "Thank you for your purchase! Your premium access has been enabled. You can now return to the feature to see your results or start your session."}
        </p>
        
        {!verifying && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Button asChild size="lg" className="bg-[#ff6b4a] hover:bg-[#e05a3b] px-10 py-7 text-lg font-black shadow-xl shadow-orange-500/20 rounded-2xl">
              <Link href={target.href} className="flex items-center gap-3">
                {target.label} <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            {target.href !== "/" && (
              <Button asChild variant="outline" size="lg" className="px-10 py-7 text-lg font-bold rounded-2xl border-2 hover:bg-slate-50 transition-all">
                <Link href="/">Go to Home</Link>
              </Button>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
