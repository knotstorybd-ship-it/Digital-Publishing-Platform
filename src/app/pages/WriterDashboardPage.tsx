import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Upload, FileText, DollarSign, TrendingUp, BookOpen, CheckCircle, Clock, User, X, LogOut, Globe, Edit3, Zap } from "lucide-react";
import { useStore } from "../store/useStore";

const plans = [
  {
    name: "প্ল্যান ১",
    price: 420,
    commission: 19,
    duration: "৩ মাস",
    features: [
      "৩ মাসে ৩টি বই প্রদর্শন",
      "বিক্রয় বৃদ্ধির সহায়তা",
      "১৯% কমিশন",
      "আজীবন প্রোফাইল প্রচার",
    ],
  },
  {
    name: "প্ল্যান ২",
    price: 620,
    commission: 15,
    duration: "৬ মাস",
    featured: true,
    features: [
      "৬ মাসে ৬টি বই প্রদর্শন",
      "প্রোমোশন + মার্কেটিং",
      "১৫% কমিশন",
      "আজীবন প্রোফাইল প্রচার",
    ],
  },
  {
    name: "প্ল্যান ৩",
    price: 820,
    commission: 12,
    duration: "৬ মাস",
    isHot: true,
    features: [
      "৬ মাসে ১২টি বই প্রদর্শন",
      "প্রিমিয়াম ফিচারিং",
      "১২% কমিশন",
      "আজীবন লেখক প্রোফাইল প্রচার",
      "🔥 আজীবন লাইফটাইম সুবিধা",
    ],
  },
];

export function WriterDashboardPage() {
  const { user, books, orders, addBook, subscribe, logout, fetchAuthorOrders } = useStore();
  const isWriter = user?.isWriter && user?.subscription;
  const [activeTab, setActiveTab] = useState<"plans" | "upload" | "my-books" | "stats">(isWriter ? "stats" : "plans");

  useEffect(() => {
    if (isWriter) {
      fetchAuthorOrders();
    }
  }, [isWriter]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    type: "ebook", // ebook or hardcopy
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    addBook({
      title: formData.title,
      author: user.name,
      price: Number(formData.price),
      category: formData.category,
      cover: formData.cover,
      description: formData.description,
    });
    
    alert(`${formData.type === "ebook" ? "ই-বুক" : "হার্ডকপি বই"} সফলভাবে জমা হয়েছে!`);
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      type: "ebook",
      cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    });
    setActiveTab("my-books");
  };

  // Calculate dynamic stats
  const myBooks = books.filter(b => b.author === user?.name);
  const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalRoyalty = totalSales * 0.83;
  const uniqueReaders = new Set(orders.map(o => o.user_id)).size;

  // If user is not logged in, show restricted view
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/5 text-center border border-emerald-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
          <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Edit3 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-emerald-950 mb-4 tracking-tight">লেখক হিসেবে যাত্রা শুরু করুন</h1>
          <p className="text-emerald-900/60 font-medium mb-12 leading-relaxed">
            আপনার সাহিত্যিক প্রতিভা বিশ্বের সামনে তুলে ধরতে আজই আমাদের লেখক কমিউনিটিতে যোগ দিন। আপনার যদি একাউন্ট না থাকে তবে রেজিস্ট্রেশন করুন।
          </p>
          <div className="flex flex-col gap-4">
            <Link 
              to="/join-writer"
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Zap className="w-6 h-6" />
              এখনই শুরু করুন
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-auth"))}
              className="w-full py-5 bg-slate-50 text-emerald-950 rounded-2xl font-black hover:bg-slate-100 transition-all"
            >
              পূর্বেই একাউন্ট আছে? লগইন করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in but not a writer yet, show plans
  if (!user.isWriter || !user.subscription) {

    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">আপনার সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              আমাদের প্লাটফর্মে আপনার বই প্রকাশ করার জন্য যেকোনো একটি প্ল্যান বেছে নিন। প্রতিটি প্ল্যানে রয়েছে আজীবন প্রোফাইল প্রচারের সুবিধা।
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -10, borderColor: '#10b981' }}
                className={`bg-white rounded-2xl p-8 shadow-sm border transition-all hover:shadow-2xl relative flex flex-col ${
                  plan.featured
                    ? "border-secondary ring-2 ring-secondary/20 scale-105 z-10"
                    : plan.isHot
                      ? "border-pink-500 ring-2 ring-pink-500/20 scale-105 z-10"
                      : "border-primary/10"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-white rounded-full text-xs font-bold shadow-lg">
                    সর্বাধিক জনপ্রিয়
                  </div>
                )}
                {plan.isHot && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-pink-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-bounce">
                    🔥 আজীবন সুবিধা
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.isHot ? "text-pink-600" : ""}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.isHot ? "text-pink-500" : "text-primary"}`}>৳{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/ {plan.duration}</span>
                </div>
                
                <div className={`rounded-xl p-4 mb-6 text-center ${plan.isHot ? "bg-pink-50 border border-pink-100" : "bg-primary/5"}`}>
                  <div className={`text-2xl font-bold ${plan.isHot ? "text-pink-600" : "text-primary"}`}>{plan.commission}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">বিক্রয় কমিশন</div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/checkout?plan=${plan.isHot ? 'plan3' : plan.featured ? 'plan2' : 'plan1'}&price=${plan.price}`}
                  className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all text-center block ${
                    plan.isHot
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-gradient text-white hover:scale-105"
                      : plan.featured
                        ? "bg-secondary text-white hover:bg-secondary/90"
                        : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {plan.isHot ? "🚀 আজীবন লাইফটাইম শুরু করুন" : "প্ল্যানটি বেছে নিন"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const expirationDate = new Date(user.subscription.expiresAt).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sidebarItems = [
    { id: "stats", label: "সারসংক্ষেপ", icon: TrendingUp },
    { id: "upload", label: "বই আপলোড", icon: Upload },
    { id: "my-books", label: "আমার বইসমূহ", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
        <div className="p-8 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3 group mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all shadow-lg shadow-primary/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 tracking-tight">Digital Prokashoni</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Author Portal</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/30 translate-x-2" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-white" : "text-slate-400"}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">আপনার প্ল্যান</p>
            <p className="text-sm font-black text-slate-800 mb-1">{user.subscription.planName}</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-primary" />
              মেয়াদ: {expirationDate}
            </p>
          </div>

          <Link 
            to="/" 
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-secondary/10 text-secondary rounded-2xl font-bold hover:bg-secondary/20 transition-all"
          >
            <Globe className="w-5 h-5" />
            ওয়েবসাইট দেখুন
          </Link>

          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-2xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1">আপনার ডিজিটাল প্রকাশনী কার্যক্রম পরিচালনা করুন</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab("upload")}
              className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              নতুন বই যোগ করুন
            </button>
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "মোট বিক্রয়", value: `৳${totalSales.toLocaleString()}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "বিক্রিত বই", value: `${orders.length}টি`, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "রয়্যালটি (৮৩%)", value: `৳${totalRoyalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "পাঠক সংখ্যা", value: `${uniqueReaders} জন`, icon: User, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                  <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-800">বিক্রয় গ্রাফ</h3>
                    <select className="bg-slate-50 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-primary/10">
                      <option>শেষ ৭ দিন</option>
                      <option>শেষ ৩০ দিন</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[40, 60, 35, 80, 55, 90, 45].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t-lg relative"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ৳{(h * 100).toLocaleString()}
                          </div>
                        </motion.div>
                        <span className="text-[10px] text-slate-400 font-medium">শনি</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">কমিশন ক্যালকুলেটর</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">বইয়ের মূল্য (৳)</label>
                      <input 
                        type="number" 
                        placeholder="৫০০"
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const royalty = val * 0.83;
                          const commission = val * 0.17;
                          const rEl = document.getElementById("calc-royalty-sb");
                          const cEl = document.getElementById("calc-comm-sb");
                          if (rEl) rEl.innerText = `৳${royalty.toFixed(0)}`;
                          if (cEl) cEl.innerText = `৳${commission.toFixed(0)}`;
                        }}
                        className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-lg" 
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
                        <span className="text-sm font-bold text-emerald-600">আপনার আয়</span>
                        <span id="calc-royalty-sb" className="text-xl font-bold text-emerald-700">৳০</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                        <span className="text-sm font-bold text-slate-500">কমিশন (১৭%)</span>
                        <span id="calc-comm-sb" className="text-xl font-bold text-slate-700">৳০</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center italic">
                      * ডিজিটাল প্রকাশনী প্ল্যাটফর্ম প্রতিটি বিক্রয়ের জন্য ১৭% কমিশন নিয়ে থাকে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="col-span-full">
                      <label className="text-sm font-bold text-slate-500 block mb-4 uppercase tracking-wider">বইয়ের মাধ্যম</label>
                      <div className="flex gap-4">
                        {["ebook", "hardcopy"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: t as any })}
                            className={`flex-1 py-4 rounded-3xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${
                              formData.type === t ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400"
                            }`}
                          >
                            {t === "ebook" ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                            {t === "ebook" ? "ই-বুক" : "হার্ডকপি"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">বইয়ের নাম</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="যেমন: আরণ্যক"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">বিভাগ</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="উপন্যাস">উপন্যাস</option>
                        <option value="কবিতা">কবিতা</option>
                        <option value="ইতিহাস">ইতিহাস</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">মূল্য (৳)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                        placeholder="৳০.০০"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">কভার ফটো ইউআরএল</label>
                      <input
                        type="text"
                        value={formData.cover}
                        onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">সংক্ষিপ্ত বিবরণ</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                      className="w-full px-6 py-4 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      placeholder="বইটি সম্পর্কে কিছু লিখুন..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-primary text-white rounded-[32px] font-bold shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    <CheckCircle className="w-6 h-6" />
                    বইটি প্রকাশ করুন
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "my-books" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.filter(b => b.author === user.name).map((book) => (
                <div key={book.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-md">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full uppercase tracking-widest">{book.category}</span>
                      <span className="text-lg font-bold text-slate-900">৳{book.price}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">{book.title}</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">বিক্রয়</p>
                        <p className="font-bold text-slate-800">০</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">আয়</p>
                        <p className="font-bold text-emerald-600">৳০</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">সম্পাদনা</button>
                      <button className="p-3 bg-destructive/5 text-destructive rounded-xl hover:bg-destructive/10 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {books.filter(b => b.author === user.name).length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-400">কোনো বই খুঁজে পাওয়া যায়নি</h3>
                  <button onClick={() => setActiveTab("upload")} className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    প্রথম বই যোগ করুন
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
