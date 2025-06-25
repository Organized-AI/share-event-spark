
import React from 'react';
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
  Hash
} from 'lucide-react';
import { ContentFolder } from '@/types/event';

interface EventDashboardProps {
  eventId: string;
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
  // Mock event data - replace with actual data from Supabase
  const mockEvent = {
    id: eventId,
    name: 'Tech Conference 2024',
    description: 'Annual technology conference with industry leaders',
    date: '2024-07-15T09:00',
    access_code: 'TECH24',
  };

  const handleFolderClick = (folderId: string) => {
    console.log('Opening folder:', folderId, 'for event:', eventId);
    // Navigate to folder view - implement later
  };

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{mockEvent.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {mockEvent.description}
              </CardDescription>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4" />
                Access Code: {mockEvent.access_code}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(mockEvent.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

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
