import { Link } from "react-router";
import { Home, Search, Compass, ArrowRight } from "lucide-react";
import { SEO } from "../components/SEO";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 selection:bg-emerald-100 overflow-hidden relative">
      <SEO title="৪-০-৪ পাতাটি পাওয়া যায়নি" />
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-50 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-3xl w-full text-center relative z-10">
        <div className="relative inline-block mb-12">
          <div className="text-[12rem] md:text-[20rem] font-black text-emerald-950/5 leading-none tracking-tighter italic">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(5,150,105,0.1)] border border-slate-100 flex items-center justify-center">
              <Compass className="w-16 h-16 md:w-24 md:h-24 text-emerald-600" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-emerald-950 mb-6 tracking-tight">দুঃখিত, পাতাটি <br /><span className="text-emerald-600">খুঁজে পাওয়া যায়নি!</span></h1>
        <p className="text-slate-500 font-medium text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
          হয়তো পাতাটি সরিয়ে ফেলা হয়েছে অথবা আপনি ভুল লিংকে প্রবেশ করেছেন। আমরা দুঃখিত আপনার এই অভিজ্ঞতার জন্য।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/" 
            className="w-full sm:w-auto px-10 py-5 bg-emerald-950 text-white rounded-2xl font-black shadow-2xl shadow-emerald-950/20 hover:bg-black transition-all flex items-center justify-center gap-3 group"
          >
            <Home className="w-5 h-5" />
            হোমপেজে ফিরে যান
          </Link>
          <Link 
            to="/browse" 
            className="w-full sm:w-auto px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black border-2 border-slate-100 hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center justify-center gap-3"
          >
            বইসমূহ খুঁজুন
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-20 flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Quick Search</p>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600" />
              <input 
                type="text" 
                placeholder="বই খুঁজুন..." 
                className="pl-12 pr-6 py-3 bg-slate-50 border-0 rounded-xl font-bold text-sm focus:ring-4 focus:ring-emerald-50 outline-none transition-all w-48 group-focus-within:w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
