import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/shared/api/settings";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "./use-toast";

// Define types locally to avoid import issues
interface UserSettings {
  id: number;
  userId: number;
  darkMode: boolean;
  notifications: boolean;
  aiSuggestions: boolean;
  autoTaskCreation: boolean;
  calendarSync: boolean;
  updatedAt: Date;
}

interface UpdateUserSettings {
  darkMode?: boolean;
  notifications?: boolean;
  aiSuggestions?: boolean;
  autoTaskCreation?: boolean;
  calendarSync?: boolean;
}

export function useSettings() {
  const { toast } = useToast();
  
  const {
    data: settings,
    error,
    isLoading,
  } = useQuery<UserSettings, Error>({
    queryKey: ["/api/settings"],
    queryFn: getUserSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/settings"], data);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: (settings: UpdateUserSettings) => updateSettingsMutation.mutate(settings),
    isUpdating: updateSettingsMutation.isPending,
  };
}