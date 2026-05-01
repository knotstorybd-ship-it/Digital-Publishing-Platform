import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full"
          >
            <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-rose-500 border border-rose-100 shadow-xl shadow-rose-500/5">
              <AlertTriangle className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-emerald-950 mb-6 tracking-tight leading-tight">
              কিছু একটা <span className="text-rose-500">ভুল হয়েছে</span>
            </h1>
            
            <p className="text-slate-500 font-medium text-lg mb-12 italic leading-relaxed">
              দুঃখিত, অ্যাপ্লিকেশনটি চলাকালীন একটি অনাকাঙ্ক্ষিত ত্রুটি দেখা দিয়েছে। আমরা বিষয়টি সমাধানের চেষ্টা করছি।
            </p>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 mb-12 text-left overflow-hidden shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Details</span>
               </div>
               <code className="text-xs font-mono text-rose-600 break-all leading-loose">
                 {this.state.error?.message || "Internal Application Error"}
               </code>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                আবার চেষ্টা করুন
              </button>
              <a 
                href="/"
                className="flex-1 py-5 bg-white border border-slate-100 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                <Home className="w-5 h-5" />
                হোমপেজে ফিরে যান
              </a>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100 flex items-center justify-center gap-6">
               <a href="/support" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
                 <MessageSquare className="w-4 h-4" /> সাপোর্ট টিম
               </a>
               <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Digital Prokashoni v1.0</span>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.children;
  }
}
