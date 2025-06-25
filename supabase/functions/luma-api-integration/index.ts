
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
      'x-luma-api-key': lumaApiKey,
      'accept': 'application/json',
    };

    if (action === 'sync_event') {
      // Fetch event details from Luma using public API
      const eventResponse = await fetch(`https://public-api.lu.ma/public/v1/event/get?event_api_id=${lumaEventId}`, {
        headers: lumaHeaders,
      });

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        console.error('Luma API error response:', errorText);
        throw new Error(`Luma API error: ${eventResponse.status} ${eventResponse.statusText} - ${errorText}`);
      }

      const eventData = await eventResponse.json();
      console.log('Event synced from Luma:', eventData);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            name: eventData.name || eventData.title,
            description: eventData.description,
            date: eventData.start_at || eventData.start_time,
            location: eventData.location?.address || eventData.location,
            cover_image_url: eventData.cover_url || eventData.cover_image_url,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'sync_guests') {
      // Fetch guest list from Luma using public API
      const guestsResponse = await fetch(`https://public-api.lu.ma/public/v1/event/get-guests?event_api_id=${lumaEventId}`, {
        headers: lumaHeaders,
      });

      if (!guestsResponse.ok) {
        const errorText = await guestsResponse.text();
        console.error('Luma API error response:', errorText);
        throw new Error(`Luma API error: ${guestsResponse.status} ${guestsResponse.statusText} - ${errorText}`);
      }

      const guestsData = await guestsResponse.json();
      const guestCount = guestsData.entries?.length || guestsData.guests?.length || 0;
      
      console.log(`Synced ${guestCount} guests from Luma`);

      return new Response(
        JSON.stringify({
          success: true,
          count: guestCount,
          data: guestsData.entries || guestsData.guests || [],
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
