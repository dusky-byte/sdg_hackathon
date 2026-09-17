import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const externalSupabaseUrl = "https://pzaueumdollwlnuvdmdn.supabase.co";
const externalSupabasePublishableKey =
  "sb_publishable_xFUnCwzXA7j35ThisZ57lA_numZsnEn";

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