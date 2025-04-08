import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/features/auth";

// Pages
import HomePage from "@/pages/home";
import TasksPage from "@/pages/tasks";
import AlarmsPage from "@/pages/alarms";
import ChatPage from "@/pages/chat";
import SettingsPage from "@/pages/settings";
import AuthPage from "@/pages/auth-page";
import NotFoundPage from "@/pages/not-found";

export default function AppRouter() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/tasks" component={TasksPage} />
        <ProtectedRoute path="/alarms" component={AlarmsPage} />
        <ProtectedRoute path="/chat" component={ChatPage} />
        <ProtectedRoute path="/settings" component={SettingsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AnimatePresence>
  );
}