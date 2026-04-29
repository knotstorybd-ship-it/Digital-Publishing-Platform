-- Digital Publishing Platform - Full Supabase Setup
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (User details)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    avatar TEXT,
    bio TEXT,
    is_writer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Authors Table (Writer details)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- 4. Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    cover TEXT,
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

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Testimonials Table
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

-- Insert default settings
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

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 9. Policies

-- A. Profiles
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- B. Authors
CREATE POLICY "Authors are viewable by everyone" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admin can manage authors" ON public.authors FOR ALL USING (true);

-- C. Books
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Admin can manage books" ON public.books FOR ALL USING (true);

-- D. Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- E. Testimonials
CREATE POLICY "Anyone can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Anyone can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage testimonials" ON public.testimonials FOR ALL USING (true);

-- F. Site Settings
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR UPDATE USING (true);

-- 10. Realtime Setup
-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER PUBLICATION supabase_realtime ADD TABLE public.authors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 11. bKash Payments Table
CREATE TABLE IF NOT EXISTS public.bkash_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id TEXT,
    user_id UUID REFERENCES auth.users(id),
    name TEXT,
    phone TEXT,
    trx_id TEXT UNIQUE,
    amount INTEGER,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bkash_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own bkash payments" ON public.bkash_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own bkash payments" ON public.bkash_payments FOR SELECT USING (auth.uid() = user_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.bkash_payments;
