import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { pageTransition, staggerItems, itemAnimation } from '@/lib/animations';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { Task, Category } from '@shared/schema';

import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import NavBar from '@/components/ui/nav-bar';
import TaskCard from '@/components/ui/task-card';
import TaskForm from '@/components/forms/task-form';
import { Button } from '@/components/ui/button';
import { PlusIcon, ChevronDownIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';

export default function Tasks() {
  const { toast } = useToast();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Get tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  // Get categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'userId'>) => {
      await apiRequest('POST', '/api/tasks', newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...task }: Partial<Task> & { id: number }) => {
      await apiRequest('PATCH', `/api/tasks/${id}`, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle creating/updating a task
  const handleSubmitTask = (task: Omit<Task, 'id' | 'userId'>) => {
    if (selectedTask) {
      updateTaskMutation.mutate({ id: selectedTask.id, ...task });
    } else {
      createTaskMutation.mutate(task);
    }
    setSelectedTask(null);
  };

  // Handle task completion toggle
  const handleTaskCheck = (id: number, completed: boolean) => {
    updateTaskMutation.mutate({ id, completed });
  };

  // Handle task edit
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskFormOpen(true);
  };

  // Handle task delete
  const handleDeleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  // Filter tasks based on selected filter
  const filterTasks = () => {
    if (!tasks) return [];
    
    // First filter by category or date
    let filteredTasks = [...tasks];
    
    if (filter === 'today') {
      const today = new Date();
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.date);
        return (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (filter !== 'all') {
      // Filter by category
      const categoryId = parseInt(filter);
      filteredTasks = filteredTasks.filter(task => task.categoryId === categoryId);
    }
    
    // Then separate completed and uncompleted
    const completedTasks = filteredTasks.filter(task => task.completed);
    const uncompletedTasks = filteredTasks.filter(task => !task.completed);
    
    return { completedTasks, uncompletedTasks };
  };

  const { completedTasks = [], uncompletedTasks = [] } = filterTasks();

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
              <h1 className="text-xl font-semibold text-white">Tasks</h1>
              <Button 
                onClick={() => {
                  setSelectedTask(null);
                  setTaskFormOpen(true);
                }}
                className="h-9 w-9 p-0 rounded-full bg-[#1A0B2E] border border-purple-400/30"
              >
                <PlusIcon className="h-5 w-5 text-purple-400" />
              </Button>
            </div>
            
            {/* Categories filter */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
              <Button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 h-auto rounded-full text-sm whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                    : 'bg-[#1A0B2E] text-gray-300 hover:text-white'
                }`}
              >
                All Tasks
              </Button>
              <Button
                onClick={() => setFilter('today')}
                className={`px-4 py-2 h-auto rounded-full text-sm whitespace-nowrap ${
                  filter === 'today'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                    : 'bg-[#1A0B2E] text-gray-300 hover:text-white'
                }`}
              >
                Today
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => setFilter(category.id.toString())}
                  className={`px-4 py-2 h-auto rounded-full text-sm whitespace-nowrap ${
                    filter === category.id.toString()
                      ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                      : 'bg-[#1A0B2E] text-gray-300 hover:text-white'
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Tasks List */}
            {tasksLoading ? (
              <div className="text-center py-4 text-gray-400">Loading tasks...</div>
            ) : uncompletedTasks.length > 0 ? (
              <motion.div 
                className="space-y-3 mb-4"
                variants={staggerItems}
                initial="hidden"
                animate="visible"
              >
                {uncompletedTasks.map(task => (
                  <motion.div key={task.id} variants={itemAnimation}>
                    <TaskCard
                      task={task}
                      category={getCategoryForTask(task.categoryId)}
                      onCheck={handleTaskCheck}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-4 text-gray-400 mb-4">
                No active tasks found
              </div>
            )}
            
            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <>
                <div className="mb-3 flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="h-auto p-0 flex items-center text-white font-medium hover:bg-transparent"
                  >
                    <h2 className="text-white font-medium">Completed Tasks</h2>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-400 ml-2 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showCompleted && (
                    <motion.div 
                      className="space-y-3"
                      variants={staggerItems}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {completedTasks.map(task => (
                        <motion.div key={task.id} variants={itemAnimation}>
                          <TaskCard
                            task={task}
                            category={getCategoryForTask(task.categoryId)}
                            onCheck={handleTaskCheck}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
        
        <NavBar />
        
        {/* Task Form Dialog */}
        <TaskForm
          open={taskFormOpen}
          onOpenChange={setTaskFormOpen}
          onSubmit={handleSubmitTask}
          defaultValues={selectedTask ? {
            ...selectedTask,
            date: new Date(selectedTask.date)
          } : undefined}
        />
      </motion.div>
    </MobileContainer>
  );
}
