import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Smartphone, Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  userId: string;
  onSuccess?: (transactionId: string) => void;
}

export default function BkashPaymentModal({
  isOpen, onClose, amount, orderId, userId, onSuccess
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (trxId.length < 6) { setError("সঠিক ট্রানজেকশন আইডি দিন।"); return; }
    if (phone.length < 11) { setError("সঠিক বিকাশ নম্বর দিন।"); return; }
    setLoading(true);

    const { error: dbError } = await supabase
      .from("bkash_payments")
      .insert({
        order_id:    orderId,
        user_id:     userId,
        name,
        phone,
        trx_id:      trxId.toUpperCase(),
        amount,
        status:      "pending",
      });

    setLoading(false);
    if (dbError) { setError("Failed to submit. Try again."); return; }
    setDone(true);
  }

  function handleClose() {
    setName(""); setPhone(""); setTrxId("");
    setDone(false); setError("");
    onClose();
  }
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
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
          <p className="text-white/80 font-bold text-sm">ম্যানুয়াল ভেরিফিকেশন</p>
          
          <div className="mt-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-lg font-black">
            ৳{amount.toLocaleString()}
          </div>
        </div>

        {/* Payment Flow */}
        <div className="p-10">
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">বিকাশ নম্বর ও ট্রানজেকশন আইডি</span>
                </div>
                
                <input 
                  type="text" 
                  placeholder="আপনার নাম"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-[#E2136E] outline-none transition-all"
                  required
                />

                <input 
                  type="text" 
                  placeholder="বিকাশ নম্বর (01XXXXXXXXX)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-[#E2136E] outline-none transition-all"
                  required
                />

                <input 
                  type="text" 
                  placeholder="ট্রানজেকশন আইডি (TrxID)"
                  value={trxId}
                  onChange={e => setTrxId(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-lg focus:border-[#E2136E] outline-none transition-all"
                  required
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[10px] text-emerald-800 font-bold leading-relaxed">
                   আপনার বিকাশ থেকে আমাদের মার্চেন্ট নম্বরে (01XXXXXXXX) সেন্ড মানি করে TrxID টি এখানে দিন।
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl text-xs font-bold">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-xl font-black hover:bg-slate-200 transition-all"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-[#E2136E] text-white rounded-xl font-black shadow-xl shadow-[#E2136E]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "পেমেন্ট নিশ্চিত করুন"}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">সাবমিট করা হয়েছে!</h3>
              <p className="text-sm text-slate-400 font-medium mb-8">
                আপনার পেমেন্টটি আমরা ২৪ ঘণ্টার মধ্যে যাচাই করে কনফার্ম করবো।
              </p>
              <button 
                onClick={handleClose}
                className="w-full py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-black hover:bg-emerald-50 transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50 p-6 flex items-center justify-center gap-4 border-t border-slate-100">
          <img src="https://www.bkash.com/uploads/images/pci-dss.png" alt="PCI DSS" className="h-6 opacity-50 grayscale" />
          <div className="h-4 w-px bg-slate-200"></div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Secure Payment Verification</p>
        </div>
      </motion.div>
    </div>
  );
}