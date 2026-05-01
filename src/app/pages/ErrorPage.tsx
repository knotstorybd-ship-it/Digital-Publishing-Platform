import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertCircle, Home, RefreshCw, MessageSquare } from "lucide-react";
import { SEO } from "../components/SEO";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে। আমরা বিষয়টি সমাধানের চেষ্টা করছি।";
  let statusCode = "500";
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
    statusCode = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 selection:bg-rose-100">
      <SEO title={`Error ${statusCode}`} />
      
      <div className="max-w-2xl w-full text-center relative">
        <div className="relative z-10">
          <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center mx-auto mb-10 relative">
             <div className="absolute inset-0 bg-rose-500/5 blur-[40px] rounded-full animate-pulse"></div>
             <AlertCircle className="w-16 h-16 text-rose-500 relative z-10" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-emerald-950 mb-6 tracking-tighter italic opacity-10 absolute -top-12 left-1/2 -translate-x-1/2 select-none">
            {statusCode}
          </h1>

          <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-6 tracking-tight leading-tight">
             কিছু একটা <span className="text-rose-500">ভুল হয়েছে</span>
          </h2>

          <p className="text-slate-500 font-medium text-lg mb-12 italic leading-relaxed max-w-lg mx-auto">
             {errorMessage}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5" />
              আবার চেষ্টা করুন
            </button>
            <Link 
              to="/"
              className="flex-1 py-5 bg-white border border-slate-100 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5" />
              হোমপেজে ফিরে যান
            </Link>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col items-center gap-6">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Technical Support</p>
             <div className="flex items-center gap-6">
                <a href="/support" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> যোগাযোগ করুন
                </a>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Digital Prokashoni v1.0</span>
             </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none -z-10 overflow-hidden">
           <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-rose-50 rounded-full blur-[120px] opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
