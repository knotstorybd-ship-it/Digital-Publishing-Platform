import { Link, useNavigate, useLocation } from "react-router";
import { BookOpen, Search, User, Menu, X, ShoppingCart, TrendingUp, ArrowRight, Star, Library } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Logo } from "./Logo";

export function Navbar() {
  const { cart, user, signIn, signInWithGoogle, signOut, books, authors, searchQuery, setSearchQuery } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isWriterMode = !!(user?.isWriter && user?.subscription);
  const showCart = !isWriterMode && (cart.length > 0 || location.pathname === '/checkout');

  const filteredResults = searchQuery.length > 0 ? {
    books: books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4),
    authors: authors.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
  } : { books: [], authors: [] };

  const hasResults = filteredResults.books.length > 0 || filteredResults.authors.length > 0;

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener("open-auth", handleOpenAuth);
    return () => window.removeEventListener("open-auth", handleOpenAuth);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    try {
      await signIn(email);
      setIsAuthOpen(false);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("rate limit")) {
        setError("ইমেইল পাঠানোর লিমিট শেষ হয়ে গেছে। গুগল দিয়ে লগইন করার চেষ্টা করুন।");
      } else {
        setError("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      setIsAuthOpen(false);
    } catch (error) {
      console.error(error);
      setIsGoogleLoading(false);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled 
            ? "py-3 bg-white/80 backdrop-blur-2xl border-b border-emerald-100 shadow-[0_12px_40px_rgba(6,78,59,0.08)]" 
            : "py-6 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center group">
              <Logo className="scale-90 origin-left transition-transform group-hover:scale-95" />
            </Link>

            <div className="hidden lg:flex items-center gap-12">
              <div className="flex items-center gap-8">
                <Link to="/browse" className="relative group py-2">
                  <span className="text-sm font-bold text-emerald-950/70 group-hover:text-emerald-950 transition-colors uppercase tracking-widest">সব বই</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {user && (
                  <Link to="/library" className="relative group py-2">
                    <span className="text-sm font-bold text-emerald-950/70 group-hover:text-emerald-950 transition-colors uppercase tracking-widest">লাইব্রেরি</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {!isWriterMode && (
                  <Link to="/join-writer" className="relative group py-2">
                    <span className="text-sm font-bold text-emerald-950/70 group-hover:text-emerald-950 transition-colors uppercase tracking-widest">লেখক হন</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>
                <input
                  type="text"
                  placeholder="বইয়ের নাম বা লেখক..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-64 focus:w-80 px-12 py-2.5 bg-slate-50 rounded-2xl border border-transparent focus:border-emerald-100 focus:bg-white focus:shadow-2xl focus:shadow-emerald-900/5 transition-all outline-none text-sm font-medium text-emerald-950 placeholder:text-slate-300 placeholder:font-bold"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery) {
                      navigate(`/browse?q=${searchQuery}`);
                      setIsSearchFocused(false);
                    }
                  }}
                />
                <AnimatePresence>
                  {isSearchFocused && searchQuery && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute top-full mt-4 left-0 w-[28rem] bg-white rounded-[2.5rem] shadow-2xl border border-emerald-50/50 overflow-hidden z-[100]">
                      {hasResults ? (
                        <div className="p-5">
                          {filteredResults.books.map(book => (
                            <Link key={book.id} to={`/book/${book.id}`} className="flex items-center gap-4 p-3 hover:bg-emerald-50/50 rounded-2xl transition-all group" onClick={() => setSearchQuery("")}>
                              <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100"><img src={book.cover} className="w-full h-full object-cover" /></div>
                              <div><p className="font-bold text-emerald-950 text-sm">{book.title}</p><p className="text-xs text-slate-400">{book.author}</p></div>
                            </Link>
                          ))}
                          <button onClick={() => navigate(`/browse?q=${searchQuery}`)} className="w-full mt-4 py-4 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">সব ফলাফল দেখুন</button>
                        </div>
                      ) : (
                        <div className="p-12 text-center text-slate-400 font-bold">কোনো ফলাফল পাওয়া যায়নি</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-6 pl-8 border-l border-emerald-50">
                {showCart && (
                  <Link to="/checkout" className="p-3 bg-slate-50 hover:bg-emerald-600 rounded-2xl transition-all relative group/cart">
                    <ShoppingCart className="w-5 h-5 text-emerald-950 group-hover:text-white" />
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">{cart.length}</span>}
                  </Link>
                )}

                {user ? (
                  <div className="relative">
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-1 pr-5 bg-white border border-emerald-50 rounded-2xl hover:bg-emerald-50 transition-all group">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Account</p>
                        <p className="text-xs font-bold text-emerald-950 leading-none">{user.name.split(' ')[0]}</p>
                      </div>
                    </button>
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl border border-emerald-50/50 py-5 z-50">
                          <div className="px-8 py-4 border-b border-emerald-50/50 mb-3"><p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-1">Signed in as</p><p className="text-sm font-black text-emerald-950 truncate">{user.email}</p></div>
                          <div className="px-3 space-y-1">
                            {user.isWriter && (
                              <Link to="/writer" className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-emerald-950 hover:bg-emerald-50 rounded-2xl transition-colors" onClick={() => setIsProfileOpen(false)}>
                                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><TrendingUp className="w-4 h-4" /></div>লেখক ড্যাশবোর্ড
                              </Link>
                            )}
                            <Link to="/library" className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-emerald-950 hover:bg-emerald-50 rounded-2xl transition-colors" onClick={() => setIsProfileOpen(false)}>
                              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Library className="w-4 h-4" /></div>আমার লাইব্রেরি
                            </Link>
                          </div>
                          <div className="h-px bg-emerald-50/50 my-3 mx-6"></div>
                          <div className="px-3">
                            <button onClick={() => { signOut(); setIsProfileOpen(false); }} className="w-full text-left px-5 py-4 text-xs text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors font-black uppercase tracking-[0.2em]">লগআউট করুন</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button onClick={() => setIsAuthOpen(true)} className="px-10 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">লগইন করুন</button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <button onClick={() => user ? setIsProfileOpen(!isProfileOpen) : setIsAuthOpen(true)} className="p-2 bg-slate-50 rounded-xl">
                {user?.avatar ? <img src={user.avatar} className="w-6 h-6 rounded-full" /> : <User className="w-6 h-6 text-emerald-950" />}
              </button>
              <button className="p-2 text-emerald-950 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-emerald-50 bg-white overflow-hidden shadow-2xl px-6 py-10 space-y-6">
              <Link to="/browse" className="block text-2xl font-black text-emerald-950" onClick={() => setIsMenuOpen(false)}>সব বই</Link>
              {user && <Link to="/library" className="block text-2xl font-black text-emerald-950" onClick={() => setIsMenuOpen(false)}>লাইব্রেরি</Link>}
              {!isWriterMode && <Link to="/join-writer" className="block text-2xl font-black text-emerald-950" onClick={() => setIsMenuOpen(false)}>লেখক হন</Link>}
              <div className="h-px bg-emerald-50"></div>
              {user ? (
                <div className="space-y-4">
                  {user.isWriter && <Link to="/writer" className="block text-xl font-bold text-emerald-600" onClick={() => setIsMenuOpen(false)}>লেখক ড্যাশবোর্ড</Link>}
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black uppercase tracking-widest text-center">লগআউট</button>
                </div>
              ) : (
                <button onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest">লগইন করুন</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4">
            <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-emerald-100">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
              <div className="flex items-center justify-between mb-10">
                <div><h2 className="text-3xl font-black text-emerald-950">{authMode === "login" ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}</h2></div>
                <button onClick={() => setIsAuthOpen(false)} className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-950"><X className="w-7 h-7" /></button>
              </div>
              <div className="space-y-8">
                <button onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full py-4 border-2 border-emerald-50 rounded-2xl flex items-center justify-center gap-4 hover:bg-emerald-50 transition-all disabled:opacity-50 font-black text-emerald-950">
                  {isGoogleLoading ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> : "Continue with Google"}
                </button>
                <div className="flex items-center gap-5 text-[10px] font-black text-emerald-600/30 uppercase tracking-[0.3em]"><div className="h-px bg-emerald-50 flex-1"></div>অথবা<div className="h-px bg-emerald-50 flex-1"></div></div>
                <form onSubmit={handleAuth} className="space-y-5">
                  <div><label className="block mb-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">ইমেইল এড্রেস</label><input name="email" type="email" required className="w-full px-5 py-4 bg-emerald-50/50 rounded-2xl border border-transparent focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-emerald-950" placeholder="your@email.com" /></div>
                  {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">{error}</div>}
                  <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-lg">
                    {authMode === "login" ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"} <ArrowRight className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
