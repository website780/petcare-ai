import { Header } from "@/components/Header";
import { InjuryScanner } from "@/components/InjuryScanner";

export default function InjuryScannerPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      {/* Premium Hero Section */}
      <div className="relative pt-24 md:pt-32 pb-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6b4a]/5 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white border border-black/[0.04] px-4 py-2 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b4a]">Diagnostic Engine Online</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
              Visual Injury <br />
              <span className="text-[#ff6b4a]">Deep Analysis</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Instant AI identification of dermatological issues, wounds, and physical trauma. 
              Upload high-resolution media for comprehensive clinical assessment.
            </p>
          </div>

          <div className="mb-10 animate-in fade-in scale-in-95 duration-1000">
            <div className="p-1 rounded-[3rem] bg-gradient-to-br from-white via-red-500/10 to-orange-500/10 shadow-[0_32px_64px_rgba(0,0,0,0.06)]">
               <div className="bg-white rounded-[2.8rem] overflow-hidden p-8 md:p-12">
                  <InjuryScanner />
               </div>
            </div>
          </div>
          
          <div className="p-10 rounded-[2.5rem] bg-black text-white text-center relative overflow-hidden group">
             <div className="relative z-10 max-w-2xl mx-auto">
                <h4 className="text-xl font-black mb-4 uppercase tracking-tight">Clinical Disclaimer</h4>
                <p className="text-xs font-bold text-white/40 uppercase tracking-[0.1em] leading-relaxed italic">
                   "This neural analysis protocol is for preliminary triage only. It does not supersede professional veterinary intervention. If an emergency is suspected, proceed to a physical clinic immediately."
                </p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full group-hover:bg-red-600/20 transition-all duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
