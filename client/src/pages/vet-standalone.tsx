import { Header } from "@/components/Header";
import { VetChatStandalone } from "@/components/VetChatStandalone";
import { Stethoscope } from "lucide-react";

export default function VetStandalonePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff6b4a]/10 mb-4 text-[#ff6b4a]">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">24/7 AI Veterinary Assistant</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            "Get expert veterinary guidance for your pets in seconds. 
            Identify species, assess health concerns, and get actionable advice."
          </p>
        </div>

        <VetChatStandalone />
      </div>
    </div>
  );
}
