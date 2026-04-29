import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  cover: string;
  rating: number;
  category: string;
  description?: string;
  pages?: number;
  language?: string;
  published?: string;
  reviews?: number;
  isFeatured?: boolean;
  status: "Published" | "Draft" | "Archived";
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bookCount: number;
  rating: number;
  joinDate: string;
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
}

export interface Subscription {
  planName: string;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isWriter: boolean;
  avatar?: string;
  bio?: string;
  phone?: string;
  presentAddress?: string;
  permanentAddress?: string;
  subscription?: Subscription;
}

export interface Order {
  id: string;
  user_id: string;
  book_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  featuredAuthorName: string;
  featuredAuthorRating: string;
  totalReadersCount: string;
  authorsCountText: string;
}

export interface Testimonial {
  id: string;
  user_id?: string | null;
  user_name: string;
  user_avatar: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

type State = {
  user: User | null;
  books: Book[];
  authors: Author[];
  cart: Book[];
  orders: Order[];
  siteSettings: SiteSettings;
  testimonials: Testimonial[];
  loading: boolean;
  profilesCount: number;
  ordersCount: number;
};

let currentState: State = {
  user: null,
  books: [],
  authors: [],
  cart: JSON.parse(localStorage.getItem("dp_cart") || "[]"),
  orders: [],
  testimonials: [],
  siteSettings: JSON.parse(localStorage.getItem("dp_site_settings") || JSON.stringify({
    heroTitle: "নতুন যুগের নতুন লেখকদের জন্য",
    heroSubtitle: "আধুনিক প্রকাশনা",
    heroDescription: "ডিজিটাল প্রকাশনার আধুনিক দিগন্ত। আপনার প্রতিভাকে পৌঁছে দেই লক্ষাধিক পাঠকের কাছে, স্বচ্ছ রয়্যালটি ব্যবস্থাপনায়।",
    heroCtaText: "লেখা শুরু করুন",
    heroSecondaryCtaText: "লাইব্রেরি দেখুন",
    featuredAuthorName: "আরিফ রহমান",
    featuredAuthorRating: "৪.৯",
    totalReadersCount: "৫০,০০০+",
    authorsCountText: "১০,০০০+ লেখক যুক্ত আছেন",
  })),
  loading: true,
  profilesCount: 0,
  ordersCount: 0,
};

const listeners = new Set<(state: State) => void>();

const notify = () => {
  localStorage.setItem("dp_cart", JSON.stringify(currentState.cart));
  listeners.forEach((listener) => listener({ ...currentState }));
};

// --- CORE SYNC LOGIC ---

const syncAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // 1. Fetch profile & subscription data in parallel
    const [profileRes, authorRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('authors').select('*').eq('email', session.user.email).single(),
      supabase.from('orders').select('*').eq('user_id', session.user.id)
    ]);

    const profile = profileRes.data;
    const authorData = authorRes.data;
    if (ordersRes.data) currentState.orders = ordersRes.data;

    // Auto-create/sync profile if missing or logged in with Google
    if (!profile || (session.user.app_metadata.provider === 'google' && !profile.name)) {
      await supabase.from('profiles').upsert({
        id: session.user.id,
        name: profile?.name || session.user.user_metadata.full_name || session.user.user_metadata.name || "User",
        avatar: profile?.avatar || session.user.user_metadata.avatar_url,
        email: session.user.email
      });
    }

    currentState.user = {
      id: session.user.id,
      name: profile?.name || session.user.user_metadata.full_name || session.user.user_metadata.name || "User",
      email: session.user.email || "",
      isWriter: !!authorData,
      avatar: profile?.avatar || session.user.user_metadata.avatar_url,
      bio: profile?.bio,
      subscription: authorData ? {
        planName: authorData.subscription_plan,
        expiresAt: authorData.subscription_expiry,
      } : undefined
    };
  } else {
    currentState.user = null;
    currentState.orders = [];
  }
  currentState.loading = false;
  notify();
};

const initSupabase = async () => {
  // 1. Initial Data Fetch
  const [booksRes, authorsRes, testimonialsRes, profilesRes, ordersRes, settingsRes] = await Promise.all([
    supabase.from('books').select('*').order('created_at', { ascending: false }),
    supabase.from('authors').select('*').order('rating', { ascending: false }),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('site_settings').select('*').eq('id', 1).single()
  ]);

  if (booksRes.data) currentState.books = booksRes.data;
  if (authorsRes.data) currentState.authors = authorsRes.data;
  
  if (testimonialsRes.error) {
    console.warn("Testimonials table not found in Supabase. Please run the SQL in supabase_setup.sql.");
  } else if (testimonialsRes.data) {
    currentState.testimonials = testimonialsRes.data;
  }

  if (settingsRes.data) {
    const s = settingsRes.data;
    currentState.siteSettings = {
      heroTitle: s.hero_title,
      heroSubtitle: s.hero_subtitle,
      heroDescription: s.hero_description,
      heroCtaText: s.hero_cta_text,
      heroSecondaryCtaText: s.hero_secondary_cta_text,
      featuredAuthorName: s.featured_author_name,
      featuredAuthorRating: s.featured_author_rating,
      totalReadersCount: s.total_readers_count,
      authorsCountText: s.authors_count_text
    };
  }

  if (profilesRes.count !== null) currentState.profilesCount = profilesRes.count;
  if (ordersRes.count !== null) currentState.ordersCount = ordersRes.count;
  
  // 2. Initial Auth Check
  await syncAuth();

  // 3. Real-time Subscriptions
  supabase.channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.books = [payload.new as Book, ...currentState.books];
      if (payload.eventType === 'UPDATE') currentState.books = currentState.books.map(b => b.id === payload.new.id ? payload.new as Book : b);
      if (payload.eventType === 'DELETE') currentState.books = currentState.books.filter(b => b.id !== payload.old.id);
      notify();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'authors' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.authors = [payload.new as Author, ...currentState.authors];
      if (payload.eventType === 'UPDATE') {
        currentState.authors = currentState.authors.map(a => a.id === payload.new.id ? payload.new as Author : a);
        // If current user is this author, update their session data too
        if (currentState.user?.email === payload.new.email) syncAuth();
      }
      if (payload.eventType === 'DELETE') currentState.authors = currentState.authors.filter(a => a.id !== payload.old.id);
      notify();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.testimonials = [payload.new as Testimonial, ...currentState.testimonials];
      if (payload.eventType === 'UPDATE') currentState.testimonials = currentState.testimonials.map(t => t.id === payload.new.id ? payload.new as Testimonial : t);
      if (payload.eventType === 'DELETE') currentState.testimonials = currentState.testimonials.filter(t => t.id !== payload.old.id);
      notify();
    })
    .subscribe();

  // 4. Auth State Listener
  supabase.auth.onAuthStateChange(() => {
    syncAuth();
  });
};

initSupabase();

// --- THE HOOK ---

export function useStore() {
  const [state, setState] = useState<State>(currentState);

  useEffect(() => {
    listeners.add(setState);
    
    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dp_site_settings" && e.newValue) {
        currentState.siteSettings = JSON.parse(e.newValue);
        notify();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      listeners.delete(setState);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Auth Functions
  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
    alert("লগইন লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে!");
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Writing Functions
  const subscribe = async (planName: string, months: number) => {
    if (!currentState.user) return;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const { error } = await supabase.from('authors').upsert({
      id: currentState.user.id,
      name: currentState.user.name,
      email: currentState.user.email,
      avatar: currentState.user.avatar,
      bio: currentState.user.bio || "নতুন লেখক",
      subscription_plan: planName,
      subscription_expiry: expiresAt.toISOString(),
    }, { onConflict: 'email' });

    if (error) throw error;
    await syncAuth();
  };

  const addBook = async (book: Omit<Book, "id" | "rating" | "reviews" | "status">) => {
    const { error } = await supabase.from('books').insert([{
      ...book,
      rating: 0,
      reviews: 0,
      status: "Published",
    }]);
    if (error) throw error;
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { error } = await supabase.from('books').update(updates).eq('id', id);
    if (error) throw error;
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) throw error;
  };

  const updateAuthor = async (id: string, updates: Partial<Author>) => {
    const { error } = await supabase.from('authors').update(updates).eq('id', id);
    if (error) throw error;
  };

  const deleteAuthor = async (id: string) => {
    const { error } = await supabase.from('authors').delete().eq('id', id);
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentState.user) return;
    
    // 1. Update Profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar: updates.avatar,
        bio: updates.bio
      })
      .eq('id', currentState.user.id);
    
    if (profileError) throw profileError;

    // 2. If they are a writer, update Authors table too
    if (currentState.user.isWriter) {
      await supabase
        .from('authors')
        .update({
          name: updates.name,
          avatar: updates.avatar,
          bio: updates.bio
        })
        .eq('email', currentState.user.email);
    }

    await syncAuth();
  };

  // Purchasing Functions
  const purchaseCart = async () => {
    if (!currentState.user) return;
    
    const orders = currentState.cart.map(book => ({
      user_id: currentState.user?.id,
      book_id: book.id,
      amount: book.price,
      status: 'Completed'
    }));

    const { error } = await supabase.from('orders').insert(orders);
    if (error) throw error;
    
    currentState.cart = [];
    notify();
  };

  // Cart Functions
  const addToCart = (book: Book) => {
    if (!currentState.cart.find((item) => item.id === book.id)) {
      currentState.cart = [...currentState.cart, book];
      notify();
    }
  };

  const removeFromCart = (bookId: string) => {
    currentState.cart = currentState.cart.filter((item) => item.id !== bookId);
    notify();
  };

  const clearCart = () => {
    currentState.cart = [];
    notify();
  };

  // Utility Functions
  const getMyBooks = () => {
    if (!currentState.user) return [];
    return currentState.books.filter(b => b.author === currentState.user?.name);
  };

  const getBookById = (id: string) => {
    return state.books.find((b) => b.id === id);
  };

  const getAuthorByName = (name: string) => {
    return state.authors.find((a) => a.name === name);
  };

  const getAuthorById = (id: string) => {
    return state.authors.find((a) => a.id === id);
  };

  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    currentState.siteSettings = { ...currentState.siteSettings, ...newSettings };
    
    // Map camelCase to snake_case for DB
    const dbSettings: any = {};
    if (newSettings.heroTitle) dbSettings.hero_title = newSettings.heroTitle;
    if (newSettings.heroSubtitle) dbSettings.hero_subtitle = newSettings.heroSubtitle;
    if (newSettings.heroDescription) dbSettings.hero_description = newSettings.heroDescription;
    if (newSettings.heroCtaText) dbSettings.hero_cta_text = newSettings.heroCtaText;
    if (newSettings.heroSecondaryCtaText) dbSettings.hero_secondary_cta_text = newSettings.heroSecondaryCtaText;
    if (newSettings.featuredAuthorName) dbSettings.featured_author_name = newSettings.featuredAuthorName;
    if (newSettings.featuredAuthorRating) dbSettings.featured_author_rating = newSettings.featuredAuthorRating;
    if (newSettings.totalReadersCount) dbSettings.total_readers_count = newSettings.totalReadersCount;
    if (newSettings.authorsCountText) dbSettings.authors_count_text = newSettings.authorsCountText;

    const { error } = await supabase.from('site_settings').update(dbSettings).eq('id', 1);
    if (error) console.error("Error updating site settings:", error);
    
    localStorage.setItem("dp_site_settings", JSON.stringify(currentState.siteSettings));
    notify();
  };

  const addTestimonial = async (content: string, rating: number, guestName?: string) => {
    const testimonialData: any = currentState.user ? {
      user_id: currentState.user.id,
      user_name: currentState.user.name,
      user_avatar: currentState.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentState.user.name}`,
    } : {
      user_name: guestName || "Guest User",
      user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestName || "Guest"}`,
      // Omitting user_id entirely for guests to avoid DB constraint issues
    };

    const { data, error } = await supabase.from('testimonials').insert({
      ...testimonialData,
      content,
      rating,
      is_approved: false,
    }).select();
    
    if (error) {
      console.error("Supabase Testimonial Error:", error);
      throw new Error(error.message);
    }

    // Only add to local state if not already added by real-time listener
    if (data && data[0]) {
      const exists = currentState.testimonials.some(t => t.id === data[0].id);
      if (!exists) {
        currentState.testimonials = [data[0] as Testimonial, ...currentState.testimonials];
        notify();
      }
    }
  };

  const approveTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: true }).eq('id', id);
    if (error) throw error;
    currentState.testimonials = currentState.testimonials.map(t => t.id === id ? { ...t, is_approved: true } : t);
    notify();
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    currentState.testimonials = currentState.testimonials.filter(t => t.id !== id);
    notify();
  };

  return {
    ...state,
    signIn,
    signInWithGoogle,
    signOut,
    subscribe,
    addBook,
    updateBook,
    deleteBook,
    updateAuthor,
    deleteAuthor,
    updateProfile,
    purchaseCart,
    addToCart,
    removeFromCart,
    clearCart,
    getMyBooks,
    getBookById,
    getAuthorByName,
    getAuthorById,
    updateSiteSettings,
    addTestimonial,
    approveTestimonial,
    deleteTestimonial,
  };
}

useStore.getState = () => currentState;
