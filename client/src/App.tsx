import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomePage } from "@/pages/home";
import { BrowseAdsPage } from "@/pages/browse-ads";
import { CreateAdPage } from "@/pages/create-ad";
import { AdDetailPage } from "@/pages/ad-detail";
import NotFound from "@/pages/not-found";
import type { Language } from "@/lib/i18n";

function Router() {
  const [language, setLanguage] = useState<Language>("sr");

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={() => <HomePage language={language} />} />
          <Route path="/browse" component={() => <BrowseAdsPage language={language} />} />
          <Route path="/create" component={() => <CreateAdPage language={language} />} />
          <Route path="/ad/:id" component={() => <AdDetailPage language={language} />} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer language={language} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
