import { Link, useNavigate } from "react-router";
import { BookOpen, Search, User, Menu, X, ShoppingCart, TrendingUp, ArrowRight, Star } from "lucide-react";
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
  
  // Search States
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

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

  const isWriterMode = user?.isWriter && user?.subscription;

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "py-3 bg-white/70 backdrop-blur-xl border-b border-emerald-50/50 shadow-[0_8px_32px_rgba(6,78,59,0.05)]" 
            : "py-6 bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center group">
              <Logo className="scale-90 origin-left transition-transform group-hover:scale-95" />
            </Link>

            <div className="hidden lg:flex items-center gap-12">
              <div className="flex items-center gap-8">
                {!isWriterMode ? (
                  <>
                    <Link to="/browse" className="relative group py-2">
                      <span className="text-sm font-bold text-emerald-950/70 group-hover:text-emerald-950 transition-colors uppercase tracking-widest">
                        সব বই
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/join-writer" className="relative group py-2">
                      <span className="text-sm font-bold text-emerald-950/70 group-hover:text-emerald-950 transition-colors uppercase tracking-widest">
                        লেখক হন
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                ) : (
                  <Link to="/browse" className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                    <BookOpen className="w-4 h-4" />
                    বইসমূহ দেখুন
                  </Link>
                )}
              </div>

              {/* Sleek Search Bar */}
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
                  className={`
                    w-64 focus:w-80 px-12 py-2.5 bg-slate-50 rounded-2xl border border-transparent 
                    focus:border-emerald-100 focus:bg-white focus:shadow-2xl focus:shadow-emerald-900/5 
                    transition-all outline-none text-sm font-medium text-emerald-950 
                    placeholder:text-slate-300 placeholder:font-bold
                  `}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery) {
                      navigate(`/browse?q=${searchQuery}`);
                      setIsSearchFocused(false);
                    }
                  }}
                />

                <AnimatePresence>
                  {isSearchFocused && searchQuery && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.98 }}
                      className="absolute top-full mt-4 left-0 w-[28rem] bg-white rounded-[2.5rem] shadow-[0_32px_64px_rgba(6,78,59,0.12)] border border-emerald-50/50 overflow-hidden z-[100] backdrop-blur-2xl"
                    >
                      {hasResults ? (
                        <div className="p-5">
                          {filteredResults.books.length > 0 && (
                            <div className="mb-6">
                              <div className="flex items-center justify-between px-3 mb-3">
                                <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.3em]">বইসমূহ</p>
                                <span className="text-[9px] font-bold text-emerald-600/40 bg-emerald-50 px-2 py-0.5 rounded-full">{filteredResults.books.length} found</span>
                              </div>
                              <div className="space-y-1">
                                {filteredResults.books.map(book => (
                                  <Link 
                                    key={book.id}
                                    to={`/book/${book.id}`}
                                    className="flex items-center gap-4 p-3 hover:bg-emerald-50/50 rounded-2xl transition-all group"
                                    onClick={() => setSearchQuery("")}
                                  >
                                    <div className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                                      <img src={book.cover} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-emerald-950 text-sm mb-0.5 line-clamp-1 group-hover:text-emerald-600 transition-colors">{book.title}</p>
                                      <p className="text-xs font-medium text-slate-400">{book.author}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredResults.authors.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between px-3 mb-3">
                                <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.3em]">লেখক</p>
                              </div>
                              <div className="space-y-1">
                                {filteredResults.authors.map(author => (
                                  <Link 
                                    key={author.id}
                                    to={`/author/${encodeURIComponent(author.name)}`}
                                    className="flex items-center gap-4 p-3 hover:bg-emerald-50/50 rounded-2xl transition-all group"
                                    onClick={() => setSearchQuery("")}
                                  >
                                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm group-hover:rotate-6 transition-transform">
                                      <img src={author.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-emerald-950 text-sm mb-0.5 group-hover:text-emerald-600 transition-colors">{author.name}</p>
                                      <div className="flex items-center gap-1.5">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="text-[10px] font-black text-emerald-900">{author.rating}</span>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <button 
                            onClick={() => navigate(`/browse?q=${searchQuery}`)}
                            className="w-full mt-4 py-4 bg-emerald-950 text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest hover:bg-emerald-900 shadow-xl shadow-emerald-950/10"
                          >
                            সব ফলাফল দেখুন
                          </button>
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                            <Search className="w-8 h-8" />
                          </div>
                          <p className="text-slate-400 font-bold text-sm">কোনো ফলাফল পাওয়া যায়নি</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Area */}
              <div className="flex items-center gap-6 pl-8 border-l border-emerald-50">
                {!isWriterMode && (
                  <Link to="/checkout" className="p-3 bg-slate-50 hover:bg-emerald-600 rounded-2xl transition-all relative group/cart hover:-translate-y-1">
                    <ShoppingCart className="w-5 h-5 text-emerald-950 group-hover:text-white transition-colors" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white shadow-lg group-hover:bg-emerald-950 transition-colors">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                )}

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-3 p-1 pr-5 bg-white border border-emerald-50 rounded-2xl hover:bg-emerald-50 transition-all group"
                    >
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
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-[0_32px_64px_rgba(6,78,59,0.12)] border border-emerald-50/50 py-5 z-50"
                        >
                          <div className="px-8 py-4 border-b border-emerald-50/50 mb-3">
                            <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                            <p className="text-sm font-black text-emerald-950 truncate">{user.email}</p>
                          </div>
                          <div className="px-3 space-y-1">
                            <Link to="/writer" className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-emerald-950 hover:bg-emerald-50 rounded-2xl transition-colors" onClick={() => setIsProfileOpen(false)}>
                              <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              লেখক ড্যাশবোর্ড
                            </Link>
                            <Link to="/browse" className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-emerald-950 hover:bg-emerald-50 rounded-2xl transition-colors" onClick={() => setIsProfileOpen(false)}>
                              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              আমার লাইব্রেরি
                            </Link>
                          </div>
                          <div className="h-px bg-emerald-50/50 my-3 mx-6"></div>
                          <div className="px-3">
                            <button 
                              onClick={() => { signOut(); setIsProfileOpen(false); }}
                              className="w-full text-left px-5 py-4 text-xs text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors font-black uppercase tracking-[0.2em]"
                            >
                              লগআউট করুন
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="group relative px-10 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    লগইন করুন
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => user ? setIsProfileOpen(!isProfileOpen) : setIsAuthOpen(true)}
                className="p-2 relative bg-slate-50 rounded-xl"
              >
                {user?.avatar ? (
                  <img src={user.avatar} className="w-6 h-6 rounded-full" alt="Profile" />
                ) : (
                  <User className="w-6 h-6 text-emerald-950" />
                )}
              </button>
              <button className="p-2 text-emerald-950 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-emerald-50 bg-white overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-10 space-y-6">
                <Link to="/browse" className="block text-2xl font-black text-emerald-950" onClick={() => setIsMenuOpen(false)}>সব বই</Link>
                <Link to="/join-writer" className="block text-2xl font-black text-emerald-950" onClick={() => setIsMenuOpen(false)}>লেখক হন</Link>
                <Link to="/checkout" className="flex items-center justify-between text-2xl font-black text-emerald-950" onClick={() => setIsMenuOpen(false)}>
                  <span>কার্ট</span>
                  {cart.length > 0 && (
                    <span className="text-sm bg-emerald-600 text-white px-4 py-1 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                
                {user && (
                  <>
                    <div className="h-px bg-emerald-50"></div>
                    <Link to="/writer" className="block text-xl font-bold text-emerald-600" onClick={() => setIsMenuOpen(false)}>লেখক ড্যাশবোর্ড</Link>
                    <Link to="/browse" className="block text-xl font-bold text-emerald-950" onClick={() => setIsMenuOpen(false)}>আমার লাইব্রেরি</Link>
                  </>
                )}

                <div className="h-px bg-emerald-50"></div>
                {user ? (
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black uppercase tracking-widest">লগআউট</button>
                ) : (
                  <button onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-600/20 uppercase tracking-widest">
                    লগইন করুন
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-emerald-100">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-emerald-950 tracking-tight">{authMode === "login" ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}</h2>
                <p className="text-sm font-bold text-emerald-600/60 mt-1 uppercase tracking-widest">Premium Access</p>
              </div>
              <button onClick={() => setIsAuthOpen(false)} className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-950"><X className="w-7 h-7" /></button>
            </div>
            <div className="space-y-8">
              <button onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full py-4 px-6 border-2 border-emerald-50 rounded-2xl flex items-center justify-center gap-4 hover:bg-emerald-50 hover:border-emerald-100 transition-all group disabled:opacity-50">
                {isGoogleLoading ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> : (
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span className="font-black text-emerald-950">Continue with Google</span>
              </button>
              <div className="flex items-center gap-5 text-[10px] font-black text-emerald-600/30 uppercase tracking-[0.3em]"><div className="h-px bg-emerald-50 flex-1"></div>অথবা<div className="h-px bg-emerald-50 flex-1"></div></div>
              <form onSubmit={handleAuth} className="space-y-5">
                {authMode === "register" && (
                  <div><label className="block mb-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">আপনার নাম</label><input type="text" required className="w-full px-5 py-4 bg-emerald-50/50 rounded-2xl border border-transparent focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-emerald-950" placeholder="আরিফ রহমান" /></div>
                )}
                <div><label className="block mb-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">ইমেইল এড্রেস</label><input type="email" required className="w-full px-5 py-4 bg-emerald-50/50 rounded-2xl border border-transparent focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-emerald-950" placeholder="your@email.com" /></div>
                <div><label className="block mb-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">পাসওয়ার্ড</label><input type="password" required className="w-full px-5 py-4 bg-emerald-50/50 rounded-2xl border border-transparent focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-emerald-950" placeholder="••••••••" /></div>
                
                {error && (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 animate-shake">
                    {error}
                  </div>
                )}
                
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-lg">
                  {authMode === "login" ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}
                  <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-center text-sm font-bold text-emerald-600/60 mt-8">{authMode === "login" ? "নতুন ইউজার?" : "পূর্বেই একাউন্ট আছে?"} <button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-emerald-600 font-black hover:underline underline-offset-4 ml-1">{authMode === "login" ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"}</button></p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
