import { apiRequest } from "@/lib/queryClient";

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

/**
 * Fetches the user settings from the server
 */
export async function getUserSettings(): Promise<UserSettings> {
  const response = await apiRequest("GET", "/api/settings");
  return response.json();
}

/**
 * Updates the user settings on the server
 */
export async function updateUserSettings(settings: UpdateUserSettings): Promise<UserSettings> {
  const response = await apiRequest("PATCH", "/api/settings", settings);
  return response.json();
}