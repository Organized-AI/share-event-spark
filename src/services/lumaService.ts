
import { supabase } from "@/integrations/supabase/client";

export interface LumaSyncResponse {
  success: boolean;
  data?: any;
  count?: number;
  error?: string;
  eventId?: string;
  message?: string;
}

export const lumaService = {
  async syncEvent(eventId: string, lumaEventId: string): Promise<LumaSyncResponse> {
    try {
      // Validate Luma Event ID format
      if (!lumaEventId || !lumaEventId.match(/^evt-[a-zA-Z0-9]+$/)) {
        throw new Error('Invalid Luma Event ID format. Expected format: evt-xxxxx');
      }

      const { data, error } = await supabase.functions.invoke('luma-api-integration', {
        body: {
          action: 'sync_event',
          eventId,
          lumaEventId: lumaEventId.trim(),
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke function');
      }

      console.log('Sync event response:', data);
      return data;
    } catch (error) {
      console.error('Error syncing event from Luma:', error);
      throw error;
    }
  },

  async syncGuests(eventId: string, lumaEventId: string): Promise<LumaSyncResponse> {
    try {
      // Validate Luma Event ID format
      if (!lumaEventId || !lumaEventId.match(/^evt-[a-zA-Z0-9]+$/)) {
        throw new Error('Invalid Luma Event ID format. Expected format: evt-xxxxx');
      }

      const { data, error } = await supabase.functions.invoke('luma-api-integration', {
        body: {
          action: 'sync_guests',
          eventId,
          lumaEventId: lumaEventId.trim(),
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke function');
      }

      return data;
    } catch (error) {
      console.error('Error syncing guests from Luma:', error);
      throw error;
    }
  },
};
