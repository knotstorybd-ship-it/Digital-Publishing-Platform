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
    phone TEXT,
    present_address TEXT,
    permanent_address TEXT,
    is_writer BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. Authors Table (Writer details)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

ALTER TABLE public.authors DROP CONSTRAINT IF EXISTS authors_id_fkey;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

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
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- H. Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    gateway TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    payer_name TEXT,
    payer_phone TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'BDT',
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- I. Reader Favorites
CREATE TABLE IF NOT EXISTS public.favorite_books (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, book_id)
);

-- J. Author Follows
CREATE TABLE IF NOT EXISTS public.author_follows (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, author_id)
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
    'ডিজিটাল প্রকাশনার আধুনিক দিগন্ত। আপনার প্রতিভাকে পাঠকের কাছে পৌঁছে দিতে সহজ প্রকাশনা, পাঠক সংযোগ ও স্বচ্ছ রয়্যালটি ব্যবস্থাপনা।', 
    'লেখা শুরু করুন', 
    'লাইব্রেরি দেখুন', 
    'সম্পাদকীয় টিম', 
    'নতুন', 
    '০+', 
    'লেখক নিবন্ধন চলছে'
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
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.author_follows ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 6. POLICIES
-- ==========================================================

-- A. Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS present_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS permanent_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

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
CREATE POLICY "Users can update own author profile" ON public.authors FOR ALL USING (
    auth.uid() = id OR auth.uid() = auth_user_id
) WITH CHECK (
    auth.uid() = id OR auth.uid() = auth_user_id
);

-- C. Books
DROP POLICY IF EXISTS "Books are viewable by everyone" ON public.books;
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage books" ON public.books;
CREATE POLICY "Authenticated users can manage books" ON public.books FOR ALL USING (
    auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Admins can manage all books" ON public.books;
CREATE POLICY "Admins can manage all books" ON public.books FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles admin_profile
        WHERE admin_profile.id = auth.uid() AND admin_profile.is_admin = true
    )
);

-- D. Orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1
        FROM public.books b
        JOIN public.authors a ON a.name = b.author
        WHERE b.id = orders.book_id AND (a.id = auth.uid() OR a.auth_user_id = auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.profiles admin_profile
        WHERE admin_profile.id = auth.uid() AND admin_profile.is_admin = true
    )
);

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
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles admin_profile
        WHERE admin_profile.id = auth.uid() AND admin_profile.is_admin = true
    )
);

-- G. bKash Payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.bkash_payments;
CREATE POLICY "Users can view own payments" ON public.bkash_payments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.bkash_payments;
CREATE POLICY "Users can insert own payments" ON public.bkash_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- H. Payment Transactions
DROP POLICY IF EXISTS "Users can view own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1 FROM public.profiles admin_profile
        WHERE admin_profile.id = auth.uid() AND admin_profile.is_admin = true
    )
);

DROP POLICY IF EXISTS "Users can insert own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can insert own payment transactions" ON public.payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- I. Reader Favorites
DROP POLICY IF EXISTS "Users can manage own favorite books" ON public.favorite_books;
CREATE POLICY "Users can manage own favorite books" ON public.favorite_books FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- J. Author Follows
DROP POLICY IF EXISTS "Users can manage own author follows" ON public.author_follows;
CREATE POLICY "Users can manage own author follows" ON public.author_follows FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- 7. REALTIME
-- ==========================================================
-- Enable realtime for all tables
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'books',
    'authors',
    'testimonials',
    'profiles',
    'orders',
    'bkash_payments',
    'payment_transactions',
    'favorite_books',
    'author_follows'
  ] LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;

-- ==========================================================
-- 8. STORAGE BUCKETS (Note: Run these policies AFTER creating 'book-covers' bucket in UI)
-- ==========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access book-covers" ON storage.objects;
CREATE POLICY "Public Access book-covers" ON storage.objects FOR SELECT USING (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "Authenticated Upload book-covers" ON storage.objects;
CREATE POLICY "Authenticated Upload book-covers" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'book-covers' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated Update book-covers" ON storage.objects;
CREATE POLICY "Authenticated Update book-covers" ON storage.objects FOR UPDATE USING (
    bucket_id = 'book-covers' AND auth.role() = 'authenticated'
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for admin" ON public.notifications FOR ALL USING (true);
