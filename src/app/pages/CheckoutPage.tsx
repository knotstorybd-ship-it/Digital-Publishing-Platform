import { useState, useMemo } from "react";
import { CreditCard, Check, ArrowLeft, ArrowRight, Trash2, Package, User, ShieldCheck, Zap, Building, Smartphone, Wallet, UploadCloud } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import confetti from "canvas-confetti";

const paymentMethods = [
  {
    id: "bkash",
    name: "বিকাশ (bKash)",
    icon: "https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg",
    color: "bg-[#D12053]",
    description: "সবচেয়ে জনপ্রিয় ও নিরাপদ মোবাইল পেমেন্ট"
  },
  {
    id: "nagad",
    name: "নগদ (Nagad)",
    icon: "https://vms.nagad.com.bd:8000/media/logos/Nagad-Logo.png",
    color: "bg-[#F7941D]",
    description: "দ্রুত ও সহজ পেমেন্ট প্রক্রিয়া"
  }
];

const plans = [
  {
    id: "plan1",
    name: "নতুন লেখক (Starter)",
    price: 499,
    period: "৩ মাস",
    features: ["৫টি বই প্রকাশ", "25% কমিশন", "বেসিক এনালিটিক্স"]
  },
  {
    id: "plan2",
    name: "জনপ্রিয় লেখক (Pro)",
    price: 999,
    period: "৬ মাস",
    features: ["আনলিমিটেড বই", "18% কমিশন", "প্রো ভেরিফিকেশন"]
  },
  {
    id: "plan3",
    name: "কিংবদন্তি লেখক (Elite)",
    price: 1999,
    period: "আজীবন",
    features: ["আজীবন মেম্বারশিপ", "15% কমিশন", "ব্যক্তিগত ম্যানেজার"]
  }
];

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get("plan");
  const { cart, removeFromCart, user, addOrder, clearCart } = useStore();
  
  const selectedPlan = useMemo(() => plans.find(p => p.id === planId), [planId]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [trxId, setTrxId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = selectedPlan ? selectedPlan.price : cartTotal;
  const isPlanPurchase = !!selectedPlan;

  const handleCheckout = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent("open-auth"));
      return;
    }

    if (!trxId) {
      alert("দয়া করে ট্রানজ্যাকশন আইডি প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      if (isPlanPurchase) {
        // Create pending plan order
        await addOrder({
          user_id: user.id,
          book_id: "plan_" + selectedPlan.id,
          amount: selectedPlan.price,
          status: 'pending',
          payment_method: paymentMethod,
          transaction_id: trxId,
          type: 'subscription'
        });
      } else {
        // Create pending orders for each book in cart
        for (const book of cart) {
          await addOrder({
            user_id: user.id,
            book_id: book.id,
            amount: book.price,
            status: 'pending',
            payment_method: paymentMethod,
            transaction_id: trxId,
            type: 'book'
          });
        }
        clearCart();
      }

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399']
      });
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  if (totalAmount === 0 && step !== 3) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">আপনার কার্ট খালি</h2>
          <Link to="/browse" className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black">বই দেখুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center mb-16 gap-4">
          {[
            { id: 1, label: "রিভিউ", icon: Package },
            { id: 2, label: "পেমেন্ট", icon: CreditCard },
            { id: 3, label: "সফল", icon: Check }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step >= s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-300 border border-slate-100'}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${step >= s.id ? 'text-emerald-950' : 'text-slate-300'} hidden sm:inline`}>{s.label}</span>
              {s.id < 3 && <div className={`w-8 h-px ${step > s.id ? 'bg-emerald-200' : 'bg-slate-100'}`}></div>}
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          {step === 1 && (
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-6">
                <h1 className="text-3xl font-black text-emerald-950 mb-8">অর্ডার রিভিউ</h1>
                {isPlanPurchase ? (
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <Zap className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-black text-emerald-950 text-xl">{selectedPlan.name}</h3>
                        <p className="text-sm font-bold text-slate-400">সাবস্ক্রিপশন প্ল্যান • {selectedPlan.period}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-emerald-950">৳{selectedPlan.price}</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <img src={item.cover} className="w-16 h-20 object-cover rounded-xl shadow-md" />
                          <div>
                            <h3 className="font-black text-emerald-950">{item.title}</h3>
                            <p className="text-xs font-bold text-slate-400">{item.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="font-black text-emerald-950">৳{item.price}</div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-4">
                <div className="bg-emerald-950 text-white p-10 rounded-[3rem] shadow-2xl sticky top-32">
                  <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-widest text-emerald-500">অর্ডার সারসংক্ষেপ</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-emerald-100/60 font-bold uppercase tracking-widest text-[10px]">
                      <span>সাব-টোটাল</span>
                      <span>৳{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-emerald-100/60 font-bold uppercase tracking-widest text-[10px]">
                      <span>সার্ভিস চার্জ</span>
                      <span>৳০</span>
                    </div>
                    <div className="h-px bg-white/10 my-4"></div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-black uppercase tracking-widest text-emerald-500">মোট</span>
                      <span className="text-4xl font-black">৳{totalAmount}</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-3">
                    পেমেন্ট করুন <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest mb-4">
                  <ArrowLeft className="w-4 h-4" /> পেছনে ফিরে যান
                </button>
                
                <h2 className="text-3xl font-black text-emerald-950 mb-8">পেমেন্ট মেথড নির্বাচন করুন</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative p-8 rounded-[2.5rem] cursor-pointer transition-all border-2 ${paymentMethod === method.id ? 'bg-white border-emerald-500 shadow-2xl' : 'bg-white/50 border-slate-100 hover:border-emerald-200'}`}
                    >
                      <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mb-6`}>
                        <img src={method.icon} className="w-8 h-8 object-contain" />
                      </div>
                      <h4 className="font-black text-emerald-950 text-lg mb-2">{method.name}</h4>
                      <p className="text-xs font-bold text-slate-400">{method.description}</p>
                      {paymentMethod === method.id && (
                        <div className="absolute top-6 right-6 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 text-xl mb-4">পেমেন্ট নির্দেশিকা:</h4>
                      <ol className="space-y-4 text-slate-500 font-bold text-sm">
                        <li className="flex gap-3"><span className="text-emerald-600">১.</span> আপনার {paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} অ্যাপে যান বা ইউএসএসডি কোড ডায়াল করুন।</li>
                        <li className="flex gap-3"><span className="text-emerald-600">২.</span> 'Send Money' অপশনটি বেছে নিন।</li>
                        <li className="flex gap-3"><span className="text-emerald-600">৩.</span> এই নাম্বারে টাকা পাঠান: <span className="text-emerald-950 font-black">০১৭০০০০০০০০</span></li>
                        <li className="flex gap-3"><span className="text-emerald-600">৪.</span> পেমেন্ট সফল হলে নিচের ফর্মে ট্রানজ্যাকশন আইডি (TrxID) দিন।</li>
                      </ol>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 ml-4">ট্রানজ্যাকশন আইডি (Transaction ID)</label>
                      <div className="relative group">
                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Ex: 8X7H9J2K"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full pl-16 pr-8 py-5 bg-slate-50 border-0 rounded-[1.5rem] font-black focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 ml-4">পেমেন্ট স্ক্রিনশট (ঐচ্ছিক)</label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                          className="hidden" 
                          id="screenshot-upload" 
                        />
                        <label 
                          htmlFor="screenshot-upload"
                          className="w-full px-8 py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] font-bold text-slate-400 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-3"
                        >
                          <UploadCloud className="w-5 h-5" />
                          {screenshot ? screenshot.name : "আপলোড করুন"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-emerald-100 sticky top-32">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950">নিরাপদ পেমেন্ট</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SSL Encrypted</p>
                    </div>
                  </div>
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between font-bold text-slate-400 text-sm">
                      <span>পরিশোধ করতে হবে:</span>
                      <span className="text-emerald-950 font-black">৳{totalAmount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-400 text-sm">
                      <span>পেমেন্ট মেথড:</span>
                      <span className="text-emerald-950 font-black uppercase">{paymentMethod}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>ভেরিফাই করুন <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                  <p className="mt-8 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    আপনার পেমেন্ট অ্যাডমিন কর্তৃক ভেরিফাই হওয়ার পর আপনি অ্যাক্সেস পাবেন। সাধারণত ৫-১০ মিনিট সময় লাগে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto text-center py-10">
              <div className="bg-white p-16 md:p-24 rounded-[4rem] shadow-2xl border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
                <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto mb-10">
                  <Check className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-emerald-950 mb-6">অর্ডার সম্পন্ন হয়েছে!</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12">
                  ধন্যবাদ! আপনার পেমেন্ট বর্তমানে পর্যালোচনার জন্য জমা দেওয়া হয়েছে। এডমিন ভেরিফাই করার সাথে সাথেই আপনার ইমেইলে একটি নিশ্চিতকরণ মেসেজ পাবেন।
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate(isPlanPurchase ? "/writer" : "/library")}
                    className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                  >
                    ড্যাশবোর্ড দেখুন
                  </button>
                  <button 
                    onClick={() => navigate("/")}
                    className="flex-1 py-5 bg-slate-50 text-emerald-950 rounded-2xl font-black hover:bg-slate-100 transition-all"
                  >
                    হোমপেজে ফিরে যান
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
