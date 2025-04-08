import React, { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";

// Pages
import OnboardingIntro from "@/pages/onboarding/intro";
import OnboardingTasks from "@/pages/onboarding/tasks";
import OnboardingAssistant from "@/pages/onboarding/assistant";
import Home from "@/pages/home";
import Tasks from "@/pages/tasks";
import Alarms from "@/pages/alarms";
import Chat from "@/pages/chat";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(
    localStorage.getItem("aura-onboarded") === "true"
  );

  const completeOnboarding = () => {
    localStorage.setItem("aura-onboarded", "true");
    setHasOnboarded(true);
  };

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        {!hasOnboarded ? (
          <>
            <Route path="/" component={() => <OnboardingIntro />} />
            <Route path="/onboarding/tasks" component={() => <OnboardingTasks />} />
            <Route path="/onboarding/assistant" component={() => <OnboardingAssistant onComplete={completeOnboarding} />} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/alarms" component={Alarms} />
            <Route path="/chat" component={Chat} />
            <Route path="/settings" component={Settings} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    // Apply additional global styles
    document.body.classList.add("bg-background");
    return () => {
      document.body.classList.remove("bg-background");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
