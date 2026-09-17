CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  college text NOT NULL,
  track text NOT NULL,
  team_size integer NOT NULL DEFAULT 2,
  member1_name text NOT NULL,
  member1_email text NOT NULL,
  member1_phone text NOT NULL,
  member2_name text NOT NULL,
  member2_email text NOT NULL,
  member2_phone text NOT NULL,
  member3_name text,
  member3_email text,
  member3_phone text,
  transaction_id text NOT NULL,
  payment_screenshot_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment_screenshots', 'payment_screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'payment_screenshots');

CREATE POLICY "Anyone can view payment screenshots"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'payment_screenshots');

GRANT INSERT ON public.registrations TO anon, authenticated;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(team_name) BETWEEN 1 AND 100
  AND char_length(college) BETWEEN 1 AND 150
  AND char_length(track) BETWEEN 1 AND 100
  AND team_size BETWEEN 2 AND 3
);