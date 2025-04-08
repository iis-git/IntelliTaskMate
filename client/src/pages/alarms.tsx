import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { pageTransition, staggerItems, itemAnimation } from '@/lib/animations';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { Alarm } from '@shared/schema';

import MobileContainer from '@/components/ui/mobile-container';
import StatusBar from '@/components/ui/status-bar';
import NavBar from '@/components/ui/nav-bar';
import AlarmCard from '@/components/ui/alarm-card';
import AlarmForm from '@/components/forms/alarm-form';
import AIRecommendation from '@/components/ui/ai-recommendation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { formatAMPM } from '@/lib/date-utils';

export default function Alarms() {
  const { toast } = useToast();
  const [alarmFormOpen, setAlarmFormOpen] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);

  // Get alarms
  const { data: alarms = [], isLoading: alarmsLoading } = useQuery({
    queryKey: ['/api/alarms'],
  });

  // Create alarm mutation
  const createAlarmMutation = useMutation({
    mutationFn: async (newAlarm: Omit<Alarm, 'id' | 'userId'>) => {
      await apiRequest('POST', '/api/alarms', newAlarm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({
        title: 'Alarm created',
        description: 'Your alarm has been created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create alarm. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update alarm mutation
  const updateAlarmMutation = useMutation({
    mutationFn: async ({ id, ...alarm }: Partial<Alarm> & { id: number }) => {
      await apiRequest('PATCH', `/api/alarms/${id}`, alarm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({
        title: 'Alarm updated',
        description: 'Your alarm has been updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update alarm. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete alarm mutation
  const deleteAlarmMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/alarms/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({
        title: 'Alarm deleted',
        description: 'Your alarm has been deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete alarm. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle creating/updating an alarm
  const handleSubmitAlarm = (alarm: Omit<Alarm, 'id' | 'userId'>) => {
    if (selectedAlarm) {
      updateAlarmMutation.mutate({ id: selectedAlarm.id, ...alarm });
    } else {
      createAlarmMutation.mutate(alarm);
    }
    setSelectedAlarm(null);
  };

  // Handle alarm toggle
  const handleAlarmToggle = (id: number, isActive: boolean) => {
    updateAlarmMutation.mutate({ id, isActive });
  };

  // Handle alarm edit
  const handleEditAlarm = (alarm: Alarm) => {
    setSelectedAlarm(alarm);
    setAlarmFormOpen(true);
  };

  // Handle AI recommendation
  const handleAddRecommendation = (recommendation: { title: string, time: Date }) => {
    createAlarmMutation.mutate({
      title: recommendation.title,
      time: recommendation.time,
      days: 'Once',
      isActive: true,
    });
  };

  // AI alarm recommendations - simulating AI suggestions
  const alarmRecommendations = [
    {
      id: 'rec1',
      title: 'Preparation for client call',
      subtitle: 'Tomorrow at 9:30 AM',
      onClick: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 30, 0, 0);
        handleAddRecommendation({
          title: 'Preparation for client call',
          time: tomorrow
        });
      }
    },
    {
      id: 'rec2',
      title: 'Project deadline reminder',
      subtitle: 'Friday at 2:00 PM',
      onClick: () => {
        const friday = new Date();
        const dayOfWeek = friday.getDay();
        const daysToAdd = (5 + 7 - dayOfWeek) % 7; // 5 is Friday
        friday.setDate(friday.getDate() + daysToAdd);
        friday.setHours(14, 0, 0, 0);
        handleAddRecommendation({
          title: 'Project deadline reminder',
          time: friday
        });
      }
    }
  ];

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
              <h1 className="text-xl font-semibold text-white">Alarms</h1>
              <Button 
                onClick={() => {
                  setSelectedAlarm(null);
                  setAlarmFormOpen(true);
                }}
                className="h-9 w-9 p-0 rounded-full bg-[#1A0B2E] border border-purple-400/30"
              >
                <PlusIcon className="h-5 w-5 text-purple-400" />
              </Button>
            </div>
            
            {/* Alarms List */}
            {alarmsLoading ? (
              <div className="text-center py-4 text-gray-400">Loading alarms...</div>
            ) : alarms.length > 0 ? (
              <motion.div 
                className="space-y-4 mb-6"
                variants={staggerItems}
                initial="hidden"
                animate="visible"
              >
                {alarms.map(alarm => (
                  <motion.div key={alarm.id} variants={itemAnimation}>
                    <AlarmCard
                      alarm={alarm}
                      onToggle={handleAlarmToggle}
                      onEdit={handleEditAlarm}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-4 text-gray-400 mb-6">
                No alarms set
              </div>
            )}
            
            {/* AI Recommendations */}
            <AIRecommendation
              title="AI Recommendations"
              items={alarmRecommendations}
              className="mb-4"
            />
          </div>
        </div>
        
        <NavBar />
        
        {/* Alarm Form Dialog */}
        <AlarmForm
          open={alarmFormOpen}
          onOpenChange={setAlarmFormOpen}
          onSubmit={handleSubmitAlarm}
          defaultValues={selectedAlarm ? {
            ...selectedAlarm,
            time: new Date(selectedAlarm.time)
          } : undefined}
        />
      </motion.div>
    </MobileContainer>
  );
}
