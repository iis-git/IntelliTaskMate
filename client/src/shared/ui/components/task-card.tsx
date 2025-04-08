import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task, Category } from '@shared/schema';
import { CheckIcon, EditIcon, TrashIcon } from '@/lib/icons';
import { formatTime } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onCheck?: (id: number, checked: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export function TaskCard({
  task,
  category,
  onCheck,
  onEdit,
  onDelete,
  className,
}: TaskCardProps) {
  // Determine the badge variant based on category
  const getBadgeClass = () => {
    if (!category) return 'bg-purple-500/20 text-purple-300';
    
    switch (category.color.toLowerCase()) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-300';
      case 'purple':
      default:
        return 'bg-purple-500/20 text-purple-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'bg-[#1A0B2E] p-3 rounded-lg border border-purple-900/30',
        task.completed && 'opacity-70',
        className
      )}
    >
      <div className="flex items-center mb-2">
        <button
          onClick={() => onCheck?.(task.id, !task.completed)}
          className={cn(
            'h-6 w-6 rounded-full flex items-center justify-center mr-2',
            task.completed
              ? 'bg-gradient-to-br from-purple-400 to-purple-600'
              : 'bg-[#13091F] border border-purple-400/50'
          )}
        >
          <CheckIcon className={cn(
            'h-3 w-3',
            task.completed ? 'text-white' : 'text-purple-400'
          )} />
        </button>
        
        <h3 className={cn(
          'text-white text-sm font-medium',
          task.completed && 'line-through'
        )}>
          {task.title}
        </h3>
        
        {category && (
          <span className={cn(
            'ml-auto text-xs px-2 py-1 rounded',
            getBadgeClass()
          )}>
            {category.name}
          </span>
        )}
      </div>
      
      <div className="pl-8">
        <p className={cn(
          'text-sm text-gray-400 mb-2',
          task.completed && 'line-through'
        )}>
          {task.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {formatTime(task.date)}
          </span>
          
          {task.completed ? (
            <span className="text-xs text-green-400">Completed</span>
          ) : (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className="h-6 w-6 rounded-full bg-[#13091F] border border-blue-400/30 flex items-center justify-center"
                >
                  <EditIcon className="h-3 w-3 text-blue-400" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="h-6 w-6 rounded-full bg-[#13091F] border border-red-400/30 flex items-center justify-center"
                >
                  <TrashIcon className="h-3 w-3 text-red-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;
