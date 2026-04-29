import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Smartphone, Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

interface BkashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (transactionId: string) => void;
  orderType?: "Book" | "Subscription";
}

export function BkashPaymentModal({ isOpen, onClose, amount, onSuccess, orderType = "Book" }: BkashPaymentModalProps) {
  const [step, setStep] = useState(1); // 1: Number, 2: OTP, 3: PIN, 4: Processing, 5: Success
  const [bkashNumber, setBkashNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-close success after 3 seconds
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        onSuccess("BK" + Math.random().toString(36).substring(2, 10).toUpperCase());
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!/^01\d{9}$/.test(bkashNumber)) {
        setError("সঠিক বিকাশ নম্বর দিন (যেমন: 017xxxxxxxx)");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1500);
    } else if (step === 2) {
      if (otp.length < 6) {
        setError("৬ ডিজিটের ভেরিফিকেশন কোড দিন");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (pin.length < 5) {
        setError("৫ ডিজিটের পিন কোড দিন");
        return;
      }
      setStep(4);
      setTimeout(() => setStep(5), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        ></motion.div>
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* bKash Header */}
        <div className="bg-[#E2136E] p-8 text-white flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-xl">
            <img src="https://www.bkash.com/uploads/images/bkash-logo.png" alt="bKash" className="w-14" />
          </div>
          <h2 className="text-2xl font-black mb-1">বিকাশ পেমেন্ট</h2>
          <p className="text-white/80 font-bold text-sm">ডিজিটাল প্রকাশনী প্ল্যাটফর্ম</p>
          
          <div className="mt-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-lg font-black">
            ৳{amount.toLocaleString()}
          </div>
        </div>

        {/* Payment Flow */}
        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Smartphone className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">আপনার বিকাশ নম্বর দিন</span>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="01XXXXXXXXX"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl focus:border-[#E2136E] outline-none transition-all"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                আপনার বিকাশ নম্বরটি প্রদান করার মাধ্যমে আপনি আমাদের <span className="text-[#E2136E] underline">শর্তাবলী</span> মেনে নিচ্ছেন।
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">ভেরিফিকেশন কোড দিন (OTP)</span>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="XXXXXX"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl tracking-[0.5em] text-center focus:border-[#E2136E] outline-none transition-all"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium text-center">
                আপনার মোবাইলে একটি ৬ ডিজিটের কোড পাঠানো হয়েছে।
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Lock className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">বিকাশ পিন (PIN) দিন</span>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="•••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl tracking-[0.5em] text-center focus:border-[#E2136E] outline-none transition-all"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium text-center">
                আপনার পিনটি সুরক্ষিত রাখুন। আমাদের প্রতিনিধি কখনই আপনার পিন জানতে চাইবে না।
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="py-12 flex flex-col items-center text-center">
              <Loader2 className="w-16 h-16 text-[#E2136E] animate-spin mb-6" />
              <h3 className="text-xl font-black text-slate-800 mb-2">পেমেন্ট প্রসেসিং হচ্ছে...</h3>
              <p className="text-sm text-slate-400 font-medium">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।</p>
            </div>
          )}

          {step === 5 && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">পেমেন্ট সফল হয়েছে!</h3>
              <p className="text-sm text-slate-400 font-medium">আপনার ট্রানজেকশন আইডি সংরক্ষিত করা হয়েছে।</p>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl text-sm font-bold animate-shake">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {step < 4 && (
            <div className="mt-10 flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                বাতিল
              </button>
              <button 
                onClick={handleNext}
                disabled={loading}
                className="flex-[2] py-5 bg-[#E2136E] text-white rounded-2xl font-black shadow-xl shadow-[#E2136E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    পরবর্তী ধাপ
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50 p-6 flex items-center justify-center gap-4 border-t border-slate-100">
          <img src="https://www.bkash.com/uploads/images/pci-dss.png" alt="PCI DSS" className="h-6 opacity-50 grayscale" />
          <div className="h-4 w-px bg-slate-200"></div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Secure Payment Gateway</p>
        </div>
      </motion.div>
    </div>
  );
}
