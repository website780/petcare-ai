import { Header } from "@/components/Header";
import { VetChatStandalone } from "@/components/VetChatStandalone";
import { Stethoscope, ActivitySquare, Search } from "lucide-react";

export default function VetStandalonePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      {/* Premium Hero Section */}
      <div className="relative pt-16 md:pt-20 pb-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6b4a]/5 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-white border border-black/[0.04] px-4 py-2 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="w-2 h-2 rounded-full bg-[#ff6b4a] animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b4a]">Clinical AI Active</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
              24/7 Veterinary <br />
              <span className="text-[#ff6b4a]">Expert Intelligence</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Get clinical-grade veterinary guidance in seconds. 
              Powered by advanced AI to assess health, nutrition, and emergency needs.
            </p>
          </div>

          <div className="mb-12 animate-in fade-in scale-in-95 duration-1000">
            <div className="p-1 rounded-[3rem] bg-gradient-to-br from-white via-[#ff6b4a]/10 to-blue-500/10 shadow-[0_32px_64px_rgba(0,0,0,0.06)]">
               <div className="bg-white rounded-[2.8rem] overflow-hidden">
                  <VetChatStandalone />
               </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
             {[
               { icon: Stethoscope, title: "Diagnostic Depth", desc: "Multi-layered symptom analysis for precise guidance." },
               { icon: ActivitySquare, title: "Emergency Triage", desc: "Instant severity assessment for critical situations." },
               { icon: Search, title: "Clinical Database", desc: "Leveraging vast veterinary knowledge repositories." }
             ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white border border-black/[0.03] shadow-sm hover:shadow-md transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 group-hover:bg-[#ff6b4a] transition-colors">
                      <feature.icon className="w-6 h-6" />
                   </div>
                   <h4 className="font-black text-lg mb-2">{feature.title}</h4>
                   <p className="text-sm font-medium text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
