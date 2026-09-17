CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  college TEXT NOT NULL,
  track TEXT NOT NULL,
  team_size INTEGER NOT NULL DEFAULT 2,
  member1_name TEXT NOT NULL,
  member1_email TEXT NOT NULL,
  member1_phone TEXT NOT NULL,
  member2_name TEXT NOT NULL,
  member2_email TEXT NOT NULL,
  member2_phone TEXT NOT NULL,
  member3_name TEXT,
  member3_email TEXT,
  member3_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.registrations TO anon;
GRANT INSERT ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
  ON public.registrations FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(team_name) BETWEEN 1 AND 100
    AND char_length(college) BETWEEN 1 AND 150
    AND char_length(track) BETWEEN 1 AND 100
    AND team_size BETWEEN 2 AND 3
  );