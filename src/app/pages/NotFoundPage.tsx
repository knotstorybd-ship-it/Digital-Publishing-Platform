import { Link } from "react-router";
import { Home, Search, Compass, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 selection:bg-emerald-100 overflow-hidden relative">
      <SEO title="৪-০-৪ পাতাটি পাওয়া যায়নি" />
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-3xl w-full text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          {/* Large 404 Backdrop */}
          <h1 className="text-[15rem] md:text-[25rem] font-black text-emerald-950/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none tracking-tighter">
            404
          </h1>

          <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center mx-auto mb-10 relative group">
             <div className="absolute inset-0 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 transition-all"></div>
             <Compass className="w-16 h-16 text-emerald-600 relative z-10 animate-[spin_10s_linear_infinite]" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-emerald-950 mb-6 tracking-tight leading-tight italic">
             পথ <span className="text-emerald-600">হারিয়ে গেছে?</span>
          </h2>

          <p className="text-slate-500 font-medium text-lg mb-12 italic leading-relaxed max-w-lg mx-auto">
             দুঃখিত, আপনি যে পাতাটি খুঁজছেন সেটি খুঁজে পাওয়া যাচ্ছে না। সম্ভবত এটি সরিয়ে ফেলা হয়েছে অথবা ইউআরএল ভুল করা হয়েছে।
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/"
              className="group w-full sm:w-auto px-12 py-6 bg-emerald-950 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-950/20 hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Home className="w-6 h-6" />
              হোমপেজে ফিরে যান
            </Link>
            <Link 
              to="/browse"
              className="group w-full sm:w-auto px-12 py-6 bg-white border-2 border-emerald-50 text-emerald-900 rounded-[2rem] font-black hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Search className="w-6 h-6" />
              বইয়ের দুনিয়া দেখুন
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="mt-20 flex items-center justify-center gap-8">
             {[
               { label: "প্রচ্ছদ", link: "/" },
               { label: "লেখকবৃন্দ", link: "/browse" },
               { label: "সহায়তা", link: "/support" }
             ].map((item, i) => (
               <Link 
                 key={i} 
                 to={item.link} 
                 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors"
               >
                 {item.label}
               </Link>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
