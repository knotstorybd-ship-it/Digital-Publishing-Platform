import { useParams, useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import { ArrowLeft, Maximize2, Minimize2, ChevronLeft, ChevronRight, Settings, Info, Share2, Download, Printer } from "lucide-react";
import { useState, useEffect } from "react";

export function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, user, orders } = useStore();
  const book = getBookById(id || "");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  // Security Check: Ensure user has purchased the book
  const isPurchased = user && orders.some(o => o.book_id === id && o.user_id === user.id && o.status === 'completed');
  
  useEffect(() => {
    if (!isPurchased && user) {
      // Allow author to read their own books
      if (user.name !== book?.author) {
        // navigate(`/book/${id}`);
      }
    }
  }, [isPurchased, user, id, book, navigate]);

  if (!book) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col h-screen overflow-hidden selection:bg-emerald-500/30">
      {/* Header Bar */}
      <div className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-lg font-black tracking-tight leading-none mb-1">{book.title}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-white/5 rounded-2xl p-1">
            <button 
              onClick={() => setZoom(prev => Math.max(50, prev - 10))}
              className="w-10 h-10 flex items-center justify-center font-black hover:text-emerald-500"
            >-</button>
            <span className="px-3 text-[10px] font-black uppercase tracking-widest text-white/40">{zoom}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(200, prev + 10))}
              className="w-10 h-10 flex items-center justify-center font-black hover:text-emerald-500"
            >+</button>
          </div>
          
          <div className="h-10 w-px bg-white/10 hidden md:block mx-2"></div>
          
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <a 
            href={book.pdf_url} 
            download 
            className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-slate-900/50 relative flex justify-center p-4 md:p-12 scrollbar-hide">
        <div 
          style={{ width: `${zoom}%`, maxWidth: '1000px' }}
          className="bg-white rounded-lg shadow-[0_50px_100px_rgba(0,0,0,0.5)] origin-top min-h-full"
        >
          {book.pdf_url ? (
            <div className="w-full h-full min-h-[1400px]">
              {/* If it's a PDF, we try to use iframe, otherwise show it as an image */}
              {book.pdf_url.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={`${book.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full rounded-lg border-0 min-h-[1400px]"
                  title="PDF Reader"
                />
              ) : (
                <div className="p-8 md:p-20 text-emerald-950 font-serif leading-[2] text-xl">
                   <img src={book.pdf_url} className="w-full rounded-lg shadow-2xl mb-12" alt="Page Content" />
                   <h2 className="text-4xl font-black mb-10 tracking-tight italic border-b-2 border-emerald-100 pb-6">{book.title}</h2>
                   <p className="mb-12 italic text-slate-400 font-bold border-l-4 border-emerald-500 pl-8">অধ্যায় ১: সূচনার পথ</p>
                   {book.description || "পুস্তকটির মূল বিষয়বস্তু এখানে প্রদর্শিত হবে। আপনার পঠন অভিজ্ঞতা উন্নত করতে আমরা ডিজিটাল ফরম্যাটের আধুনিকায়ন করছি।"}
                   {/* Dummy text to show a realistic reader */}
                   <div className="mt-12 opacity-80 leading-loose">
                    ডিজিটাল প্রকাশনার এক নতুন দিগন্ত। প্রতিটি শব্দ, প্রতিটি বাক্য এখানে আপনার মনের কোণে জায়গা করে নিতে প্রস্তুত। আধুনিক প্রকাশনী শুধু বই বিক্রি করে না, তারা সৃষ্টি করে এক একটি স্বপ্ন। 
                    আপনার এই পঠন যাত্রা আনন্দদায়ক হোক। আমাদের সংগ্রহে আরও হাজারো বই রয়েছে যা আপনার মেধার বিকাশ ঘটাতে সহায়ক হবে।
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-20 text-slate-300">
               <div className="text-center">
                  <Info className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                  <p className="font-bold">বইটির ডিজিটাল কন্টেন্ট পাওয়া যায়নি</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="h-24 bg-black/60 backdrop-blur-xl border-t border-white/5 px-8 flex items-center justify-between shrink-0">
        <div className="hidden md:flex items-center gap-4">
           <button className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">সুচিপত্র</button>
           <button className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">বুকমার্ক</button>
        </div>

        <div className="flex items-center gap-8 mx-auto md:mx-0">
           <button 
             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
             className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-transparent transition-all"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
           <div className="flex items-center gap-3">
              <span className="text-xl font-black italic">{currentPage}</span>
              <span className="text-white/20 font-bold">/</span>
              <span className="text-lg text-white/40 font-bold italic">{book.pages || '??'}</span>
           </div>
           <button 
             onClick={() => setCurrentPage(p => p + 1)}
             className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-transparent transition-all"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
           <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
             <Share2 className="w-5 h-5" />
           </button>
           <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
             <Printer className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
}
