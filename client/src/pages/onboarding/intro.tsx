import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import Logo from '@/components/ui/logo';
import GradientIcon from '@/components/ui/gradient-icon';
import { Button } from '@/components/ui/button';
import { TaskIcon, AlarmIcon, ChatIcon } from '@/lib/icons';

export default function OnboardingIntro() {
  const [_, navigate] = useLocation();

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
            <div className="h-[180px] mb-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
              <Logo size="lg" />
            </div>
            
            <h1 className="text-2xl font-semibold text-white text-center mb-2">Aura</h1>
            <p className="text-center text-gray-300 mb-6">
              Your personal AI assistant for productivity and wellness
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <GradientIcon icon={TaskIcon} size="sm" variant="purple" className="mt-1" />
                <div>
                  <h3 className="text-white font-medium">Smart Task Manager</h3>
                  <p className="text-sm text-gray-400">Get AI recommendations for task organization</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <GradientIcon icon={AlarmIcon} size="sm" variant="blue" className="mt-1" />
                <div>
                  <h3 className="text-white font-medium">Intelligent Alarms</h3>
                  <p className="text-sm text-gray-400">Set optimal times for alarms based on your schedule</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <GradientIcon icon={ChatIcon} size="sm" variant="purple" className="mt-1" />
                <div>
                  <h3 className="text-white font-medium">AI Chat Assistant</h3>
                  <p className="text-sm text-gray-400">Chat with your AI to create tasks and alarms automatically</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => navigate("/onboarding/tasks")}
            className="w-full py-7 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all hover:opacity-90"
          >
            Get Started
          </Button>
        </div>
      </motion.div>
    </MobileContainer>
  );
}
