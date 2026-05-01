import { useState, useEffect } from "react";
import { BookCard } from "../components/BookCard";
import { Search, Filter, SlidersHorizontal, BookOpen, Sparkles, TrendingUp, Grid, List } from "lucide-react";
import { useStore } from "../store/useStore";
import { useSearchParams } from "react-router";
import { SEO } from "../components/SEO";
import { BookCardSkeleton } from "../components/Skeleton";

const categories = ["সব", "উপন্যাস", "কবিতা", "ইতিহাস", "শিশু সাহিত্য", "ভয়ংকর", "রম্য"];

export function BrowsePage() {
  const { books, searchQuery, setSearchQuery, loading } = useStore();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "সব");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === "সব" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-24 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      <SEO 
        title={`বইসমূহ - ${selectedCategory !== 'সব' ? selectedCategory : 'সব বিভাগ'}`}
        description={`আমাদের প্ল্যাটফর্মের ${selectedCategory !== 'সব' ? selectedCategory : 'সকল'} ক্যাটাগরির সেরা বইগুলো খুঁজে নিন এবং ডিজিটাল মাধ্যমে পড়ুন।`}
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">বইয়ের বিশাল সংগ্রহশালা</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tight leading-tight">
              আপনার পছন্দের <br />
              <span className="text-emerald-600">বই খুঁজে নিন</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm shadow-emerald-900/5">
            <button 
              onClick={() => setViewType("grid")}
              className={`p-2.5 rounded-xl transition-all ${viewType === 'grid' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewType("list")}
              className={`p-2.5 rounded-xl transition-all ${viewType === 'list' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="বইয়ের নাম, লেখকের নাম বা কি-ওয়ার্ড দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
            <button className="px-10 py-5 bg-emerald-950 text-white rounded-3xl font-black shadow-xl shadow-emerald-950/10 hover:bg-emerald-900 transition-all flex items-center gap-3 justify-center">
              <SlidersHorizontal className="w-5 h-5" />
              অ্যাডভান্সড ফিল্টার
            </button>
          </div>

          <div className="h-px bg-slate-50 my-10"></div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-8 py-3 rounded-2xl whitespace-nowrap transition-all font-black text-sm uppercase tracking-widest
                  ${selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                    : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-black text-emerald-950 uppercase tracking-widest">
                {filteredBooks.length}টি বই পাওয়া গেছে
              </span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              সর্টিং: সর্বশেষ প্রকাশিত
            </div>
          </div>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {[...Array(8)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredBooks.length > 0 ? (
              <div 
                className={`grid gap-8 ${viewType === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-1'}`}
              >
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="opacity-100"
                  >
                    <BookCard key={book.id} {...book} />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-8">
                  <Search className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950 mb-2">কোনো বই খুঁজে পাওয়া যায়নি</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">
                  দুঃখিত, আপনার দেওয়া কি-ওয়ার্ড বা ফিল্টারের সাথে মিলে এমন কোনো বই পাওয়া যায়নি। আবার চেষ্টা করুন।
                </p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("সব");}}
                  className="mt-8 px-10 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black hover:bg-emerald-100 transition-all"
                >
                  ফিল্টার ক্লিয়ার করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
