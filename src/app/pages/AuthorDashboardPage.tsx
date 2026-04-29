import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Plus, 
  Edit3, 
  Camera,
  LogOut,
  ChevronRight,
  BookCopy,
  Star,
  CheckCircle2,
  Clock,
  Archive,
  Eye,
  MessageSquare,
  Upload,
  FileText,
  X as XIcon,
  Zap,
  Globe,
  MoreVertical,
  ArrowLeft,
  Home
} from "lucide-react";
import { useStore } from "../store/useStore";
import { Link, useNavigate } from "react-router";

export function AuthorDashboardPage() {
  const { user, getMyBooks, updateProfile, signOut, books, orders, addBook, updateBook, deleteBook } = useStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  
  const myBooks = getMyBooks();
  const myBookIds = myBooks.map(b => b.id);
  const mySales = orders.filter(o => myBookIds.includes(o.book_id));
  
  // Calculate dynamic royalty based on plan
  const planRoyaltyRates: Record<string, number> = {
    "নতুন লেখক (Starter)": 0.75,
    "জনপ্রিয় লেখক (Pro)": 0.82,
    "কিংবদন্তি লেখক (Elite)": 0.85
  };
  const currentRoyaltyRate = user?.subscription?.planName ? (planRoyaltyRates[user.subscription.planName] || 0.83) : 0.83;
  const totalRoyalty = mySales.reduce((sum, o) => sum + o.amount, 0) * currentRoyaltyRate;
  const totalReaders = mySales.length;

  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || !user.isWriter) {
      navigate("/join-writer");
    }
  }, [user, navigate]);

  if (!user || !user.isWriter) {
    return null;
  }

  const stats = [
    { label: "মোট বই", value: myBooks.length, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "মোট রিডার", value: totalReaders, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "রয়্যালটি", value: `৳${totalRoyalty.toLocaleString()}`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "রিভিউ", value: myBooks.reduce((sum, b) => sum + (b.reviews || 0), 0), icon: MessageSquare, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const [isUploading, setIsUploading] = useState(false);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const coverFile = (form.querySelector('#cover-upload') as HTMLInputElement).files?.[0];
    const pdfFile = (form.querySelector('#file-upload') as HTMLInputElement).files?.[0];

    const bookData = {
      title: formData.get("title") as string,
      author: user.name,
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      description: formData.get("desc") as string,
    };

    setIsUploading(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await addBook(bookData, coverFile, pdfFile);
      }
      setShowUploadModal(false);
      setEditingBook(null);
      alert("বইটি সফলভাবে প্রকাশ করা হয়েছে!");
    } catch (error: any) {
      console.error(error);
      alert("বই আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            হোমপেজে ফিরে যান
          </button>
        </div>
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-emerald-900/5 mb-10 relative overflow-hidden border border-emerald-100/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-60"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-12">
            <div className="relative group">
              <div className="w-44 h-44 rounded-[4rem] overflow-hidden shadow-2xl shadow-emerald-900/20 border-4 border-white transition-transform duration-500 group-hover:scale-105">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={() => setShowEditProfile(true)}
                className="absolute -bottom-2 -right-2 w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition-all transform hover:rotate-12"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
                <h1 className="text-5xl font-black text-emerald-950 tracking-tight">{user.name}</h1>
                <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Author
                </div>
              </div>
              <p className="text-emerald-900/60 font-medium max-w-2xl mb-10 text-xl leading-relaxed">
                {user.bio || "আপনার সাহিত্যিক প্রোফাইল তৈরি করুন এবং পাঠকদের সাথে যুক্ত হন।"}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-5">
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all text-lg flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  প্রোফাইল সেটিংস
                </button>
                <button 
                  onClick={() => { setEditingBook(null); setShowUploadModal(true); }}
                  className="px-10 py-4 bg-white text-emerald-950 border-2 border-emerald-100 rounded-[2rem] font-black hover:bg-emerald-50 transition-all text-lg flex items-center gap-2"
                >
                  <Plus className="w-6 h-6 text-emerald-600" />
                  নতুন বই প্রকাশ করুন
                </button>
              </div>
            </div>

            <div className="hidden xl:block w-px h-40 bg-slate-100"></div>

            <div className="flex flex-col items-center md:items-end gap-3 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em]">অ্যাক্টিভ প্ল্যান</p>
              <p className="text-3xl font-black text-emerald-950 tracking-tight">{user.subscription?.planName}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <Clock className="w-4 h-4" />
                মেয়াদ: {new Date(user.subscription?.expiresAt || "").toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Navigation Sidebar */}
          <aside className="lg:w-72 space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all mb-4 border border-emerald-100 group"
            >
              <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              ওয়েবসাইট দেখুন
            </button>

            {[
              { id: "overview", label: "ড্যাশবোর্ড", icon: TrendingUp },
              { id: "upload", label: "নতুন বই আপলোড", icon: Upload },
              { id: "my-books", label: "আমার বইসমূহ", icon: BookCopy },
              { id: "earnings", label: "আয় ও রয়্যালটি", icon: DollarSign },
              { id: "settings", label: "সেটিংস", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] font-black transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 translate-x-2" 
                    : "text-slate-500 hover:bg-white hover:text-emerald-950 shadow-sm"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
            
            <div className="pt-10">
              <button 
                onClick={() => { signOut(); navigate("/"); }}
                className="w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] font-black text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
              >
                <LogOut className="w-5 h-5" />
                লগ আউট করুন
              </button>
            </div>
          </aside>

          {/* Main Content View */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100/30 group hover:shadow-2xl transition-all duration-500">
                        <div className={`p-4 w-fit rounded-2xl mb-6 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-7 h-7" />
                        </div>
                        <div className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid xl:grid-cols-2 gap-10">
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-emerald-100/30">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-emerald-950">সাম্প্রতিক সেলস</h3>
                        <Link to="#" className="text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline">সব দেখুন</Link>
                      </div>
                      <div className="space-y-8">
                        {mySales.slice(0, 4).map((order) => {
                          const book = books.find(b => b.id === order.book_id);
                          return (
                            <div key={order.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:rotate-6">
                                  <BookCopy className="w-7 h-7" />
                                </div>
                                <div>
                                  <div className="font-black text-emerald-950 line-clamp-1">"{book?.title}" বিক্রি হয়েছে</div>
                                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                                    {new Date(order.created_at).toLocaleDateString()} • ৳{order.amount}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-200" />
                            </div>
                          );
                        })}
                        {mySales.length === 0 && (
                          <div className="text-center py-20">
                            <Archive className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">এখনও কোনো বিক্রি হয়নি</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-emerald-100/30">
                      <h3 className="text-2xl font-black text-emerald-950 mb-10">রয়্যালটি গ্রোথ</h3>
                      <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {[40, 60, 35, 80, 55, 90, 45].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="w-full bg-emerald-50 group-hover:bg-emerald-600 rounded-2xl transition-all duration-300 relative shadow-sm"
                            >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-950 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                ৳{(h * 120).toLocaleString()}
                              </div>
                            </motion.div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">W{i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* My Books Tab */}
              {activeTab === "my-books" && (
                <motion.div 
                  key="my-books"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-[3.5rem] shadow-sm border border-emerald-100/30 overflow-hidden"
                >
                  <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div>
                      <h3 className="text-2xl font-black text-emerald-950 mb-1">আমার প্রকাশিত বইসমূহ</h3>
                      <p className="text-xs font-bold text-slate-400">মোট {myBooks.length}টি বই লাইভ আছে</p>
                    </div>
                    <button 
                      onClick={() => { setEditingBook(null); setShowUploadModal(true); }}
                      className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm"
                    >
                      <Plus className="w-5 h-5" />
                      নতুন বই
                    </button>
                  </div>
                  
                  <div className="p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {myBooks.map((book) => (
                      <div key={book.id} className="group bg-[#F8FAFC] rounded-[2.5rem] p-6 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(6,78,59,0.15)] border-2 border-transparent hover:border-emerald-100">
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-xl group-hover:scale-[1.02] transition-transform">
                          <img src={book.cover} className="w-full h-full object-cover" />
                          <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                            {book.status}
                          </div>
                          <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button 
                              onClick={() => { setEditingBook(book); setShowUploadModal(true); }}
                              className="w-12 h-12 bg-white text-emerald-950 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => { if(confirm("নিশ্চিত?")) deleteBook(book.id); }}
                              className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Archive className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xl font-black text-emerald-950 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">{book.title}</h4>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{book.category}</div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-black">{book.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {myBooks.length === 0 && (
                      <div className="col-span-full py-32 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-emerald-100">
                        <BookOpen className="w-20 h-20 text-emerald-900/10 mx-auto mb-8" />
                        <h3 className="text-2xl font-black text-emerald-950 mb-4 tracking-tight">কোনো বই খুঁজে পাওয়া যায়নি</h3>
                        <p className="text-emerald-900/40 font-medium mb-10">আপনার প্রথম বইটি প্রকাশ করে সাহিত্যিক সফর শুরু করুন!</p>
                        <button 
                          onClick={() => setShowUploadModal(true)}
                          className="px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all text-lg"
                        >
                          প্রথম বই প্রকাশ করুন
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Earnings Tab */}
              {activeTab === "earnings" && (
                <motion.div 
                  key="earnings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-emerald-100/30"
                >
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-black text-emerald-950 mb-6 tracking-tight">আয় ও রয়্যালটি</h2>
                    <p className="text-emerald-900/60 font-medium text-lg leading-relaxed">
                      আপনার বিক্রিত বইয়ের পরিসংখ্যান এবং উপার্জিত রয়্যালটির বিস্তারিত তথ্য এখানে পাওয়া যাবে। 
                      আমাদের প্ল্যাটফর্মে আপনি ৮৩% রয়্যালটি সুবিধা পাবেন।
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-10 mb-16">
                    <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mb-24 -mr-24"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">মোট উপার্জন</p>
                      <h3 className="text-6xl font-black mb-8 tracking-tighter">৳{totalRoyalty.toLocaleString()}</h3>
                      <div className="flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full w-fit backdrop-blur-md">
                        <TrendingUp className="w-5 h-5 text-emerald-300" />
                        <span className="text-sm font-black">+২৫.৫% গত মাসের তুলনায়</span>
                      </div>
                    </div>
                    
                    <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">পরবর্তী পেমেন্ট</p>
                          <h4 className="text-3xl font-black text-emerald-950">৳০.০০</h4>
                        </div>
                        <div className="p-5 bg-amber-50 text-amber-600 rounded-[1.5rem]">
                          <Clock className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 w-1/3"></div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">পেমেন্ট থ্রেশহোল্ড: ৳৫০০</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-emerald-950 px-4">পেমেন্ট হিস্ট্রি</h4>
                    <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">এখনও কোনো পেমেন্ট রেকর্ড নেই</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Book Upload/Edit Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Modal Sidebar */}
              <div className="w-full md:w-80 bg-emerald-950 p-12 text-white flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-10 backdrop-blur-md">
                    <BookCopy className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-6 leading-tight">
                    {editingBook ? "বইয়ের তথ্য পরিবর্তন" : "নতুন বই প্রকাশ করুন"}
                  </h3>
                  <p className="text-emerald-100/50 font-medium text-sm leading-relaxed">
                    আপনার সৃষ্টির সঠিক তথ্য প্রদান করুন যাতে পাঠকরা সহজে আপনার বই খুঁজে পায়।
                  </p>
                </div>
                <div className="relative z-10 pt-10 border-t border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">গাইডলাইন</p>
                  <ul className="space-y-4">
                    {["হাই-রেজোলিউশন কভার", "আকর্ষণীয় শিরোনাম", "সঠিক ক্যাটেগরি", "বইয়ের সারসংক্ষেপ"].map(g => (
                      <li key={g} className="flex items-center gap-3 text-xs font-bold text-emerald-100/70">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Form */}
              <div className="flex-1 p-12 md:p-16 overflow-y-auto max-h-[85vh]">
                <form onSubmit={handleBookSubmit} className="space-y-10">
                  
                  {/* File Upload Section - HIGHLIGHTED AT TOP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-emerald-50 rounded-[3rem] border-2 border-dashed border-emerald-200">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/60 ml-6">বইয়ের কভার (Image)</label>
                      <div className="relative group cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          id="cover-upload" 
                          onChange={(e) => {
                            const label = document.getElementById('cover-label');
                            if (label && e.target.files?.[0]) label.innerText = "✓ কভার সিলেক্ট করা হয়েছে";
                          }}
                        />
                        <label htmlFor="cover-upload" className="w-full h-32 bg-white border-2 border-emerald-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all cursor-pointer">
                          <Camera className="w-6 h-6 text-emerald-400 group-hover:text-emerald-600" />
                          <span id="cover-label" className="text-[10px] font-black text-emerald-600">কভার ইমেজ সিলেক্ট করুন</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/60 ml-6">ই-বুক ফাইল (PDF/EPUB)</label>
                      <div className="relative group cursor-pointer">
                        <input 
                          type="file" 
                          accept=".pdf,.epub" 
                          className="hidden" 
                          id="file-upload" 
                          onChange={(e) => {
                            const label = document.getElementById('file-label');
                            if (label && e.target.files?.[0]) label.innerText = "✓ PDF সিলেক্ট করা হয়েছে";
                          }}
                        />
                        <label htmlFor="file-upload" className="w-full h-32 bg-white border-2 border-emerald-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all cursor-pointer">
                          <FileText className="w-6 h-6 text-emerald-400 group-hover:text-emerald-600" />
                          <span id="file-label" className="text-[10px] font-black text-emerald-600">PDF অথবা EPUB ফাইল সিলেক্ট করুন</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">বইয়ের শিরোনাম</label>
                      <input name="title" defaultValue={editingBook?.title} required placeholder="যেমন: আরণ্যক" className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">বিভাগ (Category)</label>
                      <select name="category" defaultValue={editingBook?.category} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none appearance-none cursor-pointer">
                        <option>উপন্যাস</option>
                        <option>কবিতা</option>
                        <option>ইতিহাস</option>
                        <option>শিশু সাহিত্য</option>
                        <option>অন্যান্য</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">মূল্য (৳)</label>
                      <input name="price" type="number" defaultValue={editingBook?.price} required placeholder="৳ পরিমাণ" className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">পৃষ্ঠা সংখ্যা</label>
                      <input name="pages" type="number" defaultValue={editingBook?.pages} placeholder="যেমন: ২৫০" className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">বইয়ের সংক্ষিপ্ত বর্ণনা</label>
                    <textarea name="desc" defaultValue={editingBook?.description} rows={5} placeholder="বইটি সম্পর্কে কিছু লিখুন যা পাঠকদের আকৃষ্ট করবে..." className="w-full px-8 py-6 bg-slate-50 border-0 rounded-[2.5rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none resize-none"></textarea>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black hover:bg-slate-100 transition-all"
                    >
                      বাতিল
                    </button>
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="flex-[2] py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-[1.02] transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                      {isUploading ? "আপলোড হচ্ছে..." : (editingBook ? "আপডেট করুন" : "প্রকাশ করুন")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal (Author Specific) */}
      <AnimatePresence>
        {showEditProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProfile(false)}
              className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12 md:p-16 flex flex-col items-center bg-emerald-50/50 border-b border-emerald-100">
                <div className="relative group">
                  <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white transition-transform group-hover:rotate-6" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white border-4 border-emerald-50">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-emerald-950 mt-6 tracking-tight">প্রোফাইল আপডেট</h3>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateProfile({
                    name: formData.get("name") as string,
                    bio: formData.get("bio") as string,
                    avatar: formData.get("avatar") as string,
                  });
                  setShowEditProfile(false);
                }}
                className="p-12 md:p-16 space-y-10"
              >
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">আপনার নাম</label>
                    <input name="name" defaultValue={user.name} required className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">বায়ো (Bio)</label>
                    <textarea name="bio" defaultValue={user.bio} rows={4} className="w-full px-8 py-6 bg-slate-50 border-0 rounded-[2rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none resize-none" placeholder="আপনার সম্পর্কে কিছু লিখুন..."></textarea>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 ml-6">অ্যাভাটার URL</label>
                    <input name="avatar" defaultValue={user.avatar} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black hover:bg-slate-100 transition-all">বাতিল</button>
                  <button type="submit" className="flex-[2] py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all text-lg">সংরক্ষণ করুন</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
