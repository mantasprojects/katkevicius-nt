-- Migration script to add 'proposals' table for Commercial Proposals feature

CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id BIGINT REFERENCES public.properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Allow public read access (if needed for client review) or restrict to authenticated admin
CREATE POLICY "Allow public read access to proposals" ON public.proposals FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access to proposals" ON public.proposals FOR ALL USING (auth.role() = 'authenticated');

-- Create a trigger to auto-update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_proposals_modtime
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
