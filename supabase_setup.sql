-- 1. Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop the table if it exists to ensure a clean setup
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- 3. Create the testimonials table
CREATE TABLE public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 5. Policies setup

-- A. Public Read Access (Modified to allow admin dashboard to see pending)
CREATE POLICY "Public can view approved testimonials"
ON public.testimonials FOR SELECT
USING (true);

-- B. Unified Insert Policy (Allows both guests and users)
CREATE POLICY "Anyone can insert testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (
  (auth.role() = 'authenticated' AND (user_id = auth.uid() OR user_id IS NULL)) OR
  (auth.role() = 'anon' AND user_id IS NULL)
);

-- C. Admin Management (Allows frontend admin to modify)
CREATE POLICY "Admin full access"
ON public.testimonials FOR ALL
USING (true)
WITH CHECK (true);

-- 7. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_cta_text TEXT,
    hero_secondary_cta_text TEXT,
    featured_author_name TEXT,
    featured_author_rating TEXT,
    total_readers_count TEXT,
    authors_count_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings if not exists
INSERT INTO public.site_settings (
    id, hero_title, hero_subtitle, hero_description, hero_cta_text, hero_secondary_cta_text, 
    featured_author_name, featured_author_rating, total_readers_count, authors_count_text
) VALUES (
    1, 
    'ডিজিটাল প্রকাশনীর মাধ্যমে', 
    'আপনার সৃজনশীলতা প্রকাশ করুন', 
    'আমাদের প্লাটফর্মের মাধ্যমে আপনার লেখা বই পৌঁছে দিন হাজার হাজার পাঠকের কাছে। আমরা দিচ্ছি সবচেয়ে সহজ এবং লাভজনক প্রকাশনা ব্যবস্থা।', 
    'লেখক হিসেবে যুক্ত হোন', 
    'বইগুলো দেখুন', 
    'আহমেদ শরীফ', 
    '৪.৯', 
    '১২,৫০০+', 
    '৫০০+'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
USING (true);

-- Allow authenticated users (Admins) to update
CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
