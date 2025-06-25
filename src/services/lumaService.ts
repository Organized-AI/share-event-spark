
import { supabase } from "@/integrations/supabase/client";

export interface LumaSyncResponse {
  success: boolean;
  data?: any;
  count?: number;
  error?: string;
}

export const lumaService = {
  async syncEvent(eventId: string, lumaEventId: string): Promise<LumaSyncResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('luma-api-integration', {
        body: {
          action: 'sync_event',
          eventId,
          lumaEventId,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke function');
      }

      return data;
    } catch (error) {
      console.error('Error syncing event from Luma:', error);
      throw error;
    }
  },

  async syncGuests(eventId: string, lumaEventId: string): Promise<LumaSyncResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('luma-api-integration', {
        body: {
          action: 'sync_guests',
          eventId,
          lumaEventId,
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
