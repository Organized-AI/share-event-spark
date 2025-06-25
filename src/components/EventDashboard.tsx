
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Handshake, 
  UserCheck, 
  Heart, 
  Camera, 
  Bot,
  Upload,
  Eye,
  Hash,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ContentFolder } from '@/types/event';
import LumaIntegration from '@/components/LumaIntegration';

interface EventDashboardProps {
  eventId: string;
}

interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  luma_event_id: string | null;
  luma_event_url: string | null;
  cover_image_url: string | null;
}

const contentFolders: ContentFolder[] = [
  {
    id: 'speakers',
    name: 'Speakers',
    type: 'speakers',
    description: 'Speaker presentations, bios, and photos',
    icon: '📢',
  },
  {
    id: 'sponsors',
    name: 'Sponsors',
    type: 'sponsors',
    description: 'Sponsor logos, materials, and promotional content',
    icon: '🤝',
  },
  {
    id: 'attendees',
    name: 'Attendees',
    type: 'attendees',
    description: 'Attendee photos, networking materials',
    icon: '🎭',
  },
  {
    id: 'volunteers',
    name: 'Volunteers',
    type: 'volunteers',
    description: 'Volunteer coordination and resources',
    icon: '🙋',
  },
  {
    id: 'atmosphere',
    name: 'Atmosphere',
    type: 'atmosphere',
    description: 'Event photos, videos, and atmosphere content',
    icon: '🌟',
  },
  {
    id: 'ai-content',
    name: 'AI Content',
    type: 'ai-content',
    description: 'AI-generated content via Texel.ai integration',
    icon: '🤖',
  },
];

const getIconComponent = (type: string) => {
  switch (type) {
    case 'speakers': return Users;
    case 'sponsors': return Handshake;
    case 'attendees': return UserCheck;
    case 'volunteers': return Heart;
    case 'atmosphere': return Camera;
    case 'ai-content': return Bot;
    default: return Upload;
  }
};

const EventDashboard: React.FC<EventDashboardProps> = ({ eventId }) => {
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      return data as Event;
    },
  });

  const handleFolderClick = (folderId: string) => {
    console.log('Opening folder:', folderId, 'for event:', eventId);
    // Navigate to folder view - implement later
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !event) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Hash className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Event not found</h3>
            <p className="text-muted-foreground">The event you're looking for doesn't exist</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{event.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {event.description || 'No description available'}
              </CardDescription>
              {event.location && (
                <p className="text-sm text-muted-foreground mt-1">
                  📍 {event.location}
                </p>
              )}
            </div>
            <div className="text-right space-y-1">
              {event.luma_event_id && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4" />
                  Luma Event
                </div>
              )}
              {event.event_date && (
                <p className="text-sm text-muted-foreground">
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
              )}
              {event.luma_event_url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={event.luma_event_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Luma
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Luma Integration */}
      {event.luma_event_id && (
        <LumaIntegration eventId={event.id} />
      )}

      {/* Content Folders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Content Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contentFolders.map((folder) => {
            const IconComponent = getIconComponent(folder.type);
            return (
              <Card 
                key={folder.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleFolderClick(folder.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    {folder.name}
                  </CardTitle>
                  <CardDescription>{folder.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
