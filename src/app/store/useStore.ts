import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  cover: string;
  pdf_url?: string;
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
  isAdmin?: boolean;
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
  book_id?: string | null;
  amount: number;
  status: "pending" | "completed" | "rejected";
  payment_method: string;
  transaction_id?: string;
  screenshot_url?: string;
  order_type: "book" | "subscription";
  plan_name?: string;
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
  searchQuery: string;
  favoriteBookIds: string[];
  followedAuthorIds: string[];
  reviews: any[];
  payoutRequests: any[];
};

const mapBookFromDb = (row: any): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
  price: Number(row.price || 0),
  cover: row.cover || "",
  pdf_url: row.pdf_url || undefined,
  rating: Number(row.rating || 0),
  category: row.category || "",
  description: row.description || undefined,
  pages: row.pages || undefined,
  language: row.language || undefined,
  published: row.published || undefined,
  reviews: Number(row.reviews || 0),
  isFeatured: Boolean(row.is_featured ?? row.isFeatured),
  status: row.status || "Published",
});

const mapAuthorFromDb = (row: any): Author => ({
  id: row.id,
  name: row.name,
  email: row.email,
  avatar: row.avatar || "",
  bio: row.bio || "",
  phone: row.phone || undefined,
  presentAddress: row.present_address || row.presentAddress || undefined,
  permanentAddress: row.permanent_address || row.permanentAddress || undefined,
  bookCount: Number(row.book_count ?? row.bookCount ?? 0),
  rating: Number(row.rating || 0),
  joinDate: row.join_date || row.joinDate || "",
  subscriptionPlan: row.subscription_plan || row.subscriptionPlan || undefined,
  subscriptionExpiry: row.subscription_expiry || row.subscriptionExpiry || undefined,
});

const mapSiteSettingsFromDb = (row: any): SiteSettings => ({
  heroTitle: row.hero_title,
  heroSubtitle: row.hero_subtitle,
  heroDescription: row.hero_description,
  heroCtaText: row.hero_cta_text,
  heroSecondaryCtaText: row.hero_secondary_cta_text,
  featuredAuthorName: row.featured_author_name,
  featuredAuthorRating: row.featured_author_rating,
  totalReadersCount: row.total_readers_count,
  authorsCountText: row.authors_count_text,
});

const bookToDb = (book: Partial<Book>) => {
  const row: any = { ...book };
  if ("isFeatured" in row) {
    row.is_featured = row.isFeatured;
    delete row.isFeatured;
  }
  return row;
};

const authorToDb = (author: Partial<Author>) => {
  const row: any = { ...author };
  if ("presentAddress" in row) {
    row.present_address = row.presentAddress;
    delete row.presentAddress;
  }
  if ("permanentAddress" in row) {
    row.permanent_address = row.permanentAddress;
    delete row.permanentAddress;
  }
  if ("bookCount" in row) {
    row.book_count = row.bookCount;
    delete row.bookCount;
  }
  if ("joinDate" in row) {
    row.join_date = row.joinDate;
    delete row.joinDate;
  }
  if ("subscriptionPlan" in row) {
    row.subscription_plan = row.subscriptionPlan;
    delete row.subscriptionPlan;
  }
  if ("subscriptionExpiry" in row) {
    row.subscription_expiry = row.subscriptionExpiry;
    delete row.subscriptionExpiry;
  }
  return row;
};

let currentState: State = {
  user: (() => {
    try {
      const cached = localStorage.getItem("dp_user");
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  })(),
  books: JSON.parse(localStorage.getItem("dp_books") || "[]"),
  authors: JSON.parse(localStorage.getItem("dp_authors") || "[]"),
  cart: JSON.parse(localStorage.getItem("dp_cart") || "[]"),
  orders: [],
  testimonials: JSON.parse(localStorage.getItem("dp_testimonials") || "[]"),
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
  loading: false,
  profilesCount: 0,
  ordersCount: 0,
  searchQuery: "",
  favoriteBookIds: [],
  followedAuthorIds: [],
  reviews: [],
  payoutRequests: [],
};

const listeners = new Set<(state: State) => void>();

const notify = () => {
  localStorage.setItem("dp_cart", JSON.stringify(currentState.cart));
  localStorage.setItem("dp_books", JSON.stringify(currentState.books));
  localStorage.setItem("dp_authors", JSON.stringify(currentState.authors));
  localStorage.setItem("dp_testimonials", JSON.stringify(currentState.testimonials));
  localStorage.setItem("dp_site_settings", JSON.stringify(currentState.siteSettings));
  if (currentState.user) {
    localStorage.setItem("dp_user", JSON.stringify(currentState.user));
  } else {
    localStorage.removeItem("dp_user");
  }
  listeners.forEach((listener) => listener({ ...currentState }));
};

const setLoading = (loading: boolean) => {
  currentState.loading = loading;
  notify();
};

// --- CORE SYNC LOGIC ---

const syncAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    const [profileRes, authorRes, ordersRes, favoritesRes, followsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('authors').select('*').eq('email', session.user.email).single(),
      supabase.from('orders').select('*').eq('user_id', session.user.id),
      supabase.from('favorite_books').select('book_id').eq('user_id', session.user.id),
      supabase.from('author_follows').select('author_id').eq('user_id', session.user.id)
    ]);

    const profile = profileRes.data;
    const authorData = authorRes.data ? mapAuthorFromDb(authorRes.data) : null;
    if (ordersRes.data) currentState.orders = ordersRes.data;
    
    const [reviewsRes, payoutsRes] = await Promise.all([
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('payout_requests').select('*').order('created_at', { ascending: false })
    ]);

    if (reviewsRes.data) currentState.reviews = reviewsRes.data;
    if (payoutsRes.data) currentState.payoutRequests = payoutsRes.data;

    currentState.favoriteBookIds = favoritesRes.data?.map((row: any) => row.book_id) || [];
    currentState.followedAuthorIds = followsRes.data?.map((row: any) => row.author_id) || [];

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
      email: session.user.email!,
      name: profile?.name || session.user.user_metadata.full_name || "User",
      isWriter: !!authorData,
      isAdmin: profile?.role === 'admin' || session.user.email === 'admin@digitalpro.com',
      avatar: profile?.avatar || session.user.user_metadata.avatar_url,
      bio: profile?.bio || "",
      phone: profile?.phone || authorData?.phone,
      presentAddress: profile?.present_address || authorData?.presentAddress,
      permanentAddress: profile?.permanent_address || authorData?.permanentAddress,
      subscription: authorData ? {
        planName: authorData.subscriptionPlan || "Free",
        expiresAt: authorData.subscriptionExpiry || "",
      } : undefined,
    };
    notify();
  } else {
    currentState.user = null;
    notify();
  }
};

let _initialized = false;
let _authListenerSet = false;

const initSupabase = async () => {
  if (_initialized) return;
  _initialized = true;
  setLoading(true);
  
  // Safety timeout: never stay loading for more than 10 seconds
  const loadingTimeout = setTimeout(() => {
    if (currentState.loading) {
      console.warn('Loading timeout reached, forcing load complete.');
      setLoading(false);
    }
  }, 10000);
  
  try {
    const [booksRes, authorsRes, settingsRes, testimonialsRes, profilesRes, ordersRes] = await Promise.all([
      supabase.from('books').select('*').order('created_at', { ascending: false }),
      supabase.from('authors').select('*').order('book_count', { ascending: false }),
      supabase.from('site_settings').select('*').eq('id', 1).single(),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true })
    ]);

    if (booksRes.data) currentState.books = booksRes.data.map(mapBookFromDb);
    if (authorsRes.data) currentState.authors = authorsRes.data.map(mapAuthorFromDb);
    if (settingsRes.data) currentState.siteSettings = mapSiteSettingsFromDb(settingsRes.data);
    if (testimonialsRes.data) currentState.testimonials = testimonialsRes.data;
    if (profilesRes.count !== null) currentState.profilesCount = profilesRes.count;
    if (ordersRes.count !== null) currentState.ordersCount = ordersRes.count;
    
    try { await syncAuth(); } catch (authErr) { console.warn('Auth sync failed:', authErr); }
  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    clearTimeout(loadingTimeout);
    setLoading(false);
  }

  supabase.channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, (payload) => {
      if (payload.eventType === 'INSERT') {
        const newBook = mapBookFromDb(payload.new);
        if (!currentState.books.some(b => b.id === newBook.id)) {
          currentState.books = [newBook, ...currentState.books];
          notify();
        }
      }
      if (payload.eventType === 'UPDATE') {
        currentState.books = currentState.books.map(b => b.id === payload.new.id ? mapBookFromDb(payload.new) : b);
        notify();
      }
      if (payload.eventType === 'DELETE') {
        currentState.books = currentState.books.filter(b => b.id !== payload.old.id);
        notify();
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'authors' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.authors = [mapAuthorFromDb(payload.new), ...currentState.authors];
      if (payload.eventType === 'UPDATE') {
        currentState.authors = currentState.authors.map(a => a.id === payload.new.id ? mapAuthorFromDb(payload.new) : a);
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
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async (payload) => {
      if (payload.eventType === 'INSERT') {
        currentState.orders = [payload.new as Order, ...currentState.orders];
        currentState.ordersCount++;
      }
      if (payload.eventType === 'UPDATE') {
        currentState.orders = currentState.orders.map(o => o.id === payload.new.id ? payload.new as Order : o);
      }
      notify();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.profilesCount++;
      if (payload.eventType === 'DELETE') currentState.profilesCount--;
      notify();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.reviews = [payload.new, ...currentState.reviews];
      notify();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'payout_requests' }, (payload) => {
      if (payload.eventType === 'INSERT') currentState.payoutRequests = [payload.new, ...currentState.payoutRequests];
      if (payload.eventType === 'UPDATE') currentState.payoutRequests = currentState.payoutRequests.map(p => p.id === payload.new.id ? payload.new : p);
      notify();
    })
    .subscribe();
};

// --- AUTH STATE CHANGE LISTENER (runs once at module load) ---
const setupAuthListener = () => {
  if (_authListenerSet) return;
  _authListenerSet = true;
  
  supabase.auth.onAuthStateChange(async (event, _session) => {
    console.log('[Auth Event]', event);
    
    try {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await syncAuth();
      }
      
      if (event === 'SIGNED_OUT') {
        currentState.user = null;
        currentState.orders = [];
        currentState.favoriteBookIds = [];
        currentState.followedAuthorIds = [];
        currentState.reviews = [];
        currentState.payoutRequests = [];
        notify();
      }
    } catch (err) {
      console.warn('[Auth Event Error]', err);
    }
  });
};

// Set up the listener immediately when this module loads
setupAuthListener();

export const useStore = () => {
  const [state, setState] = useState(currentState);

  useEffect(() => {
    const listener = (newState: State) => setState(newState);
    listeners.add(listener);
    initSupabase();
    return () => {
      listeners.delete(listener);
    };
  }, []);

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
      options: { redirectTo: window.location.href }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // State cleanup is handled by onAuthStateChange SIGNED_OUT event
  };

  const fetchAuthorOrders = async () => {
    if (!currentState.user?.name) return;
    const myBookIds = currentState.books
      .filter(b => b.author === currentState.user?.name)
      .map(b => b.id);
    
    if (myBookIds.length === 0) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('book_id', myBookIds);
    
    if (data) {
      currentState.orders = data;
      notify();
    }
  };

  const subscribe = async (planName: string, months: number, paymentDetails?: { method: string, txnId?: string, screenshot?: File }) => {
    if (!currentState.user) return;
    
    const isManual = paymentDetails && paymentDetails.method !== 'card';
    const amount = planName.includes("Starter") ? 499 : planName.includes("Pro") ? 999 : 1999;

    let screenshotUrl = "";
    if (paymentDetails?.screenshot) {
      const fileExt = paymentDetails.screenshot.name.split('.').pop();
      const fileName = `payment_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payments')
        .upload(fileName, paymentDetails.screenshot);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(fileName);
      screenshotUrl = publicUrl;
    }

    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      user_id: currentState.user.id,
      amount,
      status: isManual ? "pending" : "completed",
      payment_method: paymentDetails?.method || "card",
      transaction_id: paymentDetails?.txnId,
      screenshot_url: screenshotUrl,
      order_type: "subscription",
      plan_name: planName
    }).select().single();

    if (orderError) throw orderError;

    if (!isManual) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);
      await supabase.from('authors').upsert({
        id: currentState.user.id,
        name: currentState.user.name,
        email: currentState.user.email,
        subscription_plan: planName,
        subscription_expiry: expiresAt.toISOString(),
      }, { onConflict: 'id' });
      await syncAuth();
    }
  };

  const addBook = async (
    book: Partial<Book> & Pick<Book, "title" | "author" | "price" | "category">, 
    coverFile?: File, 
    pdfFile?: File
  ) => {
    let coverUrl = book.cover || "";
    let pdfUrl = "";

    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(`covers/${fileName}`, coverFile);
      
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('book-covers').getPublicUrl(`covers/${fileName}`);
      coverUrl = data.publicUrl;
    }

    if (pdfFile) {
      const fileExt = pdfFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(`ebooks/${fileName}`, pdfFile);
      
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('book-covers').getPublicUrl(`ebooks/${fileName}`);
      pdfUrl = data.publicUrl;
    }

    const { data, error } = await supabase.from('books').insert([bookToDb({
      ...book,
      cover: coverUrl,
      pdf_url: pdfUrl,
      rating: 0,
      reviews: 0,
      status: "Published",
    })]).select().single();

    if (error) throw error;
    if (data) {
      const created = mapBookFromDb(data);
      if (!currentState.books.some(b => b.id === created.id)) {
        currentState.books = [created, ...currentState.books];
        const author = currentState.authors.find(a => a.name === book.author);
        if (author) {
          const newCount = (author.bookCount || 0) + 1;
          await supabase.from('authors').update({ book_count: newCount }).eq('id', author.id);
        }
        notify();
      }
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { data, error } = await supabase.from('books').update(bookToDb(updates)).eq('id', id).select().single();
    if (error) throw error;
    if (data) {
      currentState.books = currentState.books.map(b => b.id === id ? mapBookFromDb(data) : b);
      notify();
    }
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) throw error;
  };

  const updateAuthor = async (id: string, updates: Partial<Author>) => {
    const { data, error } = await supabase.from('authors').update(authorToDb(updates)).eq('id', id).select().single();
    if (error) throw error;
    if (data) {
      currentState.authors = currentState.authors.map(a => a.id === id ? mapAuthorFromDb(data) : a);
      notify();
    }
  };

  const deleteAuthor = async (id: string) => {
    const { error } = await supabase.from('authors').delete().eq('id', id);
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentState.user) return;
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar: updates.avatar,
        bio: updates.bio,
        phone: updates.phone,
        present_address: updates.presentAddress,
        permanent_address: updates.permanentAddress
      })
      .eq('id', currentState.user.id);
    if (profileError) throw profileError;
    if (currentState.user.isWriter) {
      await supabase
        .from('authors')
        .update({
          name: updates.name,
          avatar: updates.avatar,
          bio: updates.bio,
          phone: updates.phone,
          present_address: updates.presentAddress,
          permanent_address: updates.permanentAddress
        })
        .eq('email', currentState.user.email);
    }
    await syncAuth();
  };

  const purchaseCart = async (paymentDetails?: { method: string, txnId?: string, screenshot?: File }) => {
    if (!currentState.user) throw new Error("Please login to purchase books.");
    if (currentState.cart.length === 0) return;

    const isManual = paymentDetails && paymentDetails.method !== 'card';
    let screenshotUrl = "";
    if (paymentDetails?.screenshot) {
      const fileExt = paymentDetails.screenshot.name.split('.').pop();
      const fileName = `payment_cart_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payments')
        .upload(fileName, paymentDetails.screenshot);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(fileName);
      screenshotUrl = publicUrl;
    }

    const orderPromises = currentState.cart.map(book => 
      supabase.from('orders').insert({
        user_id: currentState.user!.id,
        book_id: book.id,
        amount: book.price,
        status: isManual ? "pending" : "completed",
        payment_method: paymentDetails?.method || "card",
        transaction_id: paymentDetails?.txnId,
        screenshot_url: screenshotUrl,
        order_type: "book"
      })
    );
    await Promise.all(orderPromises);
    clearCart();
    await syncAuth();
  };

  const addOrder = async (order: any) => {
    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw error;
    if (data) {
      currentState.orders = [data, ...currentState.orders];
      notify();
    }
    return data;
  };

  const approvePayment = async (orderId: string) => {
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (fetchError || !order) throw fetchError || new Error("Order not found");

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);
    
    if (updateError) throw updateError;

    if (order.order_type === 'subscription') {
      const months = order.plan_name.includes("Starter") ? 3 : order.plan_name.includes("Pro") ? 6 : 1200;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);
      const { data: profile } = await supabase.from('profiles').select('name, email').eq('id', order.user_id).single();
      await supabase.from('authors').upsert({
        id: order.user_id,
        name: profile?.name || "Verified Author",
        email: profile?.email || "",
        subscription_plan: order.plan_name,
        subscription_expiry: expiresAt.toISOString(),
      }, { onConflict: 'id' });
    }

    currentState.orders = currentState.orders.map(o => o.id === orderId ? { ...o, status: 'completed' } : o);
    notify();
  };

  const rejectPayment = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'rejected' })
      .eq('id', orderId);
    if (error) throw error;
    currentState.orders = currentState.orders.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o);
    notify();
  };

  const addToCart = (book: Book) => {
    if (currentState.cart.some((item) => item.id === book.id)) return;
    currentState.cart = [...currentState.cart, book];
    notify();
  };

  const removeFromCart = (bookId: string) => {
    currentState.cart = currentState.cart.filter((item) => item.id !== bookId);
    notify();
  };

  const clearCart = () => {
    currentState.cart = [];
    notify();
  };

  const setSearchQuery = (query: string) => {
    currentState.searchQuery = query;
    notify();
  };

  const toggleFavoriteBook = async (bookId: string) => {
    if (!currentState.user) throw new Error("Please login to save books.");
    const isFavorite = currentState.favoriteBookIds.includes(bookId);
    
    // Update local state optimistically first
    if (isFavorite) {
      currentState.favoriteBookIds = currentState.favoriteBookIds.filter(id => id !== bookId);
    } else {
      currentState.favoriteBookIds = [...currentState.favoriteBookIds, bookId];
    }
    notify();
    
    // Then sync to database
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_books')
          .delete()
          .eq('user_id', currentState.user.id)
          .eq('book_id', bookId);
        if (error) console.warn('Favorite DB sync error:', error.message);
      } else {
        const { error } = await supabase
          .from('favorite_books')
          .insert({ user_id: currentState.user.id, book_id: bookId });
        if (error) console.warn('Favorite DB sync error:', error.message);
      }
    } catch (err) {
      console.warn('Favorite toggle DB error:', err);
    }
  };

  const toggleAuthorFollow = async (authorId: string) => {
    if (!currentState.user) throw new Error("Please login to follow authors.");
    const isFollowing = currentState.followedAuthorIds.includes(authorId);
    
    // Update local state optimistically first
    if (isFollowing) {
      currentState.followedAuthorIds = currentState.followedAuthorIds.filter(id => id !== authorId);
    } else {
      currentState.followedAuthorIds = [...currentState.followedAuthorIds, authorId];
    }
    notify();
    
    // Then sync to database
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('author_follows')
          .delete()
          .eq('user_id', currentState.user.id)
          .eq('author_id', authorId);
        if (error) console.warn('Follow DB sync error:', error.message);
      } else {
        const { error } = await supabase
          .from('author_follows')
          .insert({ user_id: currentState.user.id, author_id: authorId });
        if (error) console.warn('Follow DB sync error:', error.message);
      }
    } catch (err) {
      console.warn('Follow toggle DB error:', err);
    }
  };

  const getFilteredBooks = () => {
    if (!state.searchQuery) return state.books;
    const q = state.searchQuery.toLowerCase();
    return state.books.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q) || 
      b.category.toLowerCase().includes(q)
    );
  };

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
    const dbSettings: any = {};
    if ("heroTitle" in newSettings) dbSettings.hero_title = newSettings.heroTitle;
    if ("heroSubtitle" in newSettings) dbSettings.hero_subtitle = newSettings.heroSubtitle;
    if ("heroDescription" in newSettings) dbSettings.hero_description = newSettings.heroDescription;
    if ("heroCtaText" in newSettings) dbSettings.hero_cta_text = newSettings.heroCtaText;
    if ("heroSecondaryCtaText" in newSettings) dbSettings.hero_secondary_cta_text = newSettings.heroSecondaryCtaText;
    if ("featuredAuthorName" in newSettings) dbSettings.featured_author_name = newSettings.featuredAuthorName;
    if ("featuredAuthorRating" in newSettings) dbSettings.featured_author_rating = newSettings.featuredAuthorRating;
    if ("totalReadersCount" in newSettings) dbSettings.total_readers_count = newSettings.totalReadersCount;
    if ("authorsCountText" in newSettings) dbSettings.authors_count_text = newSettings.authorsCountText;
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
    };
    const { data, error } = await supabase.from('testimonials').insert({
      ...testimonialData,
      content,
      rating,
      is_approved: false,
    }).select();
    if (error) throw new Error(error.message);
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
    logout: signOut,
    fetchAuthorOrders,
    subscribe,
    addBook,
    updateBook,
    deleteBook,
    updateAuthor,
    deleteAuthor,
    updateProfile,
    purchaseCart,
    addOrder,
    approvePayment,
    rejectPayment,
    addToCart,
    removeFromCart,
    clearCart,
    setSearchQuery,
    toggleFavoriteBook,
    toggleAuthorFollow,
    getFilteredBooks,
    getMyBooks,
    getBookById,
    getAuthorByName,
    getAuthorById,
    updateSiteSettings,
    addTestimonial,
    approveTestimonial,
    deleteTestimonial
  };
};
