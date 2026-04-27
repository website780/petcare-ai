import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

export default function UserProfile() {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to sign out",
        description: "Please try again",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6 hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          Go Back
        </Button>

        <Card className="border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-[#ff6b4a] to-[#ff8f6b]" />
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-black tracking-tight">Account Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#ff6b4a]/[0.03] border border-[#ff6b4a]/10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b4a] to-[#ff8f6b] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                    className="relative h-24 w-24 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="relative h-24 w-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                    <span className="text-4xl font-black text-[#ff6b4a]">
                      {user.displayName?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black text-foreground">{user.displayName}</h2>
                <p className="text-muted-foreground font-medium">{user.email}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-xs font-bold text-[#ff6b4a] uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Premium AI Context Enabled
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-black/[0.04] bg-white shadow-sm flex flex-col gap-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">AI Vet Credits</p>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-[#ff6b4a]">{user.vetChatCredits || 0}</span>
                    <span className="text-sm font-bold text-muted-foreground pb-1">Questions Left</span>
                 </div>
              </div>
              <div className="p-5 rounded-2xl border border-black/[0.04] bg-white shadow-sm flex flex-col gap-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Injury Scans</p>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-blue-500">{Math.max(0, 2 - (Number(user.freeInjuryScanUsed) || 0))}</span>
                    <span className="text-sm font-bold text-muted-foreground pb-1">Free Scans Left</span>
                 </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
               <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Account Details</h3>
               <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-black/[0.02]">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-bold">Member Since</span>
                  </div>
                  <span className="text-sm font-black text-foreground">
                    {user.metadata?.creationTime
                      ? format(new Date(user.metadata.creationTime), "MMM d, yyyy")
                      : "—"}
                  </span>
               </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full sm:w-auto h-12 rounded-xl font-bold border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>

              <Button
                variant="ghost"
                onClick={async () => {
                  if (confirm("Reset account status for testing purposes?")) {
                    try {
                      await apiRequest("POST", "/api/auth/reset-test-account", { userId: user.dbId });
                      window.location.href = "/";
                    } catch (error) {
                      toast({ variant: "destructive", title: "Reset Failed" });
                    }
                  }
                }}
                className="w-full sm:w-auto h-12 rounded-xl font-bold text-muted-foreground opacity-50 hover:opacity-100 transition-opacity"
              >
                Reset for Testing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
