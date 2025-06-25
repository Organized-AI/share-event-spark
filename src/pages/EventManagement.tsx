
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Users, FolderOpen } from 'lucide-react';
import CreateEventForm from '@/components/CreateEventForm';
import EventList from '@/components/EventList';
import EventDashboard from '@/components/EventDashboard';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTab('dashboard');
  };

  const handleEventCreated = (eventId: string) => {
    setShowCreateForm(false);
    handleEventSelect(eventId);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Event Management</h1>
          <p className="text-xl text-muted-foreground">
            Create and manage your events with template-based content organization
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Events
            </TabsTrigger>
            <TabsTrigger value="dashboard" disabled={!selectedEventId} className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Event Dashboard
            </TabsTrigger>
            <TabsTrigger value="participants" disabled={!selectedEventId} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Events</h2>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </Button>
            </div>

            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Event</CardTitle>
                  <CardDescription>
                    Set up a new event with template-based content organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateEventForm 
                    onEventCreated={handleEventCreated}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </CardContent>
              </Card>
            )}

            <EventList onEventSelect={handleEventSelect} />
          </TabsContent>

          <TabsContent value="dashboard">
            {selectedEventId && <EventDashboard eventId={selectedEventId} />}
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Event Participants</CardTitle>
                <CardDescription>
                  Manage roles and permissions for event participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Participant management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventManagement;
