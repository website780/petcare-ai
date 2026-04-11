import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import React, { Suspense, lazy } from 'react';
import { useAuth } from "@/contexts/auth-context";

// Lazy loaded routes for bundle optimization
const InjuryScannerPage = lazy(() => import("@/pages/injury-scanner"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const PetProfile = lazy(() => import("@/pages/pet-profile"));
const PetDetails = lazy(() => import("@/pages/pet-details"));
const NutritionalGuide = lazy(() => import("@/pages/nutritional-guide"));
const VetAssessment = lazy(() => import("@/pages/vet-assessment"));
const GroomingGuide = lazy(() => import("@/pages/grooming-guide"));
const RemindersSchedule = lazy(() => import("@/pages/reminders-schedule"));
const TrainingGuide = lazy(() => import("@/pages/training-guide"));
const VaccinationRecords = lazy(() => import("@/pages/vaccination-records"));
const UserProfile = lazy(() => import("@/pages/user-profile"));
const PhotoTutorialPage = lazy(() => import("@/pages/photo-tutorial"));
const PetPortraits = lazy(() => import("@/pages/pet-portraits"));
const VetStandalonePage = lazy(() => import("@/pages/vet-standalone"));
const SuccessPage = lazy(() => import("@/pages/success"));
const CancelPage = lazy(() => import("@/pages/cancel"));

function PrivateRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/";
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen w-full bg-[#f8faFC] dark:bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/scan" component={InjuryScannerPage} />
        <Route path="/vet" component={VetStandalonePage} />
        <Route path="/success" component={SuccessPage} />
        <Route path="/cancel" component={CancelPage} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        
        {/* Core Pet Care Routes */}
        <Route
          path="/pet/:id"
          component={() => {
            const Component = () => <PetProfile />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/nutrition"
          component={() => {
            const Component = () => <NutritionalGuide />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/vet"
          component={() => {
            const Component = () => <VetAssessment />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/grooming"
          component={() => {
            const Component = () => <GroomingGuide />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/schedule"
          component={() => {
            const Component = () => <RemindersSchedule />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/training"
          component={() => {
            const Component = () => <TrainingGuide />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/details"
          component={() => {
            const Component = () => <PetDetails />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route
          path="/pet/:id/vaccinations"
          component={() => {
            const Component = () => <VaccinationRecords />;
            return <PrivateRoute component={Component} />;
          }}
        />
        <Route 
          path="/profile" 
          component={() => (
            <PrivateRoute component={UserProfile} />
          )} 
        />
        <Route path="/photo-tutorial" component={PhotoTutorialPage} />
        <Route path="/pet-portraits" component={() => <PrivateRoute component={PetPortraits} />} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppLayout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#f8faFC] dark:bg-black transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      </div>
      <main className="flex-1 relative z-10 w-full overflow-x-hidden">
        <Router />
      </main>
      
      {user && (
        <footer className="w-full bg-[#0a0a0a] text-white py-10 px-4 md:px-8 relative z-50 mt-auto border-t border-white/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex flex-col items-start cursor-pointer">
                <img src="/assets/Brand-Guidelines-for-Pet-Care-AI-3-1.png" alt="Pet Care AI Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-gray-400 text-xs text-center md:text-left mt-1 max-w-sm">
                Your pet's silent needs, voiced through AI.<br />
                All rights reserved - 2026 - PetCare AI
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 xl:gap-8">
              <a href="/" className="text-sm font-semibold text-gray-300 hover:text-[#ff6b4a] transition-colors">AI Scan</a>
              <a href="/pet-portraits" className="text-sm font-semibold text-gray-300 hover:text-[#ff6b4a] transition-colors">AI Portraits</a>
              <a href="/vet" className="text-sm font-semibold text-gray-300 hover:text-[#ff6b4a] transition-colors">AI Vet</a>
              <a href="/scan" className="text-sm font-semibold text-gray-300 hover:text-[#ff6b4a] transition-colors">Injury Scanner</a>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-6">
              <div className="flex items-center gap-5">
                <a href="#" className="text-[#ff6b4a] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </a>
                <a href="#" className="text-[#ff6b4a] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-[#ff6b4a] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                </a>
              </div>

              <button 
                className="w-12 h-12 bg-[#ff6b4a] hover:bg-[#e05a3b] text-white rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 shadow-lg group border-2 border-white/10" 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-0 group-hover:-translate-y-1 transition-transform"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span className="text-[8px] font-black uppercase tracking-tighter">Top</span>
              </button>
            </div>
            
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;