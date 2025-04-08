import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@shared/schema';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'flex items-start gap-2 max-w-[85%]',
        message.isUser ? 'self-end ml-auto' : '',
        className
      )}
    >
      {!message.isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback gradient>A</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        'p-3 rounded-lg',
        message.isUser 
          ? 'bg-gradient-to-br from-purple-400 to-purple-600 rounded-tr-none'
          : 'bg-[#1A0B2E] rounded-tl-none'
      )}>
        <p className={cn(
          'text-sm',
          message.isUser ? 'text-white' : 'text-gray-300'
        )}>
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}

export default ChatMessage;
