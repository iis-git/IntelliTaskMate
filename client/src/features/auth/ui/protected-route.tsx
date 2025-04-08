import React from 'react';
import { Route, Redirect, useRoute } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>; // Use any to handle RouteComponentProps
};

export const ProtectedRoute = ({ path, component: Component }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [isMatch] = useRoute(path);

  if (isLoading) {
    return (
      <Route path={path}>
        {params => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-border" />
          </div>
        )}
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        {params => <Redirect to="/auth" />}
      </Route>
    );
  }

  return (
    <Route path={path}>
      {params => <Component {...params} />}
    </Route>
  );
};