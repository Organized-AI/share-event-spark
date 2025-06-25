
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Hash, Users, FolderOpen, Loader2, RefreshCw } from 'lucide-react';
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
  created_at: string;
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const queryClient = useQueryClient();

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('Fetching events from database...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      console.log('Fetched events:', data);
      return data as Event[];
    },
  });

  const handleRefresh = () => {
    console.log('Manually refreshing events...');
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Error loading events</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {events?.length || 0} event{events?.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {!events || events.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No events yet</h3>
                <p className="text-muted-foreground">Create your first event to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {event.name}
                  {event.luma_event_id && (
                    <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      Luma
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  {event.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  className="w-full flex items-center gap-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  Open Event Dashboard
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
