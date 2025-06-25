
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Users, FolderOpen, Download } from 'lucide-react';
import CreateEventForm from '@/components/CreateEventForm';
import EventList from '@/components/EventList';
import EventDashboard from '@/components/EventDashboard';
import LumaIntegration from '@/components/LumaIntegration';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLumaSync, setShowLumaSync] = useState(false);

  const handleEventSelect = (eventId: string) => {
    console.log('Event selected:', eventId);
    setSelectedEventId(eventId);
    setActiveTab('dashboard');
  };

  const handleEventCreated = async (eventId: string) => {
    console.log('Event created with ID:', eventId);
    setShowCreateForm(false);
    setShowLumaSync(false);
    
    // Add a small delay to ensure database consistency before navigation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    handleEventSelect(eventId);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Event Management</h1>
          <p className="text-xl text-gray-300">
            Create and manage your events with template-based content organization
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
            <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300">
              <Calendar className="h-4 w-4" />
              My Events
            </TabsTrigger>
            <TabsTrigger value="dashboard" disabled={!selectedEventId} className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300 disabled:text-gray-600">
              <FolderOpen className="h-4 w-4" />
              Event Dashboard
            </TabsTrigger>
            <TabsTrigger value="participants" disabled={!selectedEventId} className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300 disabled:text-gray-600">
              <Users className="h-4 w-4" />
              Participants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Your Events</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowLumaSync(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <Download className="h-4 w-4" />
                  Import from Luma
                </Button>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Button>
              </div>
            </div>

            {showLumaSync && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Import Event from Luma</CardTitle>
                  <CardDescription className="text-gray-300">
                    Sync an existing event from Luma with all its details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LumaIntegration 
                    onEventCreated={handleEventCreated}
                  />
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowLumaSync(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {showCreateForm && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Create New Event</CardTitle>
                  <CardDescription className="text-gray-300">
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
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Event Participants</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage roles and permissions for event participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Participant management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventManagement;
