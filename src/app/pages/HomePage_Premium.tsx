import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { 
  BookOpen, Zap, TrendingUp, ArrowRight, Star, Shield, Users, Quote, Edit3, Sparkles, ShoppingBag, 
  Rocket, Target, Trophy, CheckCircle2, Eye, ChevronDown, HelpCircle 
} from "lucide-react";
import heroMain from "../../images/Hero_image.png";
import { useStore } from "../store/useStore";
import { SEO } from "../components/SEO";

export function HomePage() {
  const { books, addToCart, user, authors, siteSettings, testimonials, addTestimonial, profilesCount, loading } = useStore();
  const [newTestimonial, setNewTestimonial] = useState("");
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const navigate = useNavigate();

  const approvedTestimonials = testimonials.filter(t => t.is_approved);

  useEffect(() => {
    if (approvedTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % approvedTestimonials.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(interval);
  }, [approvedTestimonials.length]);

  const faqs = [
    {
      q: "ডিজিটাল প্রকাশনী প্ল্যাটফর্মটি কীভাবে কাজ করে?",
      a: "ডিজিটাল প্রকাশনী হলো লেখক ও পাঠকদের জন্য একটি সমন্বিত অনলাইন প্ল্যাটফর্ম। এখানে লেখকরা তাদের পাণ্ডুলিপি সরাসরি প্রকাশ করে রয়্যালটি উপার্জন করতে পারেন, এবং পাঠকরা খুব সহজেই পছন্দের ডিজিটাল বই কিনে যেকোনো ডিভাইস থেকে পড়তে পারেন।"
    },
    {
      q: "একজন নতুন লেখক হিসেবে আমি কীভাবে বই প্রকাশ করব?",
      a: "খুব সহজেই 'লেখক হিসেবে যোগ দিন' বাটনে ক্লিক করে আপনার সুবিধামতো একটি প্ল্যান বেছে নিন। এরপর আপনার ড্যাশবোর্ড থেকে বইয়ের কভার, পাণ্ডুলিপি (PDF/EPUB) এবং প্রয়োজনীয় তথ্য আপলোড করলেই আপনার বই পাঠকদের জন্য উন্মুক্ত হয়ে যাবে।"
    },
    {
      q: "বই বিক্রির রয়্যালটি কীভাবে এবং কত শতাংশ প্রদান করা হয়?",
      a: "আমরা লেখকদের সর্বোচ্চ ৮৫% পর্যন্ত রয়্যালটি প্রদান করি, যা নির্বাচিত প্ল্যানের ওপর নির্ভর করে। আপনার প্রতিটি বই বিক্রির রয়্যালটি তাৎক্ষণিকভাবে ড্যাশবোর্ডে যোগ হয় এবং নির্দিষ্ট থ্রেশহোল্ড (যেমন ৳৫০০) পূর্ণ হলে আপনি পেমেন্ট উত্তোলন করতে পারবেন।"
    },
    {
      q: "পাঠকরা কেনা বই কীভাবে পড়তে পারবেন?",
      a: "প্ল্যাটফর্ম থেকে বই কেনার পর সেটি স্বয়ংক্রিয়ভাবে আপনার ব্যক্তিগত 'লাইব্রেরি'-তে যুক্ত হয়ে যাবে। আপনি আপনার অ্যাকাউন্টে লগইন করে যেকোনো সময় মোবাইল, ট্যাবলেট বা কম্পিউটার থেকে বইটি পড়তে পারবেন।"
    },
    {
      q: "কপিরাইট বা মেধাস্বত্ব সুরক্ষার ক্ষেত্রে আপনাদের নীতিমালা কী?",
      a: "ডিজিটাল প্রকাশনী লেখকদের মেধাস্বত্বের প্রতি সম্পূর্ণ শ্রদ্ধাশীল। এখানে প্রকাশিত প্রতিটি বইয়ের শতভাগ (100%) কপিরাইট লেখকের কাছে সংরক্ষিত থাকে। আমরা শুধুমাত্র ডিজিটাল ডিস্ট্রিবিউশনের প্রযুক্তিগত সুবিধা প্রদান করি।"
    },
    {
      q: "বই কেনার ক্ষেত্রে পেমেন্ট পদ্ধতিগুলো কী কী?",
      a: "আপনি বাংলাদেশের যেকোনো জনপ্রিয় মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট) এবং কার্ডের মাধ্যমে সম্পূর্ণ সুরক্ষিত উপায়ে বই কিনতে বা লেখক প্ল্যান সাবস্ক্রাইব করতে পারবেন।"
    }
  ];



  const popularBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const approvedTestimonials = testimonials.filter(t => t.is_approved);

  const hasSubmitted = user 
    ? testimonials.some(t => t.user_id === user.id)
    : typeof window !== 'undefined' && localStorage.getItem("dp_guest_testimonial_submitted") === "true";

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !guestName.trim()) {
      alert("মতামত দিতে আপনার নাম লিখুন!");
      return;
    }
    if (!newTestimonial.trim()) return;

    setIsSubmitting(true);
    try {
      await addTestimonial(newTestimonial, rating, guestName);
      if (!user) {
        localStorage.setItem("dp_guest_testimonial_submitted", "true");
      }
      setNewTestimonial("");
      setGuestName("");
      setRating(5);
      alert("আপনার মতামত পাঠানো হয়েছে! এডমিন অ্যাপ্রুভ করলে এটি সাইটে দেখা যাবে।");
    } catch (error: any) {
      console.error(error);
      alert(`মতামত পাঠাতে সমস্যা হয়েছে: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-50/30">
      <SEO 
        title="হোম" 
        description={siteSettings.heroDescription} 
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center pt-12 pb-6 lg:pt-16 lg:pb-12 bg-white">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center justify-center gap-3 px-5 py-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100/50 text-emerald-800 rounded-full mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">{authors.length}+ লেখক যুক্ত আছেন</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-emerald-950 leading-tight py-2 tracking-tight mx-auto">
                {siteSettings.heroTitle} <br />
                <span className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent py-2 px-1 inline-block">{siteSettings.heroSubtitle}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4">
                {siteSettings.heroDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link 
                to={user?.isWriter ? "/writer" : "/join-writer"} 
                className="group relative px-6 py-4 md:px-8 md:py-5 bg-emerald-600 text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">{user?.isWriter ? "ড্যাশবোর্ডে প্রবেশ করুন" : siteSettings.heroCtaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
              <Link 
                to="/browse" 
                className="px-6 py-4 md:px-8 md:py-5 bg-slate-50 text-emerald-950 rounded-2xl font-black text-base md:text-lg hover:bg-slate-100 transition-all border border-slate-200/50 w-full sm:w-auto text-center"
              >
                {siteSettings.heroSecondaryCtaText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { label: "Total Books", value: books.length, icon: BookOpen, color: "emerald" },
              { label: "Active Authors", value: authors.length, icon: Edit3, color: "blue" },
              { label: "Happy Readers", value: profilesCount, icon: Users, color: "amber" },
              { label: "Verified Reviews", value: approvedTestimonials.length, icon: Star, color: "rose" }
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center space-y-3 opacity-100"
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-emerald-950">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-emerald-950 mb-2 md:mb-4 tracking-tight">জনপ্রিয় বইসমূহ</h2>
              <p className="text-slate-500 font-medium">পাঠকদের পছন্দের তালিকায় থাকা সেরা কিছু বই</p>
            </div>
            <Link to="/browse" className="hidden md:flex items-center gap-2 text-emerald-600 font-black hover:gap-3 transition-all">
              সবগুলো দেখুন <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {popularBooks.map((book, i) => (
              <div
                key={book.id}
                className="group bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg shadow-emerald-900/5 border border-emerald-100/20 hover:shadow-2xl transition-all flex flex-col"
              >
                <Link to={`/book/${book.id}`} className="relative aspect-[3/4] overflow-hidden block">
                  <img src={book.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </Link>
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <Link to={`/book/${book.id}`} className="block">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs md:text-sm font-black text-emerald-950">{book.rating}</span>
                    </div>
                    <h3 className="font-black text-sm md:text-base text-emerald-950 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">{book.title}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 line-clamp-1 mb-2 md:mb-3">{book.author}</p>
                    <div className="text-base md:text-lg font-black text-emerald-600 mb-4">৳{book.price}</div>
                  </Link>
                  
                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={(e) => { e.preventDefault(); addToCart(book); }}
                      className="flex-1 py-2 md:py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" /> 
                      <span className="hidden sm:inline">কার্টে নিন</span>
                      <span className="sm:hidden">কার্টে</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(book);
                        navigate('/checkout');
                      }}
                      className="flex-1 py-2 md:py-3 bg-emerald-600 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 md:w-4 md:h-4" /> 
                      কিনুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-50 rounded-full blur-[80px] md:blur-[120px] -mr-32 md:-mr-64 -mt-32 md:-mt-64 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> লেখক হওয়ার সুযোগ
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-emerald-950 tracking-tight leading-tight mb-4 md:mb-6">
              আপনার সৃজনশীলতা <br />
              প্রকাশ করুন <span className="text-emerald-600">সঠিক প্ল্যানে</span>
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto px-4">
              আমাদের বিশেষ প্যাকেজগুলো থেকে আপনার জন্য সেরাটি বেছে নিন এবং আপনার সাহিত্যিক যাত্রা শুরু করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                id: "plan1",
                name: "নতুন লেখক (Starter)",
                price: "৪৯৯",
                period: "৩ মাস",
                features: ["৫টি বই প্রকাশ", "25% কমিশন", "বেসিক এনালিটিক্স", "২৪/৭ সাপোর্ট"],
                color: "from-blue-600 to-indigo-600",
                icon: Rocket
              },
              {
                id: "plan2",
                name: "জনপ্রিয় লেখক (Pro)",
                price: "৯৯৯",
                period: "৬ মাস",
                features: ["আনলিমিটেড বই", "18% কমিশন", "অ্যাডভান্সড এনালিটিক্স", "ভেরিফিকেশন"],
                color: "from-emerald-600 to-teal-600",
                popular: true,
                icon: Star
              },
              {
                id: "plan3",
                name: "কিংবদন্তি লেখক (Elite)",
                price: "১৯৯৯",
                period: "আজীবন",
                features: ["আজীবন সদস্যপদ", "15% কমিশন", "পিআর ম্যানেজার", "ভিআইপি ইভেন্ট"],
                color: "from-amber-600 to-orange-600",
                icon: Zap
              }
            ].map((plan, i) => (
              <div
                key={plan.id}
                className={`relative p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all duration-300 bg-white group hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] hover:-translate-y-2 ${
                  plan.popular ? "border-emerald-500 shadow-xl" : "border-slate-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                    POPULAR CHOICE
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
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

                <Link
                  to={`/join-writer?plan=${plan.id}`}
                  className={`w-full py-5 rounded-[1.25rem] font-black transition-all flex items-center justify-center gap-2 ${
                    plan.popular ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20" : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  প্ল্যানটি শুরু করুন <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials Section */}
      <section className="py-16 md:py-24 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-black text-emerald-950 tracking-tight leading-tight">
              আমাদের কমিউনিটি <span className="text-emerald-600">কী বলছে</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Quote className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950">পাঠকদের অভিজ্ঞতা</h3>
              </div>

              {approvedTestimonials.length > 0 ? (
                <div className="relative min-h-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={approvedTestimonials[activeTestimonialIndex]?.id || 'empty'}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100/50 relative"
                    >
                      <div className="flex items-center gap-1.5 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < (approvedTestimonials[activeTestimonialIndex]?.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} 
                          />
                        ))}
                      </div>
                      
                      <p className="text-emerald-950/80 font-medium italic mb-8 text-lg md:text-xl leading-relaxed">
                        "{approvedTestimonials[activeTestimonialIndex]?.content}"
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={approvedTestimonials[activeTestimonialIndex]?.user_avatar} 
                            className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white" 
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-emerald-950 text-lg">
                            {approvedTestimonials[activeTestimonialIndex]?.user_name}
                          </div>
                          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                            {approvedTestimonials[activeTestimonialIndex]?.user_id ? "Verified Member" : "Guest Member"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel Indicators */}
                  {approvedTestimonials.length > 1 && (
                    <div className="flex gap-2 mt-8 ml-4">
                      {approvedTestimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestimonialIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-500 ${activeTestimonialIndex === idx ? 'w-8 bg-emerald-600' : 'w-2 bg-emerald-200 hover:bg-emerald-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-[2.5rem] p-12 text-center">
                  <p className="text-emerald-800/50 font-bold italic">প্রথম মতামতটি আপনার হোক!</p>
                </div>
              )}
            </div>

            <div>
              <div className="bg-emerald-950 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
                {!hasSubmitted ? (
                  <>
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                      আপনার মতামত দিন 
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                    </h3>
                    
                    {user ? (
                      <div className="flex items-center gap-4 p-4 bg-emerald-900/30 rounded-2xl mb-6 border border-emerald-800/50">
                        <img 
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/50" 
                        />
                        <div>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Posting as</p>
                          <p className="text-sm font-black text-white">{user.name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-emerald-200/60 text-sm font-medium mb-8">আমাদের সেবা আপনার কেমন লেগেছে তা জানান।</p>
                    )}

                    <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                      <div className="flex gap-2 p-2 bg-emerald-900/40 rounded-2xl w-fit">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${rating >= s ? 'bg-amber-400 text-emerald-950 scale-110 shadow-lg shadow-amber-400/20' : 'text-emerald-500 hover:bg-emerald-800/50'}`}
                          >
                            <Star className={`w-5 h-5 ${rating >= s ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>

                      {!user && (
                        <div>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="আপনার নাম লিখুন"
                            className="w-full bg-emerald-900/30 border border-emerald-800/50 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-emerald-700"
                            required={!user}
                          />
                        </div>
                      )}

                      <textarea
                        value={newTestimonial}
                        onChange={(e) => setNewTestimonial(e.target.value)}
                        placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                        className="w-full bg-emerald-900/30 border border-emerald-800/50 rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 outline-none resize-none h-32 transition-all placeholder:text-emerald-700"
                        required
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? "পাঠানো হচ্ছে..." : "মতামত সাবমিট করুন"}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">ধন্যবাদ!</h3>
                    <p className="text-emerald-200/60 font-medium">আপনার মতামত ইতিমধ্য গ্রহণ করা হয়েছে।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" /> সচরাচর জিজ্ঞাসিত প্রশ্ন
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tight mb-4">
              আপনার প্রশ্নের <span className="text-emerald-600">উত্তরসমূহ</span>
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg">
              প্ল্যাটফর্ম ব্যবহার, বই প্রকাশ এবং পেমেন্ট সংক্রান্ত সাধারণ প্রশ্নের উত্তরগুলো জেনে নিন।
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`bg-white border rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-emerald-500 shadow-lg shadow-emerald-900/5' : 'border-emerald-100/50 hover:border-emerald-200 shadow-sm'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-6 md:px-8 md:py-8 flex items-center justify-between gap-4 text-left"
                >
                  <h3 className={`font-black text-lg md:text-xl transition-colors ${openFaq === index ? 'text-emerald-700' : 'text-emerald-950'}`}>
                    {faq.q}
                  </h3>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === index ? 'bg-emerald-100 text-emerald-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <div 
                  className={`px-6 md:px-8 overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 pb-6 md:pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600 font-medium leading-relaxed md:text-lg">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950"></div>
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-32"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-8 md:p-24 rounded-[2rem] md:rounded-[4rem] border border-white/5 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 md:mb-8">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">আজই আপনার যাত্রা শুরু করুন</span>
              </div>
              
              <h2 className="text-3xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight">
                আপনার পাণ্ডুলিপি <br />
                এখনই <span className="text-emerald-400">প্রকাশ করুন</span>
              </h2>
              
              <p className="text-emerald-50/60 text-base md:text-xl mb-10 md:mb-12 font-medium">
                হাজারো লেখক ইতিমধ্যে আমাদের প্ল্যাটোফর্মে তাদের সাহিত্যিক ক্যারিয়ার গড়ে তুলেছেন। 
                আপনি কি পিছিয়ে থাকবেন?
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <Link 
                  to={user?.isWriter ? "/writer" : "/join-writer"} 
                  className="w-full sm:w-auto group px-8 py-5 md:px-12 md:py-6 bg-white text-emerald-950 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  {user?.isWriter ? "ড্যাশবোর্ডে প্রবেশ করুন" : "লেখক হিসেবে যোগ দিন"}
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/browse" 
                  className="w-full sm:w-auto px-8 py-5 md:px-12 md:py-6 bg-emerald-800/40 text-white border-2 border-white/20 backdrop-blur-md rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-emerald-800/60 transition-all text-center"
                >
                  বইসমূহ দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
