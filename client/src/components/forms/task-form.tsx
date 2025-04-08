import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertTaskSchema } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Extend the task schema with more validation
const formSchema = insertTaskSchema.extend({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters",
  }),
  date: z.date({ required_error: "Date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  defaultValues?: Partial<FormValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
}

export function TaskForm({
  defaultValues = {
    title: '',
    description: '',
    date: new Date(),
    completed: false,
    categoryId: 1,
  },
  open,
  onOpenChange,
  onSubmit,
}: TaskFormProps) {
  // Get categories for the select dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

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
            {defaultValues.id ? 'Edit Task' : 'Create Task'}
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
                      placeholder="Enter task title"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      {...field}
                      className="bg-[#13091F] border-purple-900/30 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#13091F] border-purple-900/30">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1A0B2E] border-purple-900/30">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="text-white hover:bg-purple-900/20"
                          >
                            {category.name}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                          field.onChange(e.target.value ? new Date(e.target.value) : null);
                        }}
                        className="bg-[#13091F] border-purple-900/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default TaskForm;
