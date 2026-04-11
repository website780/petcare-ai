import { Header } from "@/components/Header";
import { InjuryScanner } from "@/components/InjuryScanner";

export default function InjuryScannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Pet Injury Scanner</h1>
        <p className="text-muted-foreground mb-8">
          Upload a photo of your pet's injury or concerning area for AI-powered analysis and treatment recommendations.
          Note: This tool is for preliminary assessment only and does not replace professional veterinary care.
        </p>
        <InjuryScanner />
      </div>
    </div>
  );
}
