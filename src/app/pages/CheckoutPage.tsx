import { useState, useMemo } from "react";
import { CreditCard, Check, ArrowLeft, ArrowRight, Trash2, Package, User, ShieldCheck, Zap, Wallet, Building, Smartphone } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "motion/react";

import { BkashPaymentModal } from "../components/BkashPaymentModal";

const paymentMethods = [
  { id: "bkash", name: "bKash", icon: Smartphone, color: "bg-[#D12053]", brand: "বিকাশ" },
  { id: "nagad", name: "Nagad", icon: Wallet, color: "bg-[#F7941D]", brand: "নগদ" },
  { id: "card", name: "Card", icon: CreditCard, color: "bg-[#1A1F71]", brand: "কার্ড" },
];

export function CheckoutPage() {
  const { cart, removeFromCart, clearCart, subscribe, purchaseCart, user } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("bkash");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);

  const planId = searchParams.get("plan");

  const planDetails = useMemo(() => {
    const customPrice = searchParams.get("price");
    const basePlan = (() => {
      if (planId === "plan1") return { name: "Starter (নতুন লেখক)", months: 3, price: 499 };
      if (planId === "plan2") return { name: "Pro (জনপ্রিয় লেখক)", months: 6, price: 999 };
      if (planId === "plan3") return { name: "Elite (কিংবদন্তি লেখক)", months: 1200, price: 1999 };
      return null;
    })();

    if (basePlan && customPrice) {
      return { ...basePlan, price: parseInt(customPrice) };
    }
    return basePlan;
  }, [planId, searchParams]);

  const subtotal = planDetails ? planDetails.price : cart.reduce((sum, item) => sum + item.price, 0);
  const discount = 0;
  const total = subtotal - discount;

  const handlePayment = async () => {
    if (selectedPayment === "bkash") {
      setIsBkashModalOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      if (planDetails) {
        await subscribe(planDetails.name, planDetails.months);
      } else {
        await purchaseCart();
      }
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("পেমেন্ট সম্পন্ন করতে সমস্যা হয়েছে।");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBkashSuccess = async (txId: string) => {
    setIsProcessing(true);
    try {
      if (planDetails) {
        await subscribe(planDetails.name, planDetails.months);
      } else {
        await purchaseCart();
      }
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("পেমেন্ট ভেরিফিকেশন করতে সমস্যা হয়েছে।");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-2xl border border-emerald-50 text-center"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
            <User className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-emerald-950 mb-4 tracking-tight">লগইন প্রয়োজন</h2>
          <p className="text-slate-500 font-medium mb-10">
            চেকআউট সম্পন্ন করতে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth"))}
            className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-lg"
          >
            এখনই লগইন করুন
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-24 pb-20 selection:bg-emerald-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              হোমপেজে ফিরে যান
            </button>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
              {planDetails ? "আপনার প্ল্যান" : "চেকআউট"} <br />
              <span className="text-emerald-600">সম্পন্ন করুন</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm shadow-emerald-900/5">
            {[
              { id: 1, label: "কার্ট" },
              { id: 2, label: "পেমেন্ট" },
              { id: 3, label: "সম্পন্ন" }
            ].map((s) => (
              <div key={s.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500
                  ${step >= s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-50 text-slate-300'}
                `}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                {s.id < 3 && <div className={`w-8 h-px mx-2 ${step > s.id ? 'bg-emerald-200' : 'bg-slate-100'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step < 3 ? (
            <motion.div 
              key="main-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-7 space-y-8">
                {step === 1 && (
                  <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-emerald-950 mb-10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        {planDetails ? <Zap className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                      </div>
                      আপনার নির্বাচন
                    </h2>
                    
                    <div className="space-y-6">
                      {planDetails ? (
                        <div className="relative group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>
                          <div className="relative p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:bg-transparent">
                            <h3 className="text-2xl font-black text-emerald-950 group-hover:text-white mb-2 transition-colors">{planDetails.name}</h3>
                            <p className="text-slate-400 group-hover:text-emerald-100/60 font-bold mb-6 transition-colors">লেখকদের জন্য বিশেষ প্যাকেজ • {planDetails.months} মাস মেয়াদ</p>
                            <p className="text-4xl font-black text-emerald-600 group-hover:text-white transition-colors">৳{planDetails.price}</p>
                          </div>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={item.id} className="flex gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
                            <img src={item.cover} className="w-20 h-28 object-cover rounded-2xl shadow-lg group-hover:rotate-3 transition-transform" />
                            <div className="flex-1 py-2">
                              <h3 className="text-xl font-black text-emerald-950">{item.title}</h3>
                              <p className="text-slate-400 font-bold mb-4">{item.author}</p>
                              <p className="text-2xl font-black text-emerald-600">৳{item.price}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-4 self-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        ))
                      )}
                      {(!planDetails && cart.length === 0) && (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                          <p className="text-slate-400 font-black uppercase tracking-widest">আপনার কার্ট খালি</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!planDetails && cart.length === 0}
                      className="w-full mt-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                    >
                      পেমেন্টে এগিয়ে যান
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-emerald-950 mb-10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      পেমেন্ট পদ্ধতি
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`
                            relative p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4
                            ${selectedPayment === method.id ? 'border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-600/5' : 'border-slate-100 hover:border-emerald-200'}
                          `}
                        >
                          <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                            <method.icon className="w-7 h-7" />
                          </div>
                          <span className="font-black text-emerald-950">{method.brand}</span>
                          {selectedPayment === method.id && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center scale-110 shadow-lg animate-in zoom-in">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-10 space-y-6">
                      {selectedPayment !== 'card' ? (
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40 ml-4">আপনার {selectedPayment === 'bkash' ? 'বিকাশ' : 'নগদ'} নম্বর</label>
                          <input type="tel" placeholder="01XXXXXXXXX" className="w-full px-8 py-5 bg-white border-0 rounded-2xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40 ml-4">কার্ড নম্বর</label>
                            <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-8 py-5 bg-white border-0 rounded-2xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40 ml-4">মেয়াদ</label>
                              <input type="text" placeholder="MM/YY" className="w-full px-8 py-5 bg-white border-0 rounded-2xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40 ml-4">CVV</label>
                              <input type="password" placeholder="XXX" className="w-full px-8 py-5 bg-white border-0 rounded-2xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black hover:bg-slate-200 transition-all">বাতিল</button>
                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-[2] py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                      >
                        {isProcessing ? <div className="w-6 h-6 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <>৳{total} পেমেন্ট করুন <ArrowRight className="w-5 h-5" /></>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-sm border border-slate-100 sticky top-32">
                  <h3 className="text-xl font-black text-emerald-950 mb-10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Building className="w-5 h-5" />
                    </div>
                    অর্ডার সারাংশ
                  </h3>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">সাবটোটাল</span>
                      <span className="text-xl font-black text-emerald-950">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ভ্যাট (০%)</span>
                      <span className="text-xl font-black text-emerald-950">৳০</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-emerald-950 font-black uppercase tracking-[0.2em] text-sm">মোট পেমেন্ট</span>
                      <span className="text-4xl font-black text-emerald-600">৳{total}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100/50 flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-900/60 font-bold leading-relaxed">
                      আমাদের সকল পেমেন্ট গেটওয়ে বিশ্বস্ত এবং এনক্রিপ্টেড। আপনার তথ্য সম্পূর্ণ নিরাপদ।
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-white rounded-[4rem] p-16 md:p-24 shadow-2xl relative overflow-hidden border border-emerald-50">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 to-teal-600"></div>
                <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto mb-12 animate-bounce">
                  <Check className="w-16 h-16" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-6 tracking-tight">পেমেন্ট সফল!</h2>
                <p className="text-slate-500 font-medium text-lg mb-12">
                  {planDetails
                    ? `আপনার '${planDetails.name}' সাবস্ক্রিপশনটি এখন সক্রিয়। আপনি এখন বই প্রকাশ করতে পারবেন।`
                    : "আপনার বই ক্রয় সম্পন্ন হয়েছে। এখন এটি আপনার লাইব্রেরিতে যুক্ত হয়েছে।"}
                </p>
                <div className="space-y-6">
                  <button 
                    onClick={() => navigate(planDetails ? "/writer" : "/browse")}
                    className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 transition-all text-xl"
                  >
                    {planDetails ? "ড্যাশবোর্ডে প্রবেশ করুন" : "বইসমূহ দেখুন"}
                  </button>
                  <button onClick={() => navigate("/")} className="w-full py-4 text-emerald-950 font-black uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">হোমপেজে ফিরে যান</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BkashPaymentModal 
          isOpen={isBkashModalOpen}
          onClose={() => setIsBkashModalOpen(false)}
          amount={total}
          orderId={planDetails?.name || "Cart-Purchase"}
          userId={user?.id || ""}
          onSuccess={handleBkashSuccess}
        />
      </div>
    </div>
  );
}
