
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Coins, Zap, ShieldCheck, HelpCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const FAQS = [
  {
    question: "What are Universal Tokens?",
    answer: "Universal Tokens are the single, unified currency of PetCare AI. Instead of managing separate credits for vet chats, health scans, and portraits, you use one wallet for everything. This transparency ensures you only pay for what you actually use."
  },
  {
    question: "How many tokens do features cost?",
    answer: "We keep it simple: \n• AI Injury Scan: 20 Tokens\n• AI Vet Consultation: 10 Tokens\n• AI Portrait Generation: 20 Tokens\n• New Pet Profile Analysis: 5 Tokens"
  },
  {
    question: "Do my tokens ever expire?",
    answer: "No. Once you purchase a Token Pack, those tokens remain in your wallet indefinitely. Whether you use them today or six months from now, they will always be ready when your pet needs care."
  },
  {
    question: "Can I transfer tokens between accounts?",
    answer: "Currently, tokens are tied to your specific verified account to ensure data security and transaction integrity. They cannot be transferred to other users."
  },
  {
    question: "Are tokens refundable?",
    answer: "Since tokens provide immediate access to our high-compute AI models, they are generally non-refundable. However, if you experience a technical failure during a scan, our support team will manually credit your tokens back after verification."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <div className="mb-12">
           <Link href="/pricing">
             <Button variant="ghost" className="hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl px-6">
               <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
               Back to Pricing
             </Button>
           </Link>
        </div>

        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            <Coins className="w-4 h-4" /> Universal Token FAQ
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight mb-6">Everything you need to know</h1>
          <p className="text-xl text-muted-foreground">Detailed information about our token economy and membership benefits.</p>
        </div>

        <div className="space-y-6">
          {FAQS.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
                <CardContent className="p-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#ff6b4a]/10 group-hover:text-[#ff6b4a] transition-colors">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{faq.question}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-[#ff6b4a] to-orange-600 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
          <div className="relative z-10 text-center space-y-6">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-black">Still have questions?</h2>
            <p className="text-orange-100 font-medium max-w-lg mx-auto">
              Our support team is available 24/7 to help you with your token wallet or any technical inquiries.
            </p>
            <div className="pt-4">
              <Button className="bg-white text-[#ff6b4a] hover:bg-black hover:text-white h-14 px-10 rounded-2xl font-black transition-all">
                CONTACT SUPPORT
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
