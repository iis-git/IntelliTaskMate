import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertAlarmSchema } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Extend the alarm schema with more validation
const formSchema = insertAlarmSchema.extend({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters",
  }),
  time: z.date({ required_error: "Time is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AlarmFormProps {
  defaultValues?: Partial<FormValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
}

export function AlarmForm({
  defaultValues = {
    title: '',
    time: new Date(),
    days: 'Once',
    isActive: true,
  },
  open,
  onOpenChange,
  onSubmit,
}: AlarmFormProps) {
  const dayOptions = [
    { value: 'Once', label: 'Once' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Mon-Fri', label: 'Weekdays (Mon-Fri)' },
    { value: 'Sat-Sun', label: 'Weekends (Sat-Sun)' },
    { value: 'Mon,Wed,Fri', label: 'Mon, Wed, Fri' },
    { value: 'Tue,Thu', label: 'Tue, Thu' },
  ];

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A0B2E] text-white border-purple-900/30 max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {defaultValues.id ? 'Edit Alarm' : 'Create Alarm'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Alarm name"
                      {...field}
                      className="bg-[#13091F] border-purple-900/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value instanceof Date ? field.value.toTimeString().slice(0, 5) : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const date = new Date();
                          date.setHours(hours, minutes, 0, 0);
                          field.onChange(date);
                        }
                      }}
                      className="bg-[#13091F] border-purple-900/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#13091F] border-purple-900/30">
                        <SelectValue placeholder="Select when to repeat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1A0B2E] border-purple-900/30">
                      {dayOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-white hover:bg-purple-900/20"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Enable Alarm</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-gradient-to-r from-purple-400 to-purple-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-purple-900/30 text-white hover:bg-purple-900/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700"
              >
                {defaultValues.id ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AlarmForm;
