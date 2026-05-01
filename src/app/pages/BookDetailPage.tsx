import { useParams, Link } from "react-router";
import { Star, ShoppingCart, Heart, Share2, Download, Eye, BookOpen, ShieldCheck, Zap, ArrowLeft, Bookmark } from "lucide-react";
import { BookCard } from "../components/BookCard";
import { useStore } from "../store/useStore";
import { SEO } from "../components/SEO";

export function BookDetailPage() {
  const { id } = useParams();
  const { getBookById, addToCart, books, orders, user, favoriteBookIds, toggleFavoriteBook } = useStore();
  const book = getBookById(id || "");
  const isPurchased = user && orders.some(o => o.book_id === book?.id && o.user_id === user.id);
  const isWishlisted = book ? favoriteBookIds.includes(book.id) : false;

  if (!book) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto">
            <BookOpen className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black text-emerald-950">বইটি পাওয়া যায়নি</h1>
          <p className="text-slate-500">দুঃখিত, এই বইটি আমাদের সংগ্রহে নেই।</p>
          <Link to="/browse" className="inline-flex px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20">
            বইসমূহ দেখুন
          </Link>
        </div>
      </div>
    );
  }

  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(book);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-24 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      <SEO 
        title={`${book.title} - ${book.author}`}
        description={book.description?.slice(0, 160) || `${book.author}-এর লেখা চমৎকার এই বইটি এখনই পড়ুন ডিজিটাল প্রকাশনীতে।`}
        image={book.cover}
        type="book"
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          লাইব্রেরিতে ফিরে যান
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 mb-20">
          {/* Left: Book Cover & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-32">
            <div className="relative group">
                <div className="absolute inset-0 bg-emerald-600/10 blur-[100px] rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white bg-white aspect-[2/3]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <button className="w-full py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest text-xs border border-white/20 hover:bg-white/30 transition-all">
                      প্রিভিউ দেখুন
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-10">
                {isPurchased ? (
                  <div className="flex-[3] flex flex-col gap-3">
                    <Link 
                      to={`/reader/${book.id}`}
                      className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      <BookOpen className="w-6 h-6" />
                      এখনই পড়ুন
                    </Link>
                    <a 
                      href={book.pdf_url} 
                      download 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-emerald-950/5 text-emerald-950 rounded-2xl font-black border border-emerald-950/10 hover:bg-emerald-950 hover:text-white transition-all flex items-center justify-center gap-3 text-xs"
                    >
                      <Download className="w-4 h-4" />
                      অফলাইন ডাউনলোড
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-[3] py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    ৳{book.price} - কার্টে যোগ করুন
                  </button>
                )}
                <button 
                  onClick={async () => {
                    if (!book) return;
                    if (!user) {
                      window.dispatchEvent(new CustomEvent("open-auth"));
                      return;
                    }
                    try {
                      await toggleFavoriteBook(book.id);
                    } catch (err: any) {
                      alert("ডেটাবেস এরর: " + (err.message || "অ্যাকশন সম্পন্ন করা যায়নি"));
                    }
                  }}
                  className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex items-center justify-center ${isWishlisted ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-lg shadow-rose-500/10' : 'bg-white border-slate-100 text-slate-300 hover:border-emerald-200 hover:text-emerald-600'}`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
                <button className="flex-1 p-6 bg-white border-2 border-slate-100 text-slate-300 rounded-[2rem] hover:border-emerald-200 hover:text-emerald-600 transition-all flex items-center justify-center">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {book.category}
                </span>
                <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-600" />
                  Bestseller
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-emerald-950 mb-6 tracking-tight leading-tight">
                {book.title}
              </h1>
              
              <Link 
                to={`/author/${encodeURIComponent(book.author)}`}
                className="inline-flex items-center gap-4 group mb-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${book.author}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">লেখক</p>
                  <p className="text-xl font-black text-emerald-950 group-hover:text-emerald-600 transition-colors">{book.author}</p>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-10 py-8 border-y border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                    <Star className="w-6 h-6 fill-amber-600" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-950">{book.rating}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{book.reviews} রিভিউ</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-950">{orders.filter(o => o.book_id === book.id).length}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পাঠক</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-950">{book.pages}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পৃষ্ঠা সংখ্যা</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-emerald-950 mb-6 uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                বইয়ের সারসংক্ষেপ
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg mb-10">
                {book.description || "এই বইটির কোনো বিস্তারিত বিবরণ এখনো পাওয়া যায়নি। লেখক খুব শীঘ্রই এটি আপডেট করবেন।"}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "ভাষা", val: book.language || "বাংলা" },
                  { label: "প্রকাশকাল", val: book.published || "২০২৪" },
                  { label: "ফরম্যাট", val: "PDF, EPUB" },
                  { label: "প্রকাশনা", val: "অ্যান্টিগ্রাভিটি" }
                ].map((info, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                    <p className="font-black text-emerald-950 text-sm truncate">{info.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 blur-[100px] opacity-10 -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-8 tracking-tight">কেন এই বইটি পড়বেন?</h3>
                <div className="space-y-6">
                  {[
                    { title: "তাৎক্ষণিক এক্সেস", desc: "কেনার সাথে সাথেই ডিজিটাল কপি ডাউনলোড করতে পারবেন।", icon: Zap },
                    { title: "আজীবন মালিকানা", desc: "একবার কিনলে আপনার লাইব্রেরিতে চিরস্থায়ী থাকবে।", icon: ShieldCheck },
                    { title: "সর্বোচ্চ মান", desc: "বইটি উন্নত ফন্ট এবং ডিজাইনে সাজানো হয়েছে।", icon: Star }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-emerald-500 transition-colors">
                        <feat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-lg mb-1 tracking-tight">{feat.title}</p>
                        <p className="text-emerald-100/60 font-medium text-sm leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        <div>
          <div className="flex items-center justify-between mb-10 px-4">
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">আপনার আরও যা <span className="text-emerald-600">পছন্দ হতে পারে</span></h2>
            <Link to="/browse" className="text-sm font-black text-emerald-600 hover:underline uppercase tracking-widest">সব দেখুন</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
