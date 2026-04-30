import { LogOut, PawPrint, User, CreditCard, History, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

   const handleSignOut = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full relative z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 left-0 top-0 sticky">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/assets/Brand-Guidelines-for-Pet-Care-AI-3-1.png" alt="Pet Care AI Logo" className="h-10 md:h-12 w-auto object-contain" />
            </div>
          </Link>

          {/* 
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 absolute left-1/2 -translate-x-1/2">
             <Link href="/vet"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">AI Vet</span></Link>
             <Link href="/pet-portraits"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">AI Portraits</span></Link>
             <Link href="/scan"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">Injury Scanner</span></Link>
          </nav>
          */}

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            
            <a 
              href="https://apps.apple.com/us/app/pet-care-ai-pet-wellness-app/id6744159910" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button className="bg-[#ff6b4a] hover:bg-[#e05a3b] text-white rounded-full px-6 transition-all duration-300 font-semibold shadow-md hover:shadow-lg gap-2">
                Download The App <PawPrint className="w-5 h-5" /> 
              </Button>
            </a>

            {/* Universal Token Wallet - REPOSITIONED & NEW DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-amber-100/50 hover:bg-amber-100 border-amber-300 text-amber-900 font-bold rounded-full px-4 flex items-center gap-2 shadow-sm transition-all"
                >
                  <span className="text-xl leading-none">🪙</span>
                  <span>{user.appTokenBalance || 0}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-amber-100">
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Your Balance</p>
                  <p className="text-2xl font-black text-amber-900">{user.appTokenBalance || 0} Tokens</p>
                </div>
                <DropdownMenuSeparator />
                <Link href="/pricing">
                  <DropdownMenuItem className="cursor-pointer py-3 rounded-xl focus:bg-amber-50 gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900">Top Up Tokens</span>
                      <span className="text-[10px] text-gray-500">Buy more credits</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/usage">
                  <DropdownMenuItem className="cursor-pointer py-3 rounded-xl focus:bg-blue-50 gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <History className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900">Usage History</span>
                      <span className="text-[10px] text-gray-500">Track your spending</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 p-0 rounded-full border-2 border-muted hover:border-[#ff6b4a] overflow-hidden transition-colors">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Profile"} />
                    <AvatarFallback className="bg-primary/10 text-[#ff6b4a] font-bold text-lg">
                      {user.displayName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-black/[0.04] bg-white/95 backdrop-blur-xl">
                <div className="px-3 py-3 mb-2 bg-slate-50/50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Account</p>
                  <p className="text-sm font-black text-slate-900 truncate">{user.displayName}</p>
                  <p className="text-[10px] font-medium text-slate-500 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="opacity-50" />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer py-3 rounded-xl focus:bg-[#ff6b4a]/5 gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-focus:bg-[#ff6b4a]/10 flex items-center justify-center text-slate-400 group-focus:text-[#ff6b4a] transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900">My Profile</span>
                      <span className="text-[10px] text-gray-500">Manage your identity</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="opacity-50" />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer py-3 rounded-xl focus:bg-red-50 gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 group-focus:text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-red-600">Sign Out</span>
                    <span className="text-[10px] text-red-400">Exit your session</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </div>
    </div>
  );
}