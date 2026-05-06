import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, ArrowLeft, Coins, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-8 hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          Go Back
        </Button>

        <Card className="border border-black/[0.04] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-[#ff6b4a] via-[#ff8f6b] to-amber-400" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Identity */}
            <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-black/[0.04] bg-[#ff6b4a]/[0.01]">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#ff6b4a] to-amber-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <Avatar className="h-32 w-32 border-8 border-white shadow-2xl relative z-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Profile"} className="object-cover" />
                    <AvatarFallback className="bg-white text-5xl font-black text-[#ff6b4a]">
                      {user.displayName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">{user.displayName}</h2>
                  <p className="text-lg text-slate-500 font-medium">{user.email}</p>
                </div>

                <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-black/[0.04] shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Premium AI Active</span>
                </div>

                <div className="pt-8 w-full">
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full h-14 rounded-2xl font-black text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    SIGN OUT
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Engine & Details */}
            <div className="lg:col-span-7 p-8 md:p-12 bg-white/40 space-y-10">
              {/* Token Engine Card */}
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#0F172A] to-[#1e293b] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#ff6b4a]/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                 <div className="relative z-10 flex flex-col items-center md:items-start space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Coins className="w-6 h-6 text-amber-400" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b4a]">Universal Balance</p>
                    </div>

                    <div className="flex items-baseline gap-4">
                      <span className="text-7xl font-black tracking-tighter leading-none">{user.appTokenBalance || 0}</span>
                      <span className="text-xl font-black text-slate-500 tracking-tight">TOKENS</span>
                    </div>
                    
                    <p className="text-slate-400 font-medium text-sm">Available for all premium pet care & forensic features.</p>
                    
                    <div className="flex flex-wrap gap-3 w-full pt-4">
                      <Link href="/pricing" className="flex-1 min-w-[140px]">
                        <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-[#0F172A] font-black text-sm transition-all duration-300">
                          TOP UP
                        </Button>
                      </Link>
                      <Link href="/usage" className="flex-1 min-w-[140px]">
                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-slate-400 border border-transparent hover:bg-white hover:text-[#0F172A] font-black text-sm transition-all duration-300">
                          VIEW HISTORY
                        </Button>
                      </Link>
                    </div>
                 </div>
              </div>

              {/* Account Table */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4 px-2">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Account Registry</h3>
                   <div className="h-px flex-1 bg-black/[0.04]" />
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-6 rounded-[2rem] bg-white border border-black/[0.04] shadow-sm flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</p>
                        <p className="text-sm font-black text-slate-900">
                          {user.metadata?.creationTime
                            ? format(new Date(user.metadata.creationTime), "MMM d, yyyy")
                            : "—"}
                        </p>
                      </div>
                   </div>

                   <div className="p-6 rounded-[2rem] bg-white border border-black/[0.04] shadow-sm flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-sm font-black text-green-600 uppercase">Verified</p>
                      </div>
                   </div>
                 </div>
              </div>

            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
