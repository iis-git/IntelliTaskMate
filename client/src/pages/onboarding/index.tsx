import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationCard from '@/components/ui/notification-card';

interface OnboardingAssistantProps {
  onComplete: () => void;
}

export default function OnboardingAssistant({ onComplete }: OnboardingAssistantProps) {
  const [_, navigate] = useLocation();

  const handleGetStarted = () => {
    onComplete();
    navigate("/");
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
        
        <div className="flex flex-col items-center justify-between h-[550px] py-6 px-4">
          <div className="w-full">
            <div className="h-[180px] mb-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30">
              {/* Background image placeholder */}
            </div>
            
            <h1 className="text-2xl font-semibold text-white text-center mb-2">AI Assistant</h1>
            <p className="text-center text-gray-300 mb-6">
              Chat with Aura to manage tasks, set alarms, and get personalized advice
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[#1A0B2E] rounded-lg p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback gradient>A</AvatarFallback>
                    </Avatar>
                    <div className="bg-[#13091F] p-3 rounded-lg rounded-tl-none">
                      <p className="text-sm text-gray-300">
                        Hi there! I'm Aura, your personal AI assistant. How can I help you today?
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 max-w-[85%] self-end">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-lg rounded-tr-none">
                      <p className="text-sm text-white">
                        I need to schedule a doctor's appointment tomorrow at 2pm
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback gradient>A</AvatarFallback>
                    </Avatar>
                    <div className="bg-[#13091F] p-3 rounded-lg rounded-tl-none">
                      <p className="text-sm text-gray-300">
                        I've added a task for your doctor's appointment tomorrow at 2:00 PM. Would you like me to set a reminder as well?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <NotificationCard
                type="task"
                title="Doctor's appointment"
                time="Tomorrow at 2:00 PM"
              />
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <Button
              onClick={handleGetStarted}
              className="w-full py-6 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all hover:opacity-90"
            >
              Get Started
            </Button>
            
            <Button
              onClick={() => navigate("/onboarding/tasks")}
              variant="outline"
              className="w-full py-6 rounded-lg bg-[#1A0B2E] text-gray-300 font-medium border border-gray-700 transition-all hover:bg-[#13091F]"
            >
              Back
            </Button>
          </div>
        </div>
      </motion.div>
    </MobileContainer>
  );
}
