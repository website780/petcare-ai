import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw } from "lucide-react";
import { Link } from "wouter";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6 text-red-500">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-md mx-auto">
          The payment process was cancelled. No charges were made. 
          If you encountered an issue, you can try again or return home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/" className="flex items-center gap-2">
              Return Home
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-[#ff6b4a] hover:bg-[#e05a3b]">
            <Link href="/scan" className="flex items-center gap-2">
              Try Again <RefreshCcw className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
