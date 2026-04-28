import { motion, AnimatePresence } from "motion/react";
import { X, Zap, ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("hasSeenPromo");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPromo", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/80">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[3rem] max-w-2xl w-full overflow-hidden shadow-2xl shadow-emerald-950/40 border border-emerald-100"
          >
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-6 right-6 z-20 p-2 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors text-emerald-950"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Side: Visuals */}
              <div className="md:w-1/2 bg-emerald-950 p-10 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-emerald-950 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                    <Zap className="w-3 h-3 fill-emerald-950" />
                    Limited Slots Left
                  </div>
                  <h2 className="text-4xl font-black text-white leading-tight mb-4">
                    ৬ মাসের <br /> বিশেষ সুবিধা
                  </h2>
                  <p className="text-emerald-100/70 font-medium text-sm leading-relaxed mb-8">
                    ৬ মাসের জন্য লেখক একাউন্ট এবং ১৫% কমিশন সুবিধা গ্রহণ করুন। সীমিত সময়ের অফার!
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />)}
                    </div>
                    <span className="text-white font-black text-xs">৫০০০+ লেখক যুক্ত আছেন</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Offer & CTA */}
              <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white border-l border-emerald-100">
                <div className="mb-8">
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">প্রিমিয়াম প্ল্যান ২</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-emerald-950">৳৪৫০</span>
                    <span className="text-emerald-600/40 font-bold line-through">৳৯৯৯</span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-emerald-600">৬ মাসের মেম্বারশিপ</div>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    "৬টি বই প্রদর্শনের সুযোগ",
                    "৬ মাসের মেম্বারশিপ",
                    "১৫% সর্বনিম্ন কমিশন",
                    "ফ্রি মার্কেটিং সাপোর্ট"
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-emerald-950">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/checkout?plan=plan2&price=450"
                  onClick={closePopup}
                  className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black shadow-xl shadow-emerald-950/20 hover:bg-black transition-all flex items-center justify-center gap-3 group"
                >
                  প্ল্যানটি গ্রহণ করুন
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button 
                  onClick={closePopup}
                  className="mt-6 text-xs font-bold text-emerald-600/40 hover:text-emerald-600 transition-colors uppercase tracking-widest text-center"
                >
                  এখন না, পরে দেখব
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
