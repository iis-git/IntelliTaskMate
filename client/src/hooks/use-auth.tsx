import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, insertUserSchema } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";
import { z } from "zod";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<LoginResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<RegisterResponse, Error, RegisterData>;
};

// Extend the insertUserSchema for registration validation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = Pick<RegisterData, "username" | "password">;

interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
}

interface RegisterResponse {
  user: Omit<User, "password">;
  token: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery<User | null, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false
  });

  // Check if we have a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("aura_token");
    
    if (!token && !isLoading && !user) {
      // No token and no user, nothing to do
      return;
    }
    
    if (token && !user && !isLoading) {
      // We have a token but no user, refetch
      refetch();
    }
  }, [user, isLoading, refetch]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData): Promise<LoginResponse> => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (data: LoginResponse) => {
      // Save token to localStorage
      localStorage.setItem("aura_token", data.token);
      
      // Update user data in cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData): Promise<RegisterResponse> => {
      const { confirmPassword, ...userData } = data;
      const res = await apiRequest("POST", "/api/auth/register", userData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (data: RegisterResponse) => {
      // Save token to localStorage
      localStorage.setItem("aura_token", data.token);
      
      // Update user data in cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // No need for an actual API call for logout with JWT
      // Just remove the token from localStorage
      localStorage.removeItem("aura_token");
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(["/api/auth/user"], null);
      
      // Invalidate all queries to force refetch
      queryClient.invalidateQueries();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}