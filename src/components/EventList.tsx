
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Hash, Users, FolderOpen, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EventListProps {
  onEventSelect: (eventId: string) => void;
}

interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  luma_event_id: string | null;
  cover_image_url: string | null;
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('Fetching events list...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      console.log('Events fetched:', data);
      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <Card className="col-span-full bg-gray-900 border-gray-800">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-yellow-400" />
            <p className="text-gray-400">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full bg-gray-900 border-gray-800">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Calendar className="h-12 w-12 mx-auto text-gray-600" />
            <h3 className="text-lg font-medium text-white">Error loading events</h3>
            <p className="text-gray-400">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!events || events.length === 0 ? (
        <Card className="col-span-full bg-gray-900 border-gray-800">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 mx-auto text-gray-600" />
              <h3 className="text-lg font-medium text-white">No events yet</h3>
              <p className="text-gray-400">Create your first event to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        events.map((event) => (
          <Card key={event.id} className="cursor-pointer hover:shadow-md transition-all hover:shadow-yellow-400/20 bg-gray-900 border-gray-800 hover:border-yellow-400/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                {event.name}
                {event.luma_event_id && (
                  <div className="flex items-center gap-1 text-sm font-normal text-yellow-400">
                    <Hash className="h-3 w-3" />
                    Luma
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {event.description || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {event.event_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>
              <Button 
                onClick={() => onEventSelect(event.id)}
                className="w-full flex items-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
              >
                <FolderOpen className="h-4 w-4" />
                Open Event Dashboard
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default EventList;
