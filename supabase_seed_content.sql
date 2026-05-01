-- Digital Publishing Platform - Launch Seed Content
-- Run after supabase_setup.sql.
-- This file is idempotent: it can be run more than once without duplicating rows.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Keep public-facing homepage claims realistic until real numbers exist.
INSERT INTO public.site_settings (
    id,
    hero_title,
    hero_subtitle,
    hero_description,
    hero_cta_text,
    hero_secondary_cta_text,
    featured_author_name,
    featured_author_rating,
    total_readers_count,
    authors_count_text
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
) ON CONFLICT (id) DO UPDATE SET
    hero_title = EXCLUDED.hero_title,
    hero_subtitle = EXCLUDED.hero_subtitle,
    hero_description = EXCLUDED.hero_description,
    hero_cta_text = EXCLUDED.hero_cta_text,
    hero_secondary_cta_text = EXCLUDED.hero_secondary_cta_text,
    featured_author_name = EXCLUDED.featured_author_name,
    featured_author_rating = EXCLUDED.featured_author_rating,
    total_readers_count = EXCLUDED.total_readers_count,
    authors_count_text = EXCLUDED.authors_count_text,
    updated_at = timezone('utc'::text, now());

-- Seed public author profiles. These are content authors, not login users.
-- Real writers who sign up later can still be linked through auth_user_id.
INSERT INTO public.authors (
    id,
    name,
    email,
    avatar,
    bio,
    book_count,
    rating,
    subscription_plan,
    subscription_expiry,
    join_date
) VALUES
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:author:arif-rahman'),
    'আরিফ রহমান',
    'arif.writer@example.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=arif-rahman',
    'সমকালীন বাংলা গল্প ও প্রবন্ধের লেখক। নগরজীবন, স্মৃতি ও পাঠকের অভিজ্ঞতা নিয়ে লিখতে ভালোবাসেন।',
    2,
    4.8,
    'Seed Author',
    NULL,
    timezone('utc'::text, now())
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:author:nusrat-jahan'),
    'নুসরাত জাহান',
    'nusrat.writer@example.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=nusrat-jahan',
    'শিশু সাহিত্য ও কবিতায় আগ্রহী লেখক। সহজ ভাষায় কল্পনা, পরিবার ও শেখার গল্প লিখেন।',
    2,
    4.7,
    'Seed Author',
    NULL,
    timezone('utc'::text, now())
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:author:mahfuz-alam'),
    'মাহফুজ আলম',
    'mahfuz.writer@example.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=mahfuz-alam',
    'ইতিহাস ও গবেষণাধর্মী লেখায় কাজ করেন। পাঠকদের জন্য তথ্যভিত্তিক অথচ সহজপাঠ্য বই তৈরি করেন।',
    2,
    4.6,
    'Seed Author',
    NULL,
    timezone('utc'::text, now())
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    avatar = EXCLUDED.avatar,
    bio = EXCLUDED.bio,
    book_count = EXCLUDED.book_count,
    rating = EXCLUDED.rating,
    subscription_plan = EXCLUDED.subscription_plan;

-- Seed books for browse/detail/cart/checkout testing.
INSERT INTO public.books (
    id,
    title,
    author,
    price,
    cover,
    pdf_url,
    rating,
    category,
    description,
    pages,
    language,
    published,
    reviews,
    is_featured,
    status
) VALUES
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:book:nodi-o-nogor'),
    'নদী ও নগর',
    'আরিফ রহমান',
    250,
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=900&fit=crop',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    4.8,
    'উপন্যাস',
    'নগরজীবন, স্মৃতি এবং নদীর সঙ্গে মানুষের সম্পর্ক নিয়ে লেখা একটি সমকালীন উপন্যাস।',
    180,
    'বাংলা',
    '২০২৬',
    12,
    true,
    'Published'
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:book:shobder-bagan'),
    'শব্দের বাগান',
    'নুসরাত জাহান',
    180,
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=900&fit=crop',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    4.7,
    'কবিতা',
    'প্রকৃতি, সম্পর্ক ও স্বপ্ন নিয়ে ছোট ছোট কবিতার সংকলন।',
    96,
    'বাংলা',
    '২০২৬',
    9,
    true,
    'Published'
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:book:banglar-itihas-path'),
    'বাংলার ইতিহাস পাঠ',
    'মাহফুজ আলম',
    320,
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=900&fit=crop',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    4.6,
    'ইতিহাস',
    'বাংলার ইতিহাসের গুরুত্বপূর্ণ সময়, মানুষ ও পরিবর্তন নিয়ে সহজ ভাষার পরিচিতিমূলক বই।',
    220,
    'বাংলা',
    '২০২৬',
    7,
    true,
    'Published'
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:book:chhotoder-akash'),
    'ছোটদের আকাশ',
    'নুসরাত জাহান',
    150,
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=900&fit=crop',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    4.9,
    'শিশু সাহিত্য',
    'শিশুদের কল্পনা, বন্ধুত্ব ও শেখার আনন্দ নিয়ে ছোট গল্পের বই।',
    72,
    'বাংলা',
    '২০২৬',
    15,
    true,
    'Published'
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:book:raater-chithi'),
    'রাতের চিঠি',
    'আরিফ রহমান',
    210,
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&h=900&fit=crop',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    4.5,
    'রম্য',
    'প্রতিদিনের জীবনের হাসি, ব্যঙ্গ ও ছোট ছোট পর্যবেক্ষণ নিয়ে লেখা রম্য সংকলন।',
    130,
    'বাংলা',
    '২০২৬',
    6,
    false,
    'Published'
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:book:purono-dinlipi'),
    'পুরোনো দিনলিপি',
    'মাহফুজ আলম',
    275,
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=900&fit=crop',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    4.4,
    'উপন্যাস',
    'একটি পরিবারের স্মৃতি, সময়ের পরিবর্তন এবং ব্যক্তিগত ইতিহাসের গল্প।',
    200,
    'বাংলা',
    '২০২৬',
    5,
    false,
    'Published'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    price = EXCLUDED.price,
    cover = EXCLUDED.cover,
    pdf_url = EXCLUDED.pdf_url,
    rating = EXCLUDED.rating,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    pages = EXCLUDED.pages,
    language = EXCLUDED.language,
    published = EXCLUDED.published,
    reviews = EXCLUDED.reviews,
    is_featured = EXCLUDED.is_featured,
    status = EXCLUDED.status;

-- Seed approved guest testimonials for homepage/admin review display.
INSERT INTO public.testimonials (
    id,
    user_name,
    user_avatar,
    content,
    rating,
    is_approved
) VALUES
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:testimonial:reader-1'),
    'সাদিয়া ইসলাম',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=sadia-islam',
    'বাংলা বই খোঁজা ও পড়ার জন্য প্ল্যাটফর্মটি খুব সহজ মনে হয়েছে। ডিজিটাল কপি দ্রুত পাওয়া যায়।',
    5,
    true
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:testimonial:reader-2'),
    'রাফি আহমেদ',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=rafi-ahmed',
    'ক্যাটালগ, লেখক প্রোফাইল এবং পেমেন্ট ফ্লো এক জায়গায় থাকায় ব্যবহার করা সুবিধাজনক।',
    5,
    true
),
(
    uuid_generate_v5(uuid_ns_url(), 'digitalprokashoni:testimonial:writer-1'),
    'তানিয়া রহমান',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=tania-rahman',
    'লেখকদের জন্য বই প্রকাশ, বিক্রয় দেখা এবং প্রোফাইল তৈরি করার ধারণাটি ভালোভাবে সাজানো।',
    4,
    true
) ON CONFLICT (id) DO UPDATE SET
    user_name = EXCLUDED.user_name,
    user_avatar = EXCLUDED.user_avatar,
    content = EXCLUDED.content,
    rating = EXCLUDED.rating,
    is_approved = EXCLUDED.is_approved;

-- Quick verification query.
SELECT
  (SELECT count(*) FROM public.authors) AS authors_count,
  (SELECT count(*) FROM public.books) AS books_count,
  (SELECT count(*) FROM public.testimonials WHERE is_approved = true) AS approved_testimonials_count,
  (SELECT public FROM storage.buckets WHERE id = 'book-covers') AS book_covers_bucket_public;
