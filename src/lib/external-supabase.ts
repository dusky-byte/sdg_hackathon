import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const externalSupabaseUrl = "https://ckgxnmkkgbbrncsixqaa.supabase.co";
const externalSupabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZ3hubWtrZ2Jicm5jc2l4cWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDQ1NTgsImV4cCI6MjEwNTIyMDU1OH0.m1Z3OrBURW6HFLw54uDfKz1E6yh2Oyj0USD-RbdSLwI";

export const externalSupabase = createClient<Database>(
  externalSupabaseUrl,
  externalSupabasePublishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);