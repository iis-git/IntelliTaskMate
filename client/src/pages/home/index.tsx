import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { pageTransition } from '@/lib/animations';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { formatShortDate, formatTime } from '@/lib/utils';
import { Task, Alarm } from '@shared/schema';

import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import NavBar from '@/components/ui/nav-bar';
import GradientIcon from '@/components/ui/gradient-icon';
import TaskCard from '@/components/ui/task-card';
import AlarmCard from '@/components/ui/alarm-card';
import { UserIcon, TaskIcon, AlarmIcon } from '@/lib/icons';

export default function Home() {
  // Get user info
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  // Get tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  // Get alarms
  const { data: alarms = [], isLoading: alarmsLoading } = useQuery({
    queryKey: ['/api/alarms'],
  });

  // Get categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Update task completion status
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      await apiRequest('PATCH', `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Toggle alarm active status
  const toggleAlarmMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      await apiRequest('PATCH', `/api/alarms/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
    },
  });

  // Filter tasks for today
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  // Calculate task completion rate
  const completedTasks = todayTasks.filter(task => task.completed).length;
  const taskCompletionRate = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;

  // Get active alarms for today
  const activeAlarms = alarms.filter(alarm => alarm.isActive);

  // Handle task completion toggle
  const handleTaskCheck = (id: number, completed: boolean) => {
    updateTaskMutation.mutate({ id, completed });
  };

  // Find category for a task
  const getCategoryForTask = (categoryId?: number) => {
    return categories.find(cat => cat.id === categoryId);
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
              <div>
                <h1 className="text-xl font-semibold text-white">Hello, {user?.name || 'Alex'}</h1>
                <p className="text-sm text-gray-400">Here's your schedule for today</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#1A0B2E] border border-purple-400/30 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            
            {/* Today's Summary */}
            <div className="bg-[#1A0B2E] p-4 rounded-lg mb-5 border border-purple-900/30 shadow-[0_0_5px_rgba(139,92,246,0.3)]">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white font-medium">Today's Summary</h2>
                <span className="text-xs text-gray-400">{formatShortDate(new Date())}</span>
              </div>
              <div className="flex gap-3 mb-2">
                <div className="flex-1 bg-[#13091F] rounded-lg p-2 text-center">
                  <span className="text-xs text-gray-400">Tasks</span>
                  <p className="text-lg text-white font-medium">{todayTasks.length}</p>
                </div>
                <div className="flex-1 bg-[#13091F] rounded-lg p-2 text-center">
                  <span className="text-xs text-gray-400">Completed</span>
                  <p className="text-lg text-white font-medium">{completedTasks}</p>
                </div>
                <div className="flex-1 bg-[#13091F] rounded-lg p-2 text-center">
                  <span className="text-xs text-gray-400">Alarms</span>
                  <p className="text-lg text-white font-medium">{activeAlarms.length}</p>
                </div>
              </div>
              <div className="w-full bg-[#13091F] rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-1.5 rounded-full"
                  style={{ width: `${taskCompletionRate}%` }}
                ></div>
              </div>
            </div>
            
            {/* Upcoming Tasks */}
            <h2 className="text-white font-medium mb-3">Upcoming Tasks</h2>
            {tasksLoading ? (
              <div className="text-center py-4 text-gray-400">Loading tasks...</div>
            ) : todayTasks.length > 0 ? (
              <div className="space-y-3 mb-5">
                {todayTasks
                  .filter(task => !task.completed)
                  .slice(0, 3)
                  .map(task => (
                    <div key={task.id} className="bg-[#1A0B2E] p-3 rounded-lg border border-purple-900/30 flex items-center">
                      <GradientIcon 
                        icon={TaskIcon} 
                        variant={getCategoryForTask(task.categoryId)?.color === 'blue' ? 'blue' : 'purple'}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-white text-sm font-medium">{task.title}</h3>
                          <span className="text-xs text-gray-400">{formatTime(task.date)}</span>
                        </div>
                        <p className="text-xs text-gray-400">{task.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 mb-5">No tasks for today</div>
            )}
            
            {/* Today's Alarms */}
            <h2 className="text-white font-medium mb-3">Today's Alarms</h2>
            {alarmsLoading ? (
              <div className="text-center py-4 text-gray-400">Loading alarms...</div>
            ) : activeAlarms.length > 0 ? (
              <div className="space-y-3">
                {activeAlarms.slice(0, 2).map(alarm => (
                  <div key={alarm.id} className="bg-[#1A0B2E] p-3 rounded-lg border border-purple-900/30 flex justify-between items-center">
                    <div className="flex items-center">
                      <GradientIcon 
                        icon={AlarmIcon} 
                        variant={alarm.id % 2 === 0 ? 'blue' : 'purple'}
                        className="mr-3"
                      />
                      <div>
                        <h3 className="text-white text-sm font-medium">{alarm.title}</h3>
                        <p className="text-xs text-gray-400">{alarm.days || 'Once'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatTime(alarm.time)}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-400">On</span>
                        <div className="w-8 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">No alarms set for today</div>
            )}
          </div>
        </div>
        
        <NavBar />
      </motion.div>
    </MobileContainer>
  );
}
