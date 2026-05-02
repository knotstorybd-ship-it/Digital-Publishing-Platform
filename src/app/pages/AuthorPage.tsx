import { useParams, Link } from "react-router";
import { useStore } from "../store/useStore";
import { useState } from "react";
import { SEO } from "../components/SEO";
import { BookCard } from "../components/BookCard";
import { Star, Users, BookOpen, Globe, Mail, Share2, Heart, Filter, ChevronDown, Rocket, ShieldCheck } from "lucide-react";

export function AuthorPage() {
  const { name } = useParams();
  const { getAuthorByName, books, followedAuthorIds, toggleAuthorFollow, user, loading } = useStore();
  const [activeTab, setActiveTab] = useState("books");
  
  let author = getAuthorByName(decodeURIComponent(name || ""));
  const authorName = author?.name || decodeURIComponent(name || "");
  const authorBooks = books.filter(b => b.author.toLowerCase() === authorName.toLowerCase());
  
  if (!author && authorBooks.length > 0) {
    author = {
      id: `generated-${authorName}`,
      name: authorName,
      email: "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
      bio: "আমি ডিজিটাল প্রকাশনীর একজন লেখক।",
      bookCount: authorBooks.length,
      rating: 4.8,
      joinDate: new Date().toISOString()
    };
  }

  const isFollowed = author ? followedAuthorIds.includes(author.id) : false;



  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950 mb-2">লেখক পাওয়া যায়নি</h2>
          <p className="text-slate-500 mb-8">দুঃখিত, এই লেখককে আমরা খুঁজে পাচ্ছি না।</p>
          <Link to="/browse" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black">সব লেখক দেখুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-32 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      <SEO title={`${author.name} - লেখক প্রোফাইল`} />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Author Header Card */}
        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 relative overflow-hidden">
          {/* Decorative Gradient Blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-12">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl relative z-10">
                <img src={author.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-emerald-600/10 blur-[50px] rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <h1 className="text-5xl font-black text-emerald-950 tracking-tight">{author.name}</h1>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <Star className="w-3 h-3 fill-emerald-600" /> Verified Author
                </div>
              </div>

              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8 max-w-2xl italic">
                "{author.bio || "আমি একজন স্বপ্নবাজ লেখক। শব্দ আর ভাবনার মেলবন্ধনে নতুন কিছু সৃষ্টির চেষ্টায় নিয়োজিত থাকি সবসময়।"}"
              </p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-950">{authorBooks.length}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">বইসমূহ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Star className="w-5 h-5 fill-amber-600" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-950">{author.rating || "4.8"}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">রেটিং</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-950">{(authorBooks.length * 42).toLocaleString()}+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পাঠক</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                <button 
                  onClick={async () => {
                    if (!user) {
                      window.dispatchEvent(new CustomEvent("open-auth"));
                      return;
                    }
                    try {
                      await toggleAuthorFollow(author.id);
                    } catch (err: any) {
                      alert("ডেটাবেস এরর: " + (err.message || "ফলো করতে সমস্যা হয়েছে"));
                    }
                  }}
                  className={`px-10 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-3 ${
                    isFollowed 
                      ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                      : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isFollowed ? 'Unfollow' : 'Follow Author'}
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-emerald-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-emerald-600">
                    <Globe className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-80 shrink-0 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest mb-6 flex items-center gap-3">
                <div className="w-1 h-5 bg-emerald-600 rounded-full"></div>
                লেখকের তথ্য
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">সদস্যপদ</p>
                  <p className="font-bold text-emerald-950 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-emerald-600" /> {author.subscriptionPlan || "Starter"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">যোগদান</p>
                  <p className="font-bold text-emerald-950">{new Date(author.joinDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">অবস্থান</p>
                  <p className="font-bold text-emerald-950">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950 text-white p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <ShieldCheck className="w-20 h-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Exclusive Author</p>
              <p className="font-black text-lg mb-6 leading-tight">ডিজিটাল প্রকাশনীর সকল এক্সক্লুসিভ বই সরাসরি লেখকের কাছ থেকে পান।</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Support Author</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-8 border-b border-slate-100 flex-1">
                <button 
                  onClick={() => setActiveTab("books")}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'books' ? 'text-emerald-600' : 'text-slate-300 hover:text-emerald-950'}`}
                >
                  বইসমূহ ({authorBooks.length})
                  {activeTab === 'books' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab("series")}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'series' ? 'text-emerald-600' : 'text-slate-300 hover:text-emerald-950'}`}
                >
                  সিরিজ
                  {activeTab === 'series' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full"></div>}
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-4 ml-8">
                <Filter className="w-4 h-4 text-slate-400" />
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-black text-emerald-950 border border-slate-100 hover:bg-slate-50">
                  সর্টিং <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {activeTab === "books" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {authorBooks.map(book => (
                  <BookCard key={book.id} {...book} />
                ))}
                {authorBooks.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic">এই লেখক এখনো কোনো বই প্রকাশ করেননি।</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "series" && (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em]">শীঘ্রই আসছে...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
