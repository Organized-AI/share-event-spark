
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lumaService } from '@/services/lumaService';
import { useQueryClient } from '@tanstack/react-query';

interface LumaIntegrationProps {
  eventId?: string;
  onEventCreated?: (eventId: string) => void;
}

const LumaIntegration: React.FC<LumaIntegrationProps> = ({ eventId, onEventCreated }) => {
  const [lumaEventId, setLumaEventId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    event?: boolean;
    guests?: boolean;
    guestCount?: number;
    createdEventId?: string;
  }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSyncEvent = async () => {
    if (!lumaEventId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Luma Event ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await lumaService.syncEvent('new', lumaEventId);
      
      if (result.success) {
        setSyncStatus(prev => ({ 
          ...prev, 
          event: true, 
          createdEventId: result.eventId 
        }));
        
        // Invalidate events query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['events'] });
        
        // If a new event was created and we have a callback, call it
        if (result.eventId && onEventCreated) {
          onEventCreated(result.eventId);
        }
        
        toast({
          title: "Success",
          description: "Event details synced from Luma successfully",
        });
      } else {
        throw new Error(result.error || 'Failed to sync event');
      }
    } catch (error) {
      console.error('Sync event error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync event from Luma",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncGuests = async () => {
    if (!lumaEventId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Luma Event ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const targetEventId = syncStatus.createdEventId || eventId || 'new';
      const result = await lumaService.syncGuests(targetEventId, lumaEventId);
      
      if (result.success) {
        setSyncStatus(prev => ({ 
          ...prev, 
          guests: true, 
          guestCount: result.count 
        }));
        toast({
          title: "Success",
          description: `Synced ${result.count} guests from Luma successfully`,
        });
      } else {
        throw new Error(result.error || 'Failed to sync guests');
      }
    } catch (error) {
      console.error('Sync guests error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync guests from Luma",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Luma Integration
        </CardTitle>
        <CardDescription>
          Sync event details and attendee lists from your Luma event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="luma-event-id">Luma Event ID</Label>
          <Input
            id="luma-event-id"
            type="text"
            placeholder="evt-abc123..."
            value={lumaEventId}
            onChange={(e) => setLumaEventId(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Find this in your Luma event URL or API settings
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Button 
              onClick={handleSyncEvent}
              disabled={isLoading || !lumaEventId.trim()}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : syncStatus.event ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              {syncStatus.event ? 'Event Synced' : 'Sync Event Details'}
            </Button>
            {syncStatus.event && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Event details synchronized successfully
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleSyncGuests}
              disabled={isLoading || !lumaEventId.trim()}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : syncStatus.guests ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              {syncStatus.guests ? 'Guests Synced' : 'Sync Guest List'}
            </Button>
            {syncStatus.guests && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {syncStatus.guestCount} guests synchronized successfully
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> Make sure your Luma API key is configured in your Supabase Edge Function environment variables.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LumaIntegration;
