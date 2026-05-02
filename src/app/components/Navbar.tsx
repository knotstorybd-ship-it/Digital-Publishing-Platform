import { Link, useNavigate, useLocation } from "react-router";
import { BookOpen, Search, User, Menu, X, ShoppingCart, TrendingUp, ArrowRight, Star, Library } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Logo } from "./Logo";

export function Navbar() {
  const { cart, user, signIn, signInWithGoogle, signOut, books, authors, searchQuery, setSearchQuery } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsEmailLoading(true);
    setError("");
    try {
      if (authMode === "login") {
        if (!passwordInput) {
          // Fallback to magic link if no password (optional, but user asked for password auth)
          await signIn(emailInput.trim());
        } else {
          await useStore().signInWithPassword(emailInput.trim(), passwordInput);
        }
      } else {
        if (!nameInput || !passwordInput) {
          throw new Error("সবগুলো ঘর পূরণ করুন।");
        }
        if (passwordInput.length < 6) {
          throw new Error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        }
        await useStore().signUp(emailInput.trim(), passwordInput, nameInput);
        alert("আপনার ইমেইল ভেরিফাই করতে ইনবক্স চেক করুন।");
      }
      setIsAuthOpen(false);
    } catch (err: any) {
      setError(err.message || "লগইন করতে সমস্যা হয়েছে।");
    } finally {
      setIsEmailLoading(false);
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
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center group"
            >
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
                    <span className="text-sm font-black text-emerald-600 group-hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-2">
                      প্রকাশ করুন
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    </span>
                  </Link>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative w-80 group">
                <div className={`
                  flex items-center gap-3 px-6 py-3 bg-slate-50 border-2 transition-all duration-300 rounded-[1.25rem]
                  ${isSearchFocused ? 'border-emerald-500/50 bg-white ring-4 ring-emerald-50' : 'border-transparent'}
                `}>
                  <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    placeholder="বই খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="bg-transparent border-0 p-0 text-sm font-bold text-emerald-950 focus:ring-0 w-full placeholder:text-slate-300 placeholder:italic"
                  />
                </div>

                {/* Quick Search Results */}
                {isSearchFocused && hasResults && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-100 p-4 space-y-4">
                    {filteredResults.books.length > 0 && (
                      <div className="space-y-3">
                        <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">বইসমূহ</p>
                        {filteredResults.books.map(book => (
                          <Link 
                            key={book.id} 
                            to={`/book/${book.id}`}
                            onClick={() => setSearchQuery("")}
                            className="flex items-center gap-4 p-2 rounded-2xl hover:bg-emerald-50/50 transition-all group"
                          >
                            <img src={book.cover} className="w-10 h-14 object-cover rounded-lg shadow-md" />
                            <div>
                              <p className="text-xs font-black text-emerald-950 group-hover:text-emerald-600">{book.title}</p>
                              <p className="text-[10px] font-bold text-slate-400">{book.author}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {showCart && (
                <Link 
                  to="/checkout" 
                  className="relative p-2.5 bg-slate-50 text-emerald-950 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                    {cart.length}
                  </span>
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-emerald-600/20">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-black text-emerald-950 hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                      <div className="p-6 bg-emerald-600 text-white relative overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">স্বাগতম,</p>
                        <p className="font-black text-lg truncate leading-none">{user.name}</p>
                      </div>
                      <div className="p-3">
                        {user.isAdmin && (
                          <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-emerald-950 font-bold transition-all">
                            <Star className="w-4 h-4 text-emerald-600" /> অ্যাডমিন ড্যাশবোর্ড
                          </Link>
                        )}
                        <Link to={user.isWriter ? "/writer" : "/join-writer"} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-emerald-950 font-bold transition-all">
                          <TrendingUp className="w-4 h-4 text-emerald-600" /> রাইটার ড্যাশবোর্ড
                        </Link>
                        <Link to="/library" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-emerald-950 font-bold transition-all">
                          <Library className="w-4 h-4 text-emerald-600" /> আমার লাইব্রেরি
                        </Link>
                        <div className="h-px bg-slate-100 my-2 mx-3"></div>
                        <button onClick={() => { signOut(); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-50 text-rose-500 font-bold transition-all">
                          <ArrowRight className="w-4 h-4" /> লগ আউট
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-3 px-8 py-3.5 bg-emerald-950 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-950/20 hover:bg-black transition-all"
                >
                  <User className="w-4 h-4" />
                  লগইন
                </button>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 bg-slate-50 text-emerald-950 rounded-2xl hover:bg-slate-100 lg:hidden"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-24 bg-white z-[100] p-6 shadow-2xl">
            <div className="space-y-6">
              <Link to="/browse" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 text-xl font-black text-emerald-950">
                <BookOpen className="text-emerald-600" /> সব বই
              </Link>
              {user && (
                <Link to="/library" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 text-xl font-black text-emerald-950">
                  <Library className="text-emerald-600" /> আমার লাইব্রেরি
                </Link>
              )}
              {!isWriterMode && (
                <Link to="/join-writer" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-3xl bg-emerald-600 text-xl font-black text-white shadow-xl shadow-emerald-600/20">
                  <TrendingUp /> লেখক হোন
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-emerald-950 mb-3 tracking-tight">
                {authMode === "login" ? (
                  <>আপনার অ্যাকাউন্টে <br /><span className="text-emerald-600">লগইন করুন</span></>
                ) : (
                  <>নতুন অ্যাকাউন্ট <br /><span className="text-emerald-600">তৈরি করুন</span></>
                )}
              </h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest italic">Digital Prokashoni</p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-4 bg-white border-2 border-slate-100 text-emerald-950 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-4 mb-6 shadow-sm disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
              )}
              গুগল দিয়ে {authMode === "login" ? "লগইন" : "সাইনআপ"}
            </button>


            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">অথবা</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="আপনার পূর্ণ নাম..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-emerald-950 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  required
                />
              )}
              <input
                type="email"
                placeholder="আপনার ইমেইল দিন..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-emerald-950 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                required
              />
              <input
                type="password"
                placeholder="পাসওয়ার্ড দিন..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-emerald-950 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                required={authMode === "signup"}
              />
              
              {error && <p className="text-rose-500 text-xs font-bold px-2">{error}</p>}
              
              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 disabled:opacity-50"
              >
                {isEmailLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  authMode === "login" ? "লগইন করুন" : "অ্যাকাউন্ট তৈরি করুন"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {authMode === "login" ? "অ্যাকাউন্ট নেই? সাইনআপ করুন" : "অ্যাকাউন্ট আছে? লগইন করুন"}
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 font-medium">
              লগইন করার মাধ্যমে আপনি আমাদের <Link to="/terms" className="text-emerald-600 font-bold underline">শর্তাবলী</Link> মেনে নিচ্ছেন।
            </p>
          </div>
        </div>
      )}
    </>
  );
}
