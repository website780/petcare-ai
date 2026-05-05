import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, Download, Shield, Eye, Calendar, Sparkles, Stethoscope, Scissors, Dumbbell, Activity, Search, RefreshCw, FileText } from "lucide-react";
import { Link } from "wouter";

export default function AdminPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: usersData = [], isLoading, refetch, isRefetching } = useQuery<any[]>({
    queryKey: ["/api/admin/all-data"],
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Desktop Only Screen
  if (isDesktop === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-sm bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-2 text-3xl font-black">
            🖥️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Desktop Access Only</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">
            The admin dashboard can only be accessed on desktop screens for optimal data viewing and security. Please log in from a laptop or desktop computer.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6b4a]/10 flex items-center justify-center text-2xl font-black">
              🔐
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Admin Authentication</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Restricted Access</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Please enter the master administrator password to view the database console.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (password === "Admin@PetAICompanion2026") {
                setIsAuthenticated(true);
                toast({ title: "Access Granted", description: "Welcome back, Admin." });
              } else {
                toast({ title: "Invalid Password", description: "Please enter the correct admin password.", variant: "destructive" });
              }
            }} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 rounded-xl border-slate-200 focus-visible:ring-[#ff6b4a] font-bold text-lg"
              />
              <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg">
                Authenticate
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const handleExportAll = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        "User ID",
        "Email",
        "Display Name",
        "Firebase ID",
        "Token Balance",
        "Vet Chat Credits",
        "Created At",
        "Total Pets",
        "Total Injury Scans",
        "Total AI Vet Chats",
        "Total AI Portraits"
      ].map(h => `"${h}"`).join(",") + "\r\n";

      usersData.forEach(user => {
        csvContent += [
          user.id,
          user.email || "",
          user.displayName || "Anonymous",
          user.firebaseId || "",
          user.appTokenBalance ?? 0,
          user.vetChatCredits ?? 0,
          user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
          user.pets?.length || 0,
          user.standaloneScans?.length || 0,
          user.standaloneVetChats?.length || 0,
          user.petPortraits?.length || 0
        ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const a = document.createElement("a");
      a.href = encodedUri;
      a.download = `petai-admin-data-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast({ title: "Data Exported", description: "Your data has been successfully exported to an Excel-friendly CSV file." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Export Failed", description: err.message || "An error occurred." });
    }
  };

  const handleExportUser = (user: any) => {
    try {
      let textContent = `--- USER PROFILE REPORT ---
ID: ${user.id}
Email: ${user.email || "N/A"}
Name: ${user.displayName || "Anonymous User"}
Firebase UID: ${user.firebaseId || "N/A"}
Token Balance: ${user.appTokenBalance ?? 0}
Vet Chat Credits: ${user.vetChatCredits ?? 0}
Registration Date: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}

--- PETS (${user.pets?.length || 0}) ---
`;
      if (user.pets && user.pets.length > 0) {
        user.pets.forEach((pet: any, idx: number) => {
          textContent += `${idx + 1}. Name: ${pet.name} | Species: ${pet.species} | Breed: ${pet.breed || "Mix"} | Age: ${pet.age || "N/A"}\n`;
        });
      } else {
        textContent += "No pet profiles found.\n";
      }

      textContent += `\n--- INJURY SCANS (${user.standaloneScans?.length || 0}) ---\n`;
      if (user.standaloneScans && user.standaloneScans.length > 0) {
        user.standaloneScans.forEach((scan: any, idx: number) => {
          textContent += `${idx + 1}. Date: ${scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : "N/A"} | Species: ${scan.petInfo?.species || "N/A"} | Severity: ${scan.analysisResults?.severity || "N/A"}\n   Description: ${scan.analysisResults?.injuryDescription || "N/A"}\n`;
        });
      } else {
        textContent += "No injury scans recorded.\n";
      }

      textContent += `\n--- AI VET CHATS (${user.standaloneVetChats?.length || 0}) ---\n`;
      if (user.standaloneVetChats && user.standaloneVetChats.length > 0) {
        user.standaloneVetChats.forEach((chat: any, idx: number) => {
          textContent += `${idx + 1}. Consultation for ${chat.petInfo?.name || chat.petInfo?.species || "Pet"} (${chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : "N/A"})\n`;
          if (Array.isArray(chat.chatHistory)) {
            chat.chatHistory.forEach((msg: any) => {
              textContent += `   [${msg.role}]: ${msg.content}\n`;
            });
          }
        });
      } else {
        textContent += "No AI Vet Chat history found.\n";
      }

      textContent += `\n--- AI PORTRAITS (${user.petPortraits?.length || 0}) ---\n`;
      if (user.petPortraits && user.petPortraits.length > 0) {
        user.petPortraits.forEach((portrait: any, idx: number) => {
          textContent += `${idx + 1}. Style: ${portrait.style} | Paid: ${portrait.paid || "false"}\n`;
        });
      } else {
        textContent += "No AI portraits generated yet.\n";
      }

      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-report-${user.email || user.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "User Exported", description: `Report for ${user.email || user.id} downloaded successfully.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Export Failed", description: err.message || "An error occurred." });
    }
  };

  const filteredUsers = usersData.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(user.id).includes(searchQuery)
  );

  const totalPets = usersData.reduce((acc, user) => acc + (user.pets?.length || 0), 0);
  const totalScans = usersData.reduce((acc, user) => acc + (user.standaloneScans?.length || 0), 0);
  const totalChats = usersData.reduce((acc, user) => acc + (user.standaloneVetChats?.length || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffcf9]">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-7xl space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200/60 rounded-2xl w-1/4" />
            <div className="h-40 bg-slate-200/60 rounded-3xl" />
            <div className="h-96 bg-slate-200/60 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9] pb-12">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10 space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 bg-[#ff6b4a] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#ff6b4a]/30">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Admin Control Suite
                </h1>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Master Weapon Platform & Activity Analytics</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="rounded-2xl h-12 px-5 font-black border-slate-200 hover:border-[#ff6b4a]/20 hover:text-[#ff6b4a] transition-all bg-white shadow-sm flex items-center gap-2 text-xs"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={handleExportAll}
              className="bg-black hover:bg-black/90 text-white font-black rounded-2xl h-12 px-6 shadow-xl shadow-black/10 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <Download className="h-4 w-4" />
              Export Database (CSV)
            </Button>
          </div>
        </div>

        {/* Analytic Metrics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-black/[0.04] shadow-sm rounded-[2rem] bg-white overflow-hidden relative group p-6">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-slate-100 blur-[60px] rounded-full group-hover:bg-[#ff6b4a]/5 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Users</p>
                <h3 className="text-3xl font-black text-slate-900">{usersData.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="border border-black/[0.04] shadow-sm rounded-[2rem] bg-white overflow-hidden relative group p-6">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-slate-100 blur-[60px] rounded-full group-hover:bg-[#ff6b4a]/5 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pet Profiles</p>
                <h3 className="text-3xl font-black text-slate-900">{totalPets}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="border border-black/[0.04] shadow-sm rounded-[2rem] bg-white overflow-hidden relative group p-6">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-slate-100 blur-[60px] rounded-full group-hover:bg-[#ff6b4a]/5 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Injury Scans</p>
                <h3 className="text-3xl font-black text-slate-900">{totalScans}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="border border-black/[0.04] shadow-sm rounded-[2rem] bg-white overflow-hidden relative group p-6">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-slate-100 blur-[60px] rounded-full group-hover:bg-[#ff6b4a]/5 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Vet Chats</p>
                <h3 className="text-3xl font-black text-slate-900">{totalChats}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Stethoscope className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Data Master Exploration Section */}
        <Card className="border border-black/[0.04] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white/80 backdrop-blur-xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active User Explorer</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deep Dive into nested profiles, chats, scans, & portraits</p>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#ff6b4a] transition-colors" />
              <Input
                placeholder="Search user email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 rounded-2xl border-slate-200 focus-visible:ring-[#ff6b4a] bg-slate-50/50"
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <AccordionItem
                  key={user.id}
                  value={String(user.id)}
                  className="border border-slate-100 rounded-[2rem] bg-white overflow-hidden px-6 py-2 shadow-sm hover:border-slate-200/80 transition-all duration-300"
                >
                  <AccordionTrigger className="hover:no-underline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 cursor-pointer">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 font-black text-sm">
                        {user.id}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-black text-base text-slate-900 tracking-tight">
                          {user.displayName || "Anonymous User"}
                        </div>
                        <div className="text-xs font-bold text-slate-400">{user.email}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center pr-2">
                      <div className="bg-[#ff6b4a]/10 text-[#ff6b4a] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#ff6b4a]/10">
                        {user.appTokenBalance ?? 0} Tokens
                      </div>
                      <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                        {user.pets?.length || 0} Pets
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-2 pb-6 space-y-6">
                    <div className="h-px bg-slate-100 w-full" />
                    
                    {/* Actions & Core Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#ff6b4a]">User Information</h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 border border-slate-100/60 p-4 rounded-2xl text-xs">
                          <div>
                            <p className="text-slate-400 font-black uppercase tracking-widest mb-0.5">Firebase UID</p>
                            <p className="font-bold text-slate-800 break-all">{user.firebaseId}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-black uppercase tracking-widest mb-0.5">Registration Date</p>
                            <p className="font-bold text-slate-800">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-black uppercase tracking-widest mb-0.5">Vet Chat Credits</p>
                            <p className="font-bold text-slate-800">{user.vetChatCredits ?? 0} Credits</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-black uppercase tracking-widest mb-0.5">Usage Counts</p>
                            <p className="font-bold text-slate-800">
                              Scans: {user.freeScanUsed ?? 0} | Injuries: {user.freeInjuryScanUsed ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#ff6b4a]">Actions</h4>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            onClick={() => handleExportUser(user)}
                            className="w-full h-11 text-xs font-black rounded-xl border-slate-200 hover:border-black hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Export Data Report
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* All User Activity Records Accordion */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Activity & Records</h4>
                      <div className="space-y-3">
                        
                        {/* 1. Pets Expansion */}
                        <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-[1.5rem] space-y-3">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-600" />
                            <span className="font-black text-xs uppercase tracking-widest text-slate-800">Pet Profiles ({user.pets?.length || 0})</span>
                          </div>
                          {user.pets && user.pets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {user.pets.map((pet: any) => (
                                <div key={pet.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#ff6b4a]/5 border border-[#ff6b4a]/10 overflow-hidden">
                                      {pet.imageUrl ? (
                                        <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">No Img</div>
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="font-black text-sm text-slate-900 leading-none">{pet.name}</h5>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                                        {pet.species} • {pet.breed || "Mix"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-[10px] bg-slate-100 px-2 py-1 rounded-full font-black text-slate-600 uppercase">
                                    Age: {pet.age || "N/A"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-slate-400">No pet profiles added yet.</p>
                          )}
                        </div>

                        {/* 2. Injury Scans Expansion */}
                        <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-[1.5rem] space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-orange-500" />
                            <span className="font-black text-xs uppercase tracking-widest text-slate-800">Injury Scans ({user.standaloneScans?.length || 0})</span>
                          </div>
                          {user.standaloneScans && user.standaloneScans.length > 0 ? (
                            <div className="space-y-3">
                              {user.standaloneScans.map((scan: any) => (
                                <div key={scan.id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <div className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Scan Summary</div>
                                      <h6 className="font-black text-sm text-slate-900">
                                        {scan.petInfo?.species} - {scan.petInfo?.breed || "N/A"}
                                      </h6>
                                      <p className="text-xs font-medium text-slate-600 max-w-2xl mt-1">
                                        {scan.analysisResults?.injuryDescription || "Analysis report available"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <div className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${scan.analysisResults?.severity === "HIGH" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}>
                                      Severity: {scan.analysisResults?.severity || "LOW"}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400">
                                      {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : ""}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-slate-400">No injury scans on file.</p>
                          )}
                        </div>

                        {/* 3. AI Vet Chats Expansion */}
                        <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-[1.5rem] space-y-3">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-purple-600" />
                            <span className="font-black text-xs uppercase tracking-widest text-slate-800">AI Vet Chats ({user.standaloneVetChats?.length || 0})</span>
                          </div>
                          {user.standaloneVetChats && user.standaloneVetChats.length > 0 ? (
                            <div className="space-y-3">
                              {user.standaloneVetChats.map((chat: any) => (
                                <div key={chat.id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="font-black text-xs text-slate-800">
                                      Consultation for {chat.petInfo?.name || chat.petInfo?.species}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold">
                                      {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : ""}
                                    </div>
                                  </div>
                                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl max-h-32 overflow-y-auto space-y-2">
                                    {chat.chatHistory && Array.isArray(chat.chatHistory) ? (
                                      chat.chatHistory.map((msg: any, i: number) => (
                                        <div key={i} className="flex gap-2">
                                          <span className="font-black text-slate-900 capitalize text-[10px] w-12 flex-shrink-0">{msg.role}:</span>
                                          <span className="text-slate-600 text-xs">{msg.content}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-slate-400">No history array available.</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-slate-400">No AI Vet Chat history yet.</p>
                          )}
                        </div>

                        {/* 4. AI Portraits Expansion */}
                        <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-[1.5rem] space-y-3">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-pink-600" />
                            <span className="font-black text-xs uppercase tracking-widest text-slate-800">AI Portraits ({user.petPortraits?.length || 0})</span>
                          </div>
                          {user.petPortraits && user.petPortraits.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {user.petPortraits.map((portrait: any) => (
                                <div key={portrait.id} className="p-2 bg-white border border-slate-100 rounded-2xl space-y-2">
                                  <div className="aspect-square relative rounded-xl overflow-hidden border border-slate-100">
                                    <img src={portrait.portraitImageUrl} alt="Portrait" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-[9px] font-black text-[#ff6b4a] uppercase">{portrait.style}</div>
                                    <div className="text-[9px] font-bold text-slate-400">Paid: {portrait.paid || "false"}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-slate-400">No AI portraits generated yet.</p>
                          )}
                        </div>

                      </div>
                    </div>

                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching user records found.</p>
              </div>
            )}
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
