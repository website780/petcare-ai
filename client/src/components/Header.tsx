import { LogOut, PawPrint, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
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
    <div className="w-full relative z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300 left-0 top-0 sticky">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/assets/Brand-Guidelines-for-Pet-Care-AI-3-1.png" alt="Pet Care AI Logo" className="h-10 md:h-12 w-auto object-contain" />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 absolute left-1/2 -translate-x-1/2">
             <Link href="/"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">AI Scan</span></Link>
             <Link href="/vet"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">AI Vet</span></Link>
             <Link href="/pet-portraits"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">AI Portraits</span></Link>
             <Link href="/scan"><span className="text-sm font-semibold text-gray-800 hover:text-[#ff6b4a] transition-colors cursor-pointer">Injury Scanner</span></Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <Button className="hidden md:flex bg-[#ff6b4a] hover:bg-[#e05a3b] text-white rounded-full px-6 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              Download The App  <PawPrint className="w-10 h-10 text-[#fff]" /> 
            </Button>
            
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
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </div>
    </div>
  );
}