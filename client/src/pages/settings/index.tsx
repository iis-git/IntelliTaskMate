import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const { user } = useAuth();
  const [formValues, setFormValues] = useState({
    darkMode: true,
    notifications: true,
    aiSuggestions: true, 
    autoTaskCreation: true,
    calendarSync: false
  });

  // Update local state when settings load
  useEffect(() => {
    if (settings) {
      setFormValues({
        darkMode: settings.darkMode,
        notifications: settings.notifications,
        aiSuggestions: settings.aiSuggestions,
        autoTaskCreation: settings.autoTaskCreation,
        calendarSync: settings.calendarSync
      });
    }
  }, [settings]);

  const handleToggle = (setting: keyof typeof formValues) => {
    const newValue = !formValues[setting];
    setFormValues({
      ...formValues,
      [setting]: newValue
    });
    updateSettings({ [setting]: newValue });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/20 rounded-full p-4 text-primary font-bold text-xl">
                {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-medium">{user?.name || user?.username}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>App Preferences</CardTitle>
          <CardDescription>Customize your Aura experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use a darker color theme</p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={formValues.darkMode}
              onCheckedChange={() => handleToggle('darkMode')}
              disabled={isUpdating}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive reminders and alerts</p>
            </div>
            <Switch 
              id="notifications" 
              checked={formValues.notifications}
              onCheckedChange={() => handleToggle('notifications')}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
          <CardDescription>Control Aura's AI capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-suggestions">AI Suggestions</Label>
              <p className="text-sm text-muted-foreground">Allow Aura to offer suggestions based on your usage</p>
            </div>
            <Switch 
              id="ai-suggestions" 
              checked={formValues.aiSuggestions}
              onCheckedChange={() => handleToggle('aiSuggestions')}
              disabled={isUpdating}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-task-creation">Automatic Task Creation</Label>
              <p className="text-sm text-muted-foreground">Let AI create tasks from your conversations</p>
            </div>
            <Switch 
              id="auto-task-creation" 
              checked={formValues.autoTaskCreation}
              onCheckedChange={() => handleToggle('autoTaskCreation')}
              disabled={isUpdating}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="calendar-sync">Calendar Sync</Label>
              <p className="text-sm text-muted-foreground">Sync tasks with your calendar</p>
            </div>
            <Switch 
              id="calendar-sync" 
              checked={formValues.calendarSync}
              onCheckedChange={() => handleToggle('calendarSync')}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Changes are saved automatically. Aura uses your preferences to personalize your experience.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}