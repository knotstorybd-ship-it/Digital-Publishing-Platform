import { useParams, Link } from "react-router";
import { Star, BookOpen, User, Award, ShieldCheck, Mail, MapPin, Globe, Share2, Heart } from "lucide-react";
import { BookCard } from "../components/BookCard";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function AuthorPage() {
  const { name } = useParams();
  const { getAuthorByName, books, followedAuthorIds, toggleAuthorFollow } = useStore();
  const [activeTab, setActiveTab] = useState("books");
  
  const author = getAuthorByName(name || "");
  const authorBooks = author ? books.filter((b) => b.author === author.name) : [];
  const isFollowing = author ? followedAuthorIds.includes(author.id) : false;

  if (!author) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto">
            <User className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black text-emerald-950">লেখককে পাওয়া যায়নি</h1>
          <p className="text-slate-500">দুঃখিত, এই নামের কোনো লেখক আমাদের সিস্টেমে নেই।</p>
          <Link to="/browse" className="inline-flex px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20">
            বইসমূহ দেখুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] selection:bg-emerald-100">
      {/* Hero Header */}
      <div className="h-80 bg-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[150%] bg-emerald-400 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8"
          >
            <div className="relative group">
              <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-[6px] border-white shadow-2xl bg-white relative">
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="text-center md:text-left pb-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  Verified Author
                </span>
                <span className="px-4 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  Elite Club
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">{author.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-emerald-100/60 font-bold">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> ঢাকা, বাংলাদেশ</span>
                <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> website.com</span>
                <span className="flex items-center gap-2 text-emerald-400"><ShieldCheck className="w-4 h-4" /> ট্রাস্টেড লেখক</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-emerald-950 mb-6 uppercase tracking-widest">লেখকের বায়ো</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">{author.bio}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl text-center">
                  <div className="text-2xl font-black text-emerald-950">{author.bookCount}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">বই</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl text-center">
                  <div className="text-2xl font-black text-emerald-950">{author.rating}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-secondary">রেটিং</div>
                </div>
              </div>

              <div className="h-px bg-slate-50 my-10"></div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => author && toggleAuthorFollow(author.id).catch(() => window.dispatchEvent(new CustomEvent("open-auth")))}
                  className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 ${
                    isFollowing 
                      ? "bg-slate-100 text-slate-500" 
                      : "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isFollowing ? "ফলো করা হয়েছে" : "ফলো করুন"}
                </button>
                <div className="flex gap-4">
                  <button className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> মেসেজ
                  </button>
                  <button className="p-4 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3rem] p-10 text-white">
              <h3 className="text-lg font-black mb-8 uppercase tracking-widest opacity-60">অর্জনসমূহ</h3>
              <div className="space-y-6">
                {[
                  { label: "বেস্ট সেলার ২০২৪", desc: "হাজারো কপি বিক্রিত", icon: Star },
                  { label: "টপ ভেরিফাইড", desc: "বিশ্বস্ত সাহিত্যিক", icon: ShieldCheck },
                ].map((badge, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black tracking-tight">{badge.label}</p>
                      <p className="text-xs text-white/60">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center gap-8 border-b border-slate-100 pb-2">
              {[
                { id: "books", label: "লেখকের বইসমূহ", icon: BookOpen },
                { id: "about", label: "বিস্তারিত", icon: User },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative py-4 px-2 flex items-center gap-2 text-sm font-black transition-all
                    ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {authorBooks.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>

            {authorBooks.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-6">
                  <BookOpen className="w-10 h-10" />
                </div>
                <p className="text-slate-400 font-bold">এই লেখকের কোনো বই এখনো প্রকাশিত হয়নি</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
