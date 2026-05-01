import { Library, Bookmark, Clock, Star, BookOpen, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import { BookCardSkeleton } from "../components/Skeleton";

export function LibraryPage() {
  const { user, books, orders, loading } = useStore();
  const [search, setSearch] = useState("");

  const purchasedBooks = useMemo(() => {
    if (!user) return [];
    // Get unique book IDs from completed orders
    const purchasedIds = orders
      .filter(o => o.user_id === user.id && o.status === 'completed' && o.order_type === 'book')
      .map(o => o.book_id);
    
    return books.filter(b => purchasedIds.includes(b.id));
  }, [user, books, orders]);

  const filteredBooks = purchasedBooks.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 pt-24">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
            <Library className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-emerald-950 mb-4 tracking-tight">লগইন প্রয়োজন</h2>
          <p className="text-slate-500 font-medium mb-10">আপনার কেনা বইগুলো দেখতে প্রথমে লগইন করুন।</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth"))}
            className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-32 pb-20 selection:bg-emerald-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                  <Library className="w-6 h-6" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter italic">আমার <span className="text-emerald-600">লাইব্রেরি</span></h1>
              </div>
              <p className="text-slate-500 font-medium text-lg italic">আপনার ব্যক্তিগত সংগ্রহের সব বই এখানে সংরক্ষিত আছে</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center px-8 border-r border-slate-100">
                <p className="text-3xl font-black text-emerald-950 leading-none mb-2">{purchasedBooks.length}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">সংগৃহীত বই</p>
              </div>
              <div className="text-center px-8">
                <p className="text-3xl font-black text-emerald-600 leading-none mb-2">০</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">পঠিত বই</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="সংগ্রহ থেকে বই খুঁজুন..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white rounded-[2rem] border-0 shadow-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[...Array(5)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : purchasedBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {filteredBooks.map((book, i) => (
              <div
                key={book.id}
                className="opacity-100"
              >
                <div className="group relative">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-950/10 mb-6 group-hover:-translate-y-2 transition-all duration-500">
                    <img src={book.cover} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <Link 
                        to={`/reader/${book.id}`}
                        className="w-full py-4 bg-white text-emerald-950 rounded-2xl font-black text-center shadow-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-5 h-5" /> এখনই পড়ুন
                      </Link>
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <h3 className="text-lg font-black text-emerald-950 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">{book.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{book.author}</p>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-0 group-hover:w-[15%] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-900/5">
              <Bookmark className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-emerald-950 mb-4">কোনো বই খুঁজে পাওয়া যায়নি</h3>
            <p className="text-slate-500 font-medium mb-10">আপনার সংগ্রহে যোগ করতে আমাদের কালেকশন ঘুরে দেখুন।</p>
            <Link 
              to="/browse"
              className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
            >
              বই কিনুন <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
