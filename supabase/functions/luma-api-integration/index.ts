
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, eventId, lumaEventId } = await req.json();
    console.log('Luma API request:', { action, eventId, lumaEventId });

    const lumaApiKey = Deno.env.get('LUMA_API_KEY');
    if (!lumaApiKey) {
      throw new Error('LUMA_API_KEY not configured');
    }

    const lumaHeaders = {
      'Authorization': `Bearer ${lumaApiKey}`,
      'Content-Type': 'application/json',
    };

    if (action === 'sync_event') {
      // Fetch event details from Luma
      const eventResponse = await fetch(`https://api.lu.ma/v1/events/${lumaEventId}`, {
        headers: lumaHeaders,
      });

      if (!eventResponse.ok) {
        throw new Error(`Luma API error: ${eventResponse.status} ${eventResponse.statusText}`);
      }

      const eventData = await eventResponse.json();
      console.log('Event synced from Luma:', eventData.name);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            name: eventData.name,
            description: eventData.description,
            date: eventData.start_at,
            location: eventData.location?.address,
            cover_image_url: eventData.cover_url,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'sync_guests') {
      // Fetch guest list from Luma
      const guestsResponse = await fetch(`https://api.lu.ma/v1/events/${lumaEventId}/guests`, {
        headers: lumaHeaders,
      });

      if (!guestsResponse.ok) {
        throw new Error(`Luma API error: ${guestsResponse.status} ${guestsResponse.statusText}`);
      }

      const guestsData = await guestsResponse.json();
      const guestCount = guestsData.entries?.length || 0;
      
      console.log(`Synced ${guestCount} guests from Luma`);

      return new Response(
        JSON.stringify({
          success: true,
          count: guestCount,
          data: guestsData.entries,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Luma API integration error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
