
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, Hash } from 'lucide-react';

interface CreateEventFormProps {
  onEventCreated: (eventId: string) => void;
  onCancel: () => void;
}

interface EventFormData {
  name: string;
  description: string;
  date: string;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onEventCreated, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EventFormData>({
    defaultValues: {
      name: '',
      description: '',
      date: '',
    },
  });

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      // Mock event creation - replace with actual Supabase integration
      const mockEventId = `event-${Date.now()}`;
      const accessCode = generateAccessCode();
      
      console.log('Creating event:', { ...data, accessCode });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Event Created Successfully",
        description: `Your event has been created with access code: ${accessCode}`,
      });
      
      onEventCreated(mockEventId);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Event name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter event name"
                  {...field}
                  disabled={isLoading}
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
                <Input 
                  placeholder="Brief description of your event"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          rules={{ required: "Event date is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">Access Code</p>
            <p className="text-muted-foreground">A unique access code will be generated automatically</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            Create Event
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateEventForm;
