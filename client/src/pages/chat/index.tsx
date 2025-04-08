import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { pageTransition } from '@/lib/animations';
import { queryClient } from '@/lib/queryClient';
import { sendMessageToAI } from '@/lib/openai';
import { Message } from '@shared/schema';

import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import NavBar from '@/components/ui/nav-bar';
import Logo from '@/components/ui/logo';
import ChatMessage from '@/components/ui/chat-message';
import NotificationCard from '@/components/ui/notification-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmojiIcon, SendIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { formatAMPM, formatFullDate } from '@/lib/date-utils';

export default function Chat() {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'task' | 'alarm';
    title: string;
    time: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages'],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsProcessing(true);
      const response = await sendMessageToAI(content);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      
      // Check if AI created a task or alarm entity
      if (data.createdEntity) {
        const { type, data: entityData } = data.createdEntity;
        
        // Show notification for created entity
        if (type === 'task') {
          setNotification({
            type: 'task',
            title: entityData.title,
            time: formatFullDate(entityData.date),
          });
        } else if (type === 'alarm') {
          setNotification({
            type: 'alarm',
            title: entityData.title,
            time: formatAMPM(entityData.time),
          });
        }
        
        // Hide notification after a few seconds
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
      
      setIsProcessing(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isProcessing) return;
    
    sendMessageMutation.mutate(message);
    setMessage('');
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
        
        <div className="p-4 bg-[#1A0B2E] backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center">
            <Logo size="sm" className="mr-2" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#1A0B2E] to-[#13091F] space-y-6">
          {/* Conversation */}
          {messagesLoading ? (
            <div className="text-center py-4 text-gray-400">Loading conversation...</div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          ) : (
            <ChatMessage
              message={{
                id: 0,
                content: "Hi there! I'm Aura, your personal AI assistant. How can I help you today?",
                isUser: false,
                timestamp: new Date(),
                userId: 1,
              }}
            />
          )}
          
          {/* Entity creation notification */}
          <AnimatePresence>
            {notification && (
              <NotificationCard
                type={notification.type}
                title={notification.title}
                time={notification.time}
                className="max-w-xs mx-auto"
              />
            )}
          </AnimatePresence>
          
          {/* AI thinking indicator */}
          {isProcessing && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div className="bg-[#1A0B2E] p-3 rounded-lg rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-[#1A0B2E] backdrop-blur-md border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 bg-[#13091F] rounded-full py-3 px-4 flex items-center">
              <Input
                type="text"
                placeholder="Type a message..."
                className="bg-transparent border-none outline-none text-white w-full text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isProcessing}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-gray-300"
              >
                <EmojiIcon className="h-5 w-5" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || isProcessing}
              className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
            >
              <SendIcon className="h-5 w-5 text-white" />
            </Button>
          </form>
        </div>
        
        <NavBar />
      </motion.div>
    </MobileContainer>
  );
}
