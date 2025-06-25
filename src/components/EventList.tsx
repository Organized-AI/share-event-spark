
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Hash, Users, FolderOpen } from 'lucide-react';

interface EventListProps {
  onEventSelect: (eventId: string) => void;
}

// Mock data - replace with actual data from Supabase
const mockEvents = [
  {
    id: 'event-1',
    name: 'Tech Conference 2024',
    description: 'Annual technology conference with industry leaders',
    date: '2024-07-15T09:00',
    access_code: 'TECH24',
    participants: 45,
  },
  {
    id: 'event-2',
    name: 'Product Launch Event',
    description: 'Exclusive launch event for our new product line',
    date: '2024-07-22T14:00',
    access_code: 'LAUNCH',
    participants: 28,
  },
];

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {mockEvents.length === 0 ? (
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
        mockEvents.map((event) => (
          <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {event.name}
                <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  {event.access_code}
                </div>
              </CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.participants} participants
                </div>
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
  );
};

export default EventList;
