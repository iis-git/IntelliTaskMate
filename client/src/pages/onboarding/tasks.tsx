import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon } from '@/lib/icons';

export default function OnboardingTasks() {
  const [_, navigate] = useLocation();
  
  // Fetch categories for the sample tasks
  const { data: categories = [] } = useQuery({ 
    queryKey: ['/api/categories'],
  });

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
            
            <h1 className="text-2xl font-semibold text-white text-center mb-2">Task Management</h1>
            <p className="text-center text-gray-300 mb-6">
              Stay organized with AI-powered task suggestions and reminders
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[#1A0B2E] p-4 rounded-lg border border-purple-900/30 shadow-[0_0_5px_rgba(139,92,246,0.3)]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">Morning routine</h3>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {categories[0]?.name || 'Daily'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Complete morning meditation and exercise</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">7:00 AM</span>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1A0B2E] p-4 rounded-lg border border-purple-900/30 shadow-[0_0_5px_rgba(139,92,246,0.3)]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">Team meeting</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {categories[1]?.name || 'Work'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Weekly sprint planning with design team</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">10:00 AM</span>
                  <div className="h-6 w-6 rounded-full bg-[#13091F] border border-purple-500/50 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <Button
              onClick={() => navigate("/onboarding/assistant")}
              className="w-full py-6 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all hover:opacity-90"
            >
              Continue
            </Button>
            
            <Button
              onClick={() => navigate("/")}
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
