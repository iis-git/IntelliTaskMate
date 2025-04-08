import React, { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";

// Import SCSS styles instead of Tailwind
import "./styles/main.scss";

// Pages
import OnboardingIntro from "@/pages/onboarding/intro";
import OnboardingTasks from "@/pages/onboarding/tasks";
import OnboardingAssistant from "@/pages/onboarding/assistant";
import AppRouter from "@/app/router";

function App() {
  const [location] = useLocation();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(
    localStorage.getItem("aura-onboarded") === "true"
  );

  const completeOnboarding = () => {
    localStorage.setItem("aura-onboarded", "true");
    setHasOnboarded(true);
  };

  useEffect(() => {
    // Apply additional global styles
    document.body.classList.add("bg-background");
    return () => {
      document.body.classList.remove("bg-background");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AnimatePresence mode="wait">
            {!hasOnboarded ? (
              <Switch location={location} key={location}>
                <Route path="/" component={() => <OnboardingIntro />} />
                <Route path="/onboarding/tasks" component={() => <OnboardingTasks />} />
                <Route path="/onboarding/assistant" component={() => <OnboardingAssistant onComplete={completeOnboarding} />} />
              </Switch>
            ) : (
              <AppRouter />
            )}
          </AnimatePresence>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
