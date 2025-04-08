import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TaskIcon, AlarmIcon } from '@/lib/icons';

interface NotificationCardProps {
  type: 'task' | 'alarm';
  title: string;
  time: string;
  className?: string;
}

export function NotificationCard({
  type,
  title,
  time,
  className,
}: NotificationCardProps) {
  const Icon = type === 'task' ? TaskIcon : AlarmIcon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'bg-[#1A0B2E] p-3 rounded-lg border border-purple-900/30 glowing-border',
        className
      )}
    >
      <div className="flex gap-2 items-center mb-1">
        <Icon className="h-4 w-4 text-purple-400" />
        <h3 className="text-white text-sm font-medium">
          {type === 'task' ? 'New Task Created' : 'New Alarm Created'}
        </h3>
      </div>
      
      <div className="pl-6">
        <p className="text-sm text-gray-300">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </motion.div>
  );
}

export default NotificationCard;
