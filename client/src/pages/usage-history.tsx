
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { type TokenTransaction } from "@shared/schema";
import { format } from "date-fns";
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle, 
  Loader2,
  TrendingUp,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function UsageHistory() {
  const { user } = useAuth();

  const { data: transactions, isLoading: isLoadingTx } = useQuery<TokenTransaction[]>({
    queryKey: ["/api/transactions", user?.dbId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?userId=${user?.dbId}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
    enabled: !!user?.dbId,
  });

  const lastTopUp = transactions?.find(tx => tx.type === 'top_up');
  const totalSpent = transactions?.filter(tx => tx.type === 'usage').reduce((acc, tx) => acc + Math.abs(tx.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black font-sans">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Token Engine</h1>
            <p className="text-muted-foreground font-medium italic">Universal credits for premium pet care features.</p>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 shadow-2xl border border-black/[0.04] flex items-center gap-6 group hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">Available Balance</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{user?.appTokenBalance || 0} Tokens</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-xl rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                <ArrowUpRight className="w-24 h-24" />
              </div>
              <CardContent className="p-8 relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Last Top-Up</p>
                {lastTopUp ? (
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black">{lastTopUp.description}</h3>
                    <p className="text-sm font-medium text-indigo-200">
                      Added on {format(new Date(lastTopUp.createdAt!), "MMM d, yyyy")}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl font-bold italic opacity-70">No top-ups yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-[2rem] bg-[#0a0a0a] text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="w-24 h-24" />
              </div>
              <CardContent className="p-8 relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total AI Usage</p>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black">{totalSpent} Tokens Consumed</h3>
                  <p className="text-sm font-medium text-gray-400">Total spent since registration</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <History className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-black uppercase tracking-tight">Spending Activity</h2>
            </div>
            
            <Card className="border-0 shadow-lg rounded-[2.5rem] bg-white dark:bg-gray-900 overflow-hidden">
              <CardContent className="p-0">
                {isLoadingTx ? (
                  <div className="p-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#ff6b4a]" />
                    <p className="text-muted-foreground font-bold animate-pulse">Loading engine logs...</p>
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {transactions.map((tx, idx) => (
                      <motion.div 
                        key={tx.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                            tx.amount > 0 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-[#ff6b4a]/10 text-[#ff6b4a] dark:text-[#ff6b4a]'
                          }`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900 dark:text-white leading-tight">{tx.description}</p>
                              {tx.type === 'top_up' && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0 text-[9px] font-black uppercase py-0 px-2 h-4">PURCHASE</Badge>
                              )}
                            </div>
                            <p className="text-xs font-medium text-muted-foreground mt-1 lowercase">
                              {format(new Date(tx.createdAt!), "MMM d, yyyy • h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-black ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tokens</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                      <AlertCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">No transactions found</p>
                      <p className="text-muted-foreground">Once you start using the AI assistants, your history will appear here.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
