import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Star, 
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Rocket,
  Smartphone
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useStore } from "../store/useStore";
import { supabase } from "../../lib/supabase";

const plans = [
  {
    id: "plan1",
    name: "নতুন লেখক (Starter)",
    price: "৪৯৯",
    period: "৩ মাস",
    features: [
      "৫টি বই প্রকাশ করার সুযোগ",
      "25% প্লাটফর্ম কমিশন",
      "বেসিক এনালিটিক্স",
      "ডিজিটাল সার্টিফিকেট"
    ],
    color: "from-blue-500 to-indigo-600",
    icon: Rocket
  },
  {
    id: "plan2",
    name: "জনপ্রিয় লেখক (Pro)",
    price: "৯৯৯",
    period: "৬ মাস",
    features: [
      "আনলিমিটেড বই প্রকাশ",
      "18% প্লাটফর্ম কমিশন",
      "অ্যাডভান্সড এনালিটিক্স",
      "প্রোফাইল ভেরিফিকেশন"
    ],
    color: "from-emerald-500 to-teal-600",
    popular: true,
    icon: Star
  },
  {
    id: "plan3",
    name: "কিংবদন্তি লেখক (Elite)",
    price: "১৯৯৯",
    period: "আজীবন",
    features: [
      "আজীবন সদস্যপদ",
      "15% প্লাটফর্ম কমিশন",
      "ব্যক্তিগত পিআর ম্যানেজার",
      "ভিআইপি লেখক ইভেন্ট"
    ],
    color: "from-amber-500 to-orange-600",
    icon: Zap
  }
];

const getPlanFromSearch = (search: string) => {
  const planId = new URLSearchParams(search).get("plan");
  return plans.find((plan) => plan.id === planId) || plans[1];
};

export function WriterRegistrationPage() {
  const location = useLocation();
  const initialPlan = getPlanFromSearch(location.search);
  const [step, setStep] = useState(() => (new URLSearchParams(location.search).get("plan") ? 2 : 1));
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useStore();

  // Detect plan from URL
  useEffect(() => {
    const plan = getPlanFromSearch(location.search);
    setSelectedPlan(plan);
    if (!user) {
      setStep(new URLSearchParams(location.search).get("plan") ? 2 : 1);
    }
  }, [location.search, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`
  });

  const validatePassword = (pass: string) => {
    const hasCapital = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isLongEnough = pass.length >= 6;
    return hasCapital && hasNumber && isLongEnough;
  };

  // Redirect if already a writer
  useEffect(() => {
    if (user?.isWriter) {
      navigate("/writer");
    }
  }, [user, navigate]);

  // Sync auth data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        avatar: user.avatar || prev.avatar,
        bio: user.bio || prev.bio
      }));
      if (step === 2) setStep(3);
    }
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let userId = user?.id;

      if (!user) {
        // Attempt signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              avatar_url: formData.avatar
            }
          }
        });

        if (authError) {
          if (authError.message.includes("rate limit")) {
            throw new Error("ইমেইল পাঠানোর লিমিট শেষ হয়ে গেছে। দয়া করে একটু পর আবার চেষ্টা করুন অথবা আপনার বর্তমান অ্যাকাউন্ট দিয়ে লগইন করুন।");
          }
          throw authError;
        }
        if (!authData.user) throw new Error("Registration failed");
        userId = authData.user.id;
      }

      const expiresAt = new Date();
      if (selectedPlan.id === "plan1") expiresAt.setMonth(expiresAt.getMonth() + 3);
      else if (selectedPlan.id === "plan2") expiresAt.setMonth(expiresAt.getMonth() + 6);
      else expiresAt.setFullYear(expiresAt.getFullYear() + 100);

      const { error: authorError } = await supabase.from('authors').upsert({
        id: userId,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        bio: formData.bio || "নতুন লেখক",
        subscription_plan: selectedPlan.name,
        subscription_expiry: expiresAt.toISOString(),
        book_count: 0,
        rating: 0,
        join_date: new Date().toISOString()
      }, { onConflict: 'email' });

      if (authorError) throw authorError;

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        is_writer: true,
        name: formData.name,
        avatar: formData.avatar,
        bio: formData.bio
      });

      if (profileError) throw profileError;

      // Redirect to checkout to complete payment
      navigate(`/checkout?plan=${selectedPlan.id}`);
    } catch (err: any) {
      setError(err.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "প্ল্যান নির্বাচন", icon: Sparkles },
    { id: 2, title: "অ্যাকাউন্ট তৈরি", icon: User },
    { id: 3, title: "প্রোফাইল সেটআপ", icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-12 pb-12 px-4 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-7xl mx-auto mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          হোমপেজে ফিরে যান
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-16 gap-4 md:gap-8">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-4 group">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                ${step >= s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-400 border border-slate-100'}
              `}>
                <s.icon className={`w-5 h-5 ${step === s.id ? 'animate-pulse' : ''}`} />
              </div>
              <div className="hidden md:block">
                <p className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-emerald-600' : 'text-slate-400'}`}>ধাপ ০{s.id}</p>
                <p className={`text-sm font-black ${step >= s.id ? 'text-emerald-950' : 'text-slate-300'}`}>{s.title}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-px w-8 md:w-16 mx-2 transition-colors duration-500 ${step > s.id ? 'bg-emerald-200' : 'bg-slate-100'}`}></div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Plan Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black text-emerald-950 mb-6 tracking-tight">আপনার লেখক যাত্রা <br /><span className="text-emerald-600">এখান থেকেই শুরু</span></h1>
                <p className="text-slate-500 font-medium text-lg">আমাদের ৩টি বিশেষ সাবস্ক্রিপশন প্ল্যান থেকে আপনার পছন্দমতো একটি বেছে নিন।</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -10, borderColor: '#10b981' }}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setStep(2);
                    }}
                    className={`
                      relative p-10 rounded-[3rem] cursor-pointer transition-all duration-500 border-2
                      ${selectedPlan.id === plan.id 
                        ? 'bg-white border-emerald-500 shadow-2xl shadow-emerald-950/10' 
                        : 'bg-white/50 border-slate-50'}
                    `}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                        সবচেয়ে জনপ্রিয়
                      </div>
                    )}
                    
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-8 shadow-lg`}>
                      <plan.icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-black text-emerald-950 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-black text-emerald-950">৳{plan.price}</span>
                      <span className="text-slate-400 font-bold">/ {plan.period}</span>
                    </div>

                    <ul className="space-y-4 mb-10">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          {f.includes("কমিশন") ? (
                            <span className="font-black text-emerald-700">{f}</span>
                          ) : f}
                        </li>
                      ))}
                    </ul>

                    <button className={`
                      w-full py-4 rounded-2xl font-black transition-all
                      ${selectedPlan.id === plan.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-slate-50 text-slate-400'}
                    `}>
                      নির্বাচন করুন
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Account Creation */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-50">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-emerald-950 mb-3 tracking-tight">আপনার অ্যাকাউন্ট</h2>
                  <p className="text-slate-400 font-medium">নিচের তথ্যগুলো সঠিক ভাবে পূরণ করুন অথবা গুগল দিয়ে লগইন করুন</p>
                </div>

                {!user && (
                  <div className="mb-10">
                    <button
                      onClick={signInWithGoogle}
                      className="w-full py-5 bg-white border-2 border-slate-100 rounded-[1.5rem] font-black text-emerald-950 hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group"
                    >
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      গুগল দিয়ে লগইন করুন
                    </button>
                    <div className="flex items-center gap-4 my-8">
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">অথবা ফরম পূরণ করুন</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                  </div>
                )}

                {user && (
                  <div className="mb-10 p-6 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                      <img src={user.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">লগইন করা আছেন</p>
                      <p className="text-xl font-black text-emerald-950">{user.name}</p>
                      <p className="text-sm font-bold text-slate-400">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">সম্পূর্ণ নাম</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="আপনার নাম"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-0 rounded-[1.5rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">ইমেইল ঠিকানা</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-0 rounded-[1.5rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {!user && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">পাসওয়ার্ড</label>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className={`w-full pl-16 pr-8 py-5 bg-slate-50 border-0 rounded-[1.5rem] font-bold focus:ring-4 outline-none transition-all ${
                            formData.password && !validatePassword(formData.password) ? 'ring-2 ring-rose-500' : 'focus:ring-emerald-50'
                          }`}
                        />
                      </div>
                      {formData.password && !validatePassword(formData.password) && (
                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest ml-4">কমপক্ষে ৬ ডিজিট, ১টি বড় অক্ষর ও ১টি সংখ্যা দিন</p>
                      )}
                    </div>
                  )}

                  {/* Address and Phone removed for a simpler, faster onboarding */}

                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-3xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      পেছনে
                    </button>
                    <button
                      onClick={() => {
                        if (!user && !validatePassword(formData.password)) {
                          setError("পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ ডিজিটের হতে হবে এবং ১টি বড় হাতের অক্ষর ও ১টি সংখ্যা থাকতে হবে।");
                          return;
                        }
                        setError("");
                        setStep(3);
                      }}
                      className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      পরবর্তী ধাপ
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Profile Setup */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-50">
                <div className="mb-12 text-center">
                  <div className="relative inline-block group mb-8">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-emerald-50 border-4 border-white shadow-2xl relative">
                      <img src={formData.avatar} className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`})}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:rotate-12 transition-all border-4 border-white"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-3xl font-black text-emerald-950 mb-3 tracking-tight">আপনার প্রোফাইল সাজান</h2>
                  <p className="text-slate-400 font-medium">পাঠকরা আপনার সম্পর্কে জানতে চাইবে</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">আপনার সম্পর্কে কিছু কথা (Bio)</label>
                    <textarea
                      rows={5}
                      placeholder="আমি একজন লেখক এবং সাহিত্যিক..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-8 py-6 bg-slate-50 border-0 rounded-[2rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-950 uppercase tracking-widest mb-1">নিরাপদ পেমেন্ট</p>
                      <p className="text-xs text-emerald-900/60 font-medium">আপনার সাবস্ক্রিপশন সম্পন্ন করার পর আপনি সরাসরি ড্যাশবোর্ডে প্রবেশ করতে পারবেন।</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-6 bg-rose-50 text-rose-600 rounded-[2rem] border border-rose-100">
                      <div className="flex items-center gap-3 text-sm font-bold mb-4">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                      </div>
                      {error.includes("লিমিট") && (
                        <button
                          type="button"
                          onClick={() => {
                            signInWithGoogle();
                          }}
                          className="w-full py-4 bg-white border-2 border-rose-100 rounded-2xl text-rose-600 font-black hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                          </svg>
                          গুগল দিয়ে চেষ্টা করুন
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-3xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      পেছনে
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      {loading ? "লোডিং..." : "রেজিস্ট্রেশন সম্পন্ন করুন"}
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-white rounded-[4rem] p-16 md:p-24 shadow-2xl relative overflow-hidden border border-emerald-50">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 to-teal-600"></div>
                
                <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto mb-12 animate-bounce">
                  <CheckCircle2 className="w-16 h-16" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-6 tracking-tight">অভিনন্দন!</h2>
                <p className="text-slate-500 font-medium text-lg mb-12">
                  আপনার লেখক প্রোফাইল সফলভাবে তৈরি হয়েছে। এখন আপনি আপনার প্রথম সাহিত্যকর্ম হাজারো পাঠকের সামনে প্রকাশ করতে প্রস্তুত।
                </p>

                <div className="space-y-6">
                  <button 
                    onClick={() => navigate("/writer")}
                    className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 transition-all text-xl flex items-center justify-center gap-3"
                  >
                    ড্যাশবোর্ডে প্রবেশ করুন
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => navigate("/")}
                    className="w-full py-4 text-emerald-950 font-black uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    হোমপেজে ফিরে যান
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
