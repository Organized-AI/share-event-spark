
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LumaEvent {
  api_id: string;
  name: string;
  description: string;
  description_md: string;
  start_at: string;
  end_at: string;
  geo_address_json: {
    address: string;
  };
  url: string;
  cover_url?: string;
}

interface LumaGuest {
  api_id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { action, eventId, lumaEventId } = await req.json();
    console.log('Luma API request:', { action, eventId, lumaEventId });

    const lumaApiKey = Deno.env.get('LUMA_API_KEY');
    if (!lumaApiKey) {
      throw new Error('LUMA_API_KEY environment variable is not set');
    }

    if (action === 'sync_event') {
      // Fetch event details from Luma
      const lumaUrl = `https://public-api.lu.ma/public/v1/event/get?api_id=${lumaEventId}`;
      console.log('Calling Luma API:', lumaUrl);
      
      const response = await fetch(lumaUrl, {
        headers: {
          'x-luma-api-key': lumaApiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Luma API error response:', errorText);
        throw new Error(`Luma API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw event data from Luma:', JSON.stringify(data, null, 2));

      const event: LumaEvent = data.event;
      
      // Update or insert the event in our database
      const { data: updatedEvent, error: updateError } = await supabase
        .from('events')
        .upsert({
          id: eventId,
          name: event.name,
          description: event.description,
          event_date: event.start_at,
          location: event.geo_address_json?.address || null,
          luma_event_id: event.api_id,
          luma_event_url: event.url,
          cover_image_url: event.cover_url || null,
          luma_imported: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      console.log('Successfully updated event in database:', updatedEvent);

      return new Response(
        JSON.stringify({
          success: true,
          data: updatedEvent,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'sync_guests') {
      // Fetch guests from Luma
      const lumaUrl = `https://public-api.lu.ma/public/v1/event/get-guests?api_id=${lumaEventId}`;
      console.log('Calling Luma API for guests:', lumaUrl);
      
      const response = await fetch(lumaUrl, {
        headers: {
          'x-luma-api-key': lumaApiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Luma API error response:', errorText);
        throw new Error(`Luma API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw guest data from Luma:', JSON.stringify(data, null, 2));

      const guests: LumaGuest[] = data.entries || [];
      let syncedCount = 0;

      // Insert guests into event_users table
      for (const guest of guests) {
        const { error: guestError } = await supabase
          .from('event_users')
          .upsert({
            event_id: eventId,
            email: guest.email,
            display_name: guest.name,
            luma_guest_id: guest.api_id,
            role: 'attendee',
            role_source: 'luma_auto',
            last_luma_sync: new Date().toISOString(),
          }, {
            onConflict: 'event_id,email',
            ignoreDuplicates: true
          });

        if (!guestError) {
          syncedCount++;
        } else {
          console.error('Error syncing guest:', guest.email, guestError);
        }
      }

      console.log(`Successfully synced ${syncedCount} guests`);

      return new Response(
        JSON.stringify({
          success: true,
          count: syncedCount,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
