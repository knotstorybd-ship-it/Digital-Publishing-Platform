-- Digital Publishing Platform - Full Supabase Setup
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- ==========================================================
-- 1. CLEANUP (Optional - Use only for a fresh start)
-- ==========================================================
-- DROP TABLE IF EXISTS public.bkash_payments CASCADE;
-- DROP TABLE IF EXISTS public.site_settings CASCADE;
-- DROP TABLE IF EXISTS public.testimonials CASCADE;
-- DROP TABLE IF EXISTS public.orders CASCADE;
-- DROP TABLE IF EXISTS public.books CASCADE;
-- DROP TABLE IF EXISTS public.authors CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==========================================================
-- 2. EXTENSIONS & SETUP
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 3. TABLES
-- ==========================================================

-- A. Profiles Table (User details)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    avatar TEXT,
    bio TEXT,
    is_writer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. Authors Table (Writer details)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT,
    phone TEXT,
    present_address TEXT,
    permanent_address TEXT,
    book_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.00,
    subscription_plan TEXT,
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    cover TEXT,
    pdf_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    category TEXT,
    description TEXT,
    pages INTEGER,
    language TEXT,
    published TEXT,
    reviews INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. Site Settings Table
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

-- G. bKash Payments Table
CREATE TABLE IF NOT EXISTS public.bkash_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT,
    phone TEXT,
    trx_id TEXT UNIQUE,
    amount INTEGER,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 4. DEFAULT DATA
-- ==========================================================
INSERT INTO public.site_settings (
    id, hero_title, hero_subtitle, hero_description, hero_cta_text, hero_secondary_cta_text, 
    featured_author_name, featured_author_rating, total_readers_count, authors_count_text
) VALUES (
    1, 
    'নতুন যুগের নতুন লেখকদের জন্য', 
    'আধুনিক প্রকাশনা', 
    'ডিজিটাল প্রকাশনার আধুনিক দিগন্ত। আপনার প্রতিভাকে পৌঁছে দেই লক্ষাধিক পাঠকের কাছে, স্বচ্ছ রয়্যালটি ব্যবস্থাপনায়।', 
    'লেখা শুরু করুন', 
    'লাইব্রেরি দেখুন', 
    'আরিফ রহমান', 
    '৪.৯', 
    '৫০,০০০+', 
    '১০,০০০+ লেখক যুক্ত আছেন'
) ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bkash_payments ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 6. POLICIES
-- ==========================================================

-- A. Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- B. Authors
DROP POLICY IF EXISTS "Authors are viewable by everyone" ON public.authors;
CREATE POLICY "Authors are viewable by everyone" ON public.authors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own author profile" ON public.authors;
CREATE POLICY "Users can update own author profile" ON public.authors FOR ALL USING (auth.uid() = id);

-- C. Books
DROP POLICY IF EXISTS "Books are viewable by everyone" ON public.books;
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage books" ON public.books;
CREATE POLICY "Authenticated users can manage books" ON public.books FOR ALL USING (auth.role() = 'authenticated');

-- D. Orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- E. Testimonials
DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
CREATE POLICY "Anyone can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);

-- F. Site Settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR ALL USING (true);

-- G. bKash Payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.bkash_payments;
CREATE POLICY "Users can view own payments" ON public.bkash_payments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.bkash_payments;
CREATE POLICY "Users can insert own payments" ON public.bkash_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- 7. REALTIME
-- ==========================================================
-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER PUBLICATION supabase_realtime ADD TABLE public.authors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bkash_payments;

-- ==========================================================
-- 8. STORAGE BUCKETS (Note: Run these policies AFTER creating 'book-covers' bucket in UI)
-- ==========================================================
-- Policy for public read access to book covers
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'book-covers');
-- Policy for authenticated users to upload to book covers
-- CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

