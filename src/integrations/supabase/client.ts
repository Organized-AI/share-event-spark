// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://moqqmtmrejzzzsdctnub.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcXFtdG1yZWp6enpzZGN0bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjIxMjAsImV4cCI6MjA1OTM5ODEyMH0.NNYoIR6snV9MObZtWVFoH3PMn0kML1DngwZZk--36K0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);