import React from 'react';
import { Switch, Route } from 'wouter';
import { ProtectedRoute } from '@/features/auth';
import HomePage from '@/pages/home';
import AuthPage from '@/pages/auth-page';
import TasksPage from '@/pages/tasks';
import AlarmsPage from '@/pages/alarms';
import ChatPage from '@/pages/chat';
import SettingsPage from '@/pages/settings';
import NotFoundPage from '@/pages/not-found';

export const AppRouter: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/tasks" component={TasksPage} />
      <ProtectedRoute path="/alarms" component={AlarmsPage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default AppRouter;