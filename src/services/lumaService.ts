
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface LumaSyncResponse {
  success: boolean;
  data?: any;
  count?: number;
  error?: string;
}

export const lumaService = {
  async syncEvent(eventId: string, lumaEventId: string): Promise<LumaSyncResponse> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/luma-api-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'sync_event',
          eventId,
          lumaEventId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing event from Luma:', error);
      throw error;
    }
  },

  async syncGuests(eventId: string, lumaEventId: string): Promise<LumaSyncResponse> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/luma-api-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'sync_guests',
          eventId,
          lumaEventId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing guests from Luma:', error);
      throw error;
    }
  },
};
