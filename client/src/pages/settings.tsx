import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import NavBar from '@/components/ui/nav-bar';
import GradientIcon from '@/components/ui/gradient-icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  UserIcon, DarkModeIcon, NotificationIcon, PrivacyIcon, 
  LightningIcon, TaskIcon, SliderIcon, CalendarIcon, LogoutIcon,
  ChevronRightIcon
} from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function Settings() {
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();

  // Toggle handlers (would connect to actual state in a real app)
  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: `The ${setting.toLowerCase()} setting has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  // Navigation handlers
  const handleNavigate = (section: string) => {
    toast({
      title: `Navigating to ${section}`,
      description: `You would navigate to the ${section} settings.`,
    });
  };

  return (
    <MobileContainer>
      <motion.div
        className="flex flex-col h-full"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <StatusBar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-white">Settings</h1>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center mb-6">
              <Avatar className="h-16 w-16 border-2 border-purple-400 mr-4">
                <AvatarFallback className="bg-[#1A0B2E]">
                  <UserIcon className="h-8 w-8 text-purple-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white font-medium">{user?.name || 'Alex Johnson'}</h2>
                <p className="text-sm text-gray-400">{user?.email || 'alex.johnson@example.com'}</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-purple-400 mt-1"
                  onClick={() => handleNavigate('Profile')}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
            
            {/* Settings List */}
            <div className="space-y-5">
              <div>
                <h3 className="text-sm text-gray-400 mb-2 uppercase">App Settings</h3>
                <div className="space-y-3 bg-[#1A0B2E] rounded-lg p-2">
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={DarkModeIcon} size="sm" variant="purple" className="mr-3" />
                      <span className="text-white">Dark Mode</span>
                    </div>
                    <Switch
                      checked={true}
                      onCheckedChange={(checked) => handleToggle('Dark Mode', checked)}
                      className="data-[state=checked]:bg-gradient-to-r from-purple-400 to-purple-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={NotificationIcon} size="sm" variant="blue" className="mr-3" />
                      <span className="text-white">Notifications</span>
                    </div>
                    <Switch
                      checked={true}
                      onCheckedChange={(checked) => handleToggle('Notifications', checked)}
                      className="data-[state=checked]:bg-gradient-to-r from-purple-400 to-purple-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={PrivacyIcon} size="sm" variant="purple" className="mr-3" />
                      <span className="text-white">Privacy</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => handleNavigate('Privacy')}
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-2 uppercase">AI Assistant</h3>
                <div className="space-y-3 bg-[#1A0B2E] rounded-lg p-2">
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={LightningIcon} size="sm" variant="purple" className="mr-3" />
                      <span className="text-white">AI Suggestions</span>
                    </div>
                    <Switch
                      checked={true}
                      onCheckedChange={(checked) => handleToggle('AI Suggestions', checked)}
                      className="data-[state=checked]:bg-gradient-to-r from-purple-400 to-purple-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={TaskIcon} size="sm" variant="blue" className="mr-3" />
                      <span className="text-white">Auto Task Creation</span>
                    </div>
                    <Switch
                      checked={true}
                      onCheckedChange={(checked) => handleToggle('Auto Task Creation', checked)}
                      className="data-[state=checked]:bg-gradient-to-r from-purple-400 to-purple-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={SliderIcon} size="sm" variant="purple" className="mr-3" />
                      <span className="text-white">AI Preferences</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => handleNavigate('AI Preferences')}
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-2 uppercase">Account</h3>
                <div className="space-y-3 bg-[#1A0B2E] rounded-lg p-2">
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={CalendarIcon} size="sm" variant="blue" className="mr-3" />
                      <span className="text-white">Sync with Calendar</span>
                    </div>
                    <Switch
                      checked={false}
                      onCheckedChange={(checked) => handleToggle('Calendar Sync', checked)}
                      className="data-[state=checked]:bg-gradient-to-r from-purple-400 to-purple-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                      <GradientIcon icon={LogoutIcon} size="sm" variant="purple" className="mr-3" />
                      <span className="text-white">Logout</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => {
                        logoutMutation.mutate();
                        toast({
                          title: 'Logging out',
                          description: 'You are being logged out of your account.',
                        });
                      }}
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <NavBar />
      </motion.div>
    </MobileContainer>
  );
}
