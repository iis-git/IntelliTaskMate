import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Alarm } from '@shared/schema';
import { NotificationIcon } from '@/lib/icons';
import { formatAMPM } from '@/lib/date-utils';
import { Switch } from '@/components/ui/switch';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle?: (id: number, isActive: boolean) => void;
  onEdit?: (alarm: Alarm) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export function AlarmCard({
  alarm,
  onToggle,
  onEdit,
  onDelete,
  className,
}: AlarmCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'bg-[#1A0B2E] p-4 rounded-lg border border-purple-900/30 flex justify-between items-center',
        !alarm.isActive && 'opacity-60',
        className
      )}
      onClick={() => onEdit?.(alarm)}
    >
      <div className="flex items-center">
        <div className={cn(
          'h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 mr-3',
          alarm.isActive 
            ? 'bg-gradient-to-br from-purple-400 to-purple-600'
            : 'bg-gray-700'
        )}>
          <NotificationIcon className={cn(
            'h-6 w-6',
            alarm.isActive ? 'text-white' : 'text-gray-400'
          )} />
        </div>
        
        <div>
          <h3 className="text-white font-medium">{alarm.title}</h3>
          <p className="text-sm text-gray-400">{alarm.days || 'Once'}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-white font-medium">{formatAMPM(alarm.time)}</p>
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-gray-400">
            {alarm.isActive ? 'On' : 'Off'}
          </span>
          
          <Switch
            checked={alarm.isActive}
            onCheckedChange={() => onToggle?.(alarm.id, !alarm.isActive)}
            className={cn(
              'w-10 h-5',
              alarm.isActive && 'bg-gradient-to-r from-purple-400 to-purple-600'
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default AlarmCard;
