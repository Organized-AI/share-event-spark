
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation functions
const validateLumaEventId = (eventId: string): boolean => {
  return /^evt-[a-zA-Z0-9]+$/.test(eventId);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, eventId, lumaEventId } = await req.json();
    console.log('Luma API request:', { action, eventId, lumaEventId });

    // Validate inputs
    if (!action || !lumaEventId) {
      throw new Error('Missing required parameters: action and lumaEventId');
    }

    const sanitizedLumaEventId = sanitizeInput(lumaEventId);
    if (!validateLumaEventId(sanitizedLumaEventId)) {
      throw new Error('Invalid Luma Event ID format. Expected format: evt-xxxxx');
    }

    const lumaApiKey = Deno.env.get('LUMA_API_KEY');
    if (!lumaApiKey) {
      throw new Error('LUMA_API_KEY not configured');
    }

    const lumaHeaders = {
      'x-luma-api-key': lumaApiKey,
      'accept': 'application/json',
    };

    // Initialize Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'sync_event') {
      // Fetch event details from Luma using the correct API endpoint with api_id parameter
      const apiUrl = `https://public-api.lu.ma/public/v1/event/get?api_id=${encodeURIComponent(sanitizedLumaEventId)}`;
      console.log('Calling Luma API:', apiUrl);
      
      const eventResponse = await fetch(apiUrl, {
        headers: lumaHeaders,
      });

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        console.error('Luma API error response:', errorText);
        throw new Error(`Luma API error: ${eventResponse.status} ${eventResponse.statusText} - ${errorText}`);
      }

      const eventData = await eventResponse.json();
      console.log('Raw event data from Luma:', JSON.stringify(eventData, null, 2));

      // Handle different possible response structures
      const event = eventData.event || eventData;
      
      // Prepare event data for database storage - no organizer_id since auth is disabled
      const eventToStore = {
        name: sanitizeInput(event.name || event.title || 'Untitled Event'),
        description: sanitizeInput(event.description || event.summary || ''),
        event_date: event.start_at || event.start_time || event.when,
        location: sanitizeInput(event.geo_address_json?.address || event.location?.address || event.location || ''),
        cover_image_url: event.cover_url || event.cover_image_url || event.image_url || '',
        luma_event_id: sanitizedLumaEventId,
        luma_event_url: event.url || '',
        luma_imported: true,
        organizer_id: null, // No organizer since auth is disabled
      };

      console.log('Storing event in database:', eventToStore);

      // Check if event already exists
      const { data: existingEvent } = await supabase
        .from('events')
        .select('id')
        .eq('luma_event_id', sanitizedLumaEventId)
        .maybeSingle();

      let savedEvent;
      if (existingEvent) {
        // Update existing event
        console.log('Updating existing event:', existingEvent.id);
        const { data, error } = await supabase
          .from('events')
          .update(eventToStore)
          .eq('id', existingEvent.id)
          .select()
          .single();

        if (error) {
          console.error('Database update error:', error);
          throw new Error(`Failed to update event: ${error.message}`);
        }
        savedEvent = data;
      } else {
        // Create new event
        console.log('Creating new event for Luma import');
        const { data, error } = await supabase
          .from('events')
          .insert(eventToStore)
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          throw new Error(`Failed to create event: ${error.message}`);
        }
        savedEvent = data;
      }

      console.log('Event saved successfully:', savedEvent);

      return new Response(
        JSON.stringify({
          success: true,
          eventId: savedEvent.id,
          message: `Event "${savedEvent.name}" imported successfully from Luma`,
          data: {
            id: savedEvent.id,
            name: savedEvent.name,
            description: savedEvent.description,
            event_date: savedEvent.event_date,
            location: savedEvent.location,
            cover_image_url: savedEvent.cover_image_url,
            luma_event_id: savedEvent.luma_event_id,
            luma_event_url: savedEvent.luma_event_url,
            luma_imported: savedEvent.luma_imported,
            created_at: savedEvent.created_at,
            updated_at: savedEvent.updated_at,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'sync_guests') {
      // Fetch guest list from Luma using the correct API endpoint with api_id parameter
      const apiUrl = `https://public-api.lu.ma/public/v1/event/get-guests?api_id=${encodeURIComponent(sanitizedLumaEventId)}`;
      console.log('Calling Luma API for guests:', apiUrl);
      
      const guestsResponse = await fetch(apiUrl, {
        headers: lumaHeaders,
      });

      if (!guestsResponse.ok) {
        const errorText = await guestsResponse.text();
        console.error('Luma API error response:', errorText);
        throw new Error(`Luma API error: ${guestsResponse.status} ${guestsResponse.statusText} - ${errorText}`);
      }

      const guestsData = await guestsResponse.json();
      console.log('Raw guests data from Luma:', JSON.stringify(guestsData, null, 2));
      
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

    throw new Error('Invalid action specified');

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
