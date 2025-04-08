import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AIRecommendationProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    onClick: () => void;
  }>;
  className?: string;
}

export function AIRecommendation({
  title,
  items,
  className,
}: AIRecommendationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'bg-[#1A0B2E] p-4 rounded-lg border border-purple-900/30',
        className
      )}
    >
      <div className="flex items-center mb-3">
        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
          <AvatarFallback gradient>A</AvatarFallback>
        </Avatar>
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">
        Based on your routine, I recommend the following:
      </p>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-[#13091F] p-3 rounded-lg"
          >
            <div>
              <h4 className="text-sm text-white">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.subtitle}</p>
            </div>
            
            <Button
              onClick={item.onClick}
              className="px-3 py-1 h-auto text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200"
            >
              Add
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default AIRecommendation;
