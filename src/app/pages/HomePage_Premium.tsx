import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  BookOpen, Zap, TrendingUp, ArrowRight, Star, Shield, Users, Quote, Edit3, Sparkles, ShoppingBag, 
  Rocket, Target, Trophy, CheckCircle2, Eye 
} from "lucide-react";
import heroMain from "../../images/Hero_image.png";
import { PromoPopup } from "../components/PromoPopup";
import { useStore } from "../store/useStore";

export function HomePage() {
  const { books, addToCart, user, authors, siteSettings, testimonials, addTestimonial, profilesCount } = useStore();
  const [newTestimonial, setNewTestimonial] = useState("");
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popularBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const approvedTestimonials = testimonials.filter(t => t.is_approved);

  const hasSubmitted = user 
    ? testimonials.some(t => t.user_id === user.id)
    : localStorage.getItem("dp_guest_testimonial_submitted") === "true";

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
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center pt-12 pb-6 lg:pt-16 lg:pb-12 bg-white">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100/50 text-emerald-800 rounded-full">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{authors.length}+ লেখক যুক্ত আছেন</span>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-emerald-950 leading-tight py-2 tracking-tight">
                  {siteSettings.heroTitle} <br />
                  <span className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent py-2 px-1 inline-block">{siteSettings.heroSubtitle}</span>
                </h1>

                <p className="text-base md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                  {siteSettings.heroDescription}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 lg:pt-6">
                <Link 
                  to="/join-writer" 
                  className="group relative px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center gap-3 overflow-hidden w-full sm:w-auto justify-center"
                >
                  <span className="relative z-10">{siteSettings.heroCtaText}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Link>
                <Link 
                  to="/browse" 
                  className="px-8 py-5 bg-slate-50 text-emerald-950 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all border border-slate-200/50 w-full sm:w-auto text-center"
                >
                  {siteSettings.heroSecondaryCtaText}
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-[280px] lg:max-w-none mx-auto mt-6 lg:mt-0">
              <div className="relative z-10">
                <div className="absolute -inset-4 bg-emerald-100/50 rounded-[3rem] blur-2xl -z-10 animate-pulse"></div>
                <img 
                  src={heroMain} 
                  alt="Hero Content" 
                  className="w-full h-auto drop-shadow-[0_32px_64px_rgba(5,150,105,0.15)] rounded-[2.5rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Total Books", value: books.length, icon: BookOpen, color: "emerald" },
              { label: "Active Authors", value: authors.length, icon: Edit3, color: "blue" },
              { label: "Happy Readers", value: profilesCount, icon: Users, color: "amber" },
              { label: "Verified Reviews", value: approvedTestimonials.length, icon: Star, color: "rose" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-3"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-emerald-950 mb-4 tracking-tight">জনপ্রিয় বইসমূহ</h2>
              <p className="text-slate-500 font-medium">পাঠকদের পছন্দের তালিকায় থাকা সেরা কিছু বই</p>
            </div>
            <Link to="/browse" className="hidden md:flex items-center gap-2 text-emerald-600 font-black hover:gap-3 transition-all">
              সবগুলো দেখুন <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-emerald-900/5 border border-emerald-100/20 hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={book.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-emerald-950">{book.rating}</span>
                  </div>
                  <h3 className="font-black text-emerald-950 mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-xs font-bold text-slate-400">{book.author}</p>
                  
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-black text-emerald-600">৳{book.price}</div>
                      <Link to={`/book/${book.id}`} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all">
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                    <button 
                      onClick={() => addToCart(book)}
                      className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> কার্টে যোগ করুন
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest"
            >
              <Sparkles className="w-4 h-4" /> লেখক হওয়ার সুযোগ
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tight leading-tight mb-6">
              আপনার সৃজনশীলতা <br />
              প্রকাশ করুন <span className="text-emerald-600">সঠিক প্ল্যানে</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              আমাদের বিশেষ প্যাকেজগুলো থেকে আপনার জন্য সেরাটি বেছে নিন এবং আপনার সাহিত্যিক যাত্রা শুরু করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-10 rounded-[3rem] border-2 transition-all duration-500 bg-white group hover:shadow-2xl hover:shadow-emerald-950/10 ${
                  plan.popular ? "border-emerald-500 shadow-xl" : "border-slate-100 hover:border-emerald-200"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials Section */}
      <section className="py-24 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tight leading-tight">
              আমাদের কমিউনিটি <span className="text-emerald-600">কী বলছে</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Quote className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950">পাঠকদের অভিজ্ঞতা</h3>
              </div>

              {approvedTestimonials.length > 0 ? (
                <div className="grid gap-6">
                  {approvedTestimonials.slice(0, 3).map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-100/50 relative group"
                    >
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="text-emerald-950/70 font-medium italic mb-6 text-sm leading-relaxed">"{t.content}"</p>
                      <div className="flex items-center gap-3">
                        <img src={t.user_avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                        <div>
                          <div className="font-black text-emerald-950 text-sm">{t.user_name}</div>
                          <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                            {t.user_id ? "Verified Reader" : "Guest Reader"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-[2.5rem] p-12 text-center">
                  <p className="text-emerald-800/50 font-bold italic">প্রথম মতামতটি আপনার হোক!</p>
                </div>
              )}
            </div>

            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-emerald-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl"
              >
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
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="আপনার নাম লিখুন"
                            className="w-full bg-emerald-900/30 border border-emerald-800/50 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-emerald-700"
                            required={!user}
                          />
                        </motion.div>
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-12 md:p-24 rounded-[4rem] border border-white/5 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">আজই আপনার যাত্রা শুরু করুন</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
                আপনার পাণ্ডুলিপি <br />
                এখনই <span className="text-emerald-400">প্রকাশ করুন</span>
              </h2>
              
              <p className="text-emerald-50/60 text-lg md:text-xl mb-12 font-medium">
                হাজারো লেখক ইতিমধ্যে আমাদের প্ল্যাটফর্মে তাদের সাহিত্যিক ক্যারিয়ার গড়ে তুলেছেন। 
                আপনি কি পিছিয়ে থাকবেন?
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/join-writer" 
                  className="group px-12 py-6 bg-white text-emerald-950 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  লেখক হিসেবে যোগ দিন
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/browse" 
                  className="px-12 py-6 bg-emerald-800/40 text-white border-2 border-white/20 backdrop-blur-md rounded-3xl font-black text-xl hover:bg-emerald-800/60 transition-all"
                >
                  বইসমূহ দেখুন
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
