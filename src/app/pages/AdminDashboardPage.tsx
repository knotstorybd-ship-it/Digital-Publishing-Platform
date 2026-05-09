import { useState } from "react";
import { 
  LayoutDashboard, 
  BookCopy, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Trash2, 
  Edit3, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Calendar,
  Mail,
  ShieldCheck,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  Archive,
  Eye,
  Zap,
  Bell,
  Menu,
  MoreVertical,
  Filter,
  Download,
  Palette,
  Lock,
  ArrowLeft,
  LogOut,
  Quote,
  CreditCard,
  XCircle
} from "lucide-react";
import { useStore, Author, Book } from "../store/useStore";
import { useNavigate } from "react-router";

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    books, deleteBook, addBook, authors, updateAuthor, deleteAuthor, updateBook, orders,
    siteSettings, updateSiteSettings, testimonials, approveTestimonial, deleteTestimonial,
    user, signIn, signInWithGoogle, signOut, approvePayment, rejectPayment, notifications
  } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditAuthorModal, setShowEditAuthorModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Admin Login State - standalone, no Supabase required
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem("dp_admin_auth") === "true"
  );
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "dp@2026";

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("dp_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Wrong username or password!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("dp_admin_auth");
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 selection:bg-emerald-100">
        <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-2xl border border-emerald-50">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-emerald-950 mb-2 tracking-tight">এডমিন এক্সেস</h2>
            <p className="text-slate-500 font-medium">ড্যাশবোর্ড দেখতে লগইন করুন</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-emerald-950 ml-2 uppercase tracking-widest">ইউজারনেম</label>
              <input 
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-emerald-100 transition-all font-bold"
                placeholder="ইউজারনেম দিন"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-emerald-950 ml-2 uppercase tracking-widest">পাসওয়ার্ড</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-emerald-100 transition-all font-bold pr-20"
                  placeholder="পাসওয়ার্ড দিন"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm font-bold text-center">
                {loginError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-emerald-950 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-950/20 hover:bg-black transition-all text-lg flex items-center justify-center gap-3"
            >
              লগইন করুন
              <ChevronRight className="w-5 h-5" />
            </button>

            <button 
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-4 text-slate-400 font-black hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              হোমপেজে ফিরে যান
            </button>
          </form>
        </div>
      </div>
    );
  }

  const showNotify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
  const activeUsers = new Set(orders.map(o => o.user_id)).size;

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Total Revenue", value: `৳${totalSales.toLocaleString()}`, icon: DollarSign, trend: "+১২.৫%", isUp: true, color: "emerald" },
    { label: "Active Readers", value: activeUsers.toLocaleString(), icon: Users, trend: "+৫.২%", isUp: true, color: "blue" },
    { label: "Book Inventory", value: books.length.toLocaleString(), icon: BookCopy, trend: "+২", isUp: true, color: "violet" },
    { label: "Verified Authors", value: authors.length.toLocaleString(), icon: ShieldCheck, trend: "+৮.১%", isUp: true, color: "amber" },
  ];

  const handleEditAuthor = (author: Author) => {
    setSelectedAuthor(author);
    setShowEditAuthorModal(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setShowEditBookModal(true);
  };

  const toggleFeatured = (book: Book) => {
    updateBook(book.id, { isFeatured: !book.isFeatured });
    showNotify(`"${book.title}" featured status updated`);
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        showNotify("Book deleted successfully", "success");
      } catch (err: any) {
        console.error("Delete Error:", err);
        showNotify(`Error: ${err.message || "Failed to delete book"}`, "error");
      }
    }
  };

  const handleDeleteAuthor = (id: string) => {
    if (confirm("Are you sure you want to remove this author?")) {
      deleteAuthor(id);
      showNotify("Author removed from platform", "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* Premium Notification Toast */}
      {notification && (
        <div className={`fixed top-0 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border transition-all ${
          notification.type === 'success' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-rose-600 text-white border-rose-400'
        } translate-y-12`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20">
        <div className="p-10 border-b border-slate-100">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-black text-emerald-950 text-xl tracking-tight">Admin Central</h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Management Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-8 space-y-3">
          {[
            { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
            { id: "authors", label: "Author Network", icon: Users },
            { id: "books", label: "Book Inventory", icon: BookCopy },
            { id: "payments", label: "Payments", icon: CreditCard },
            { id: "appearance", label: "Site Appearance", icon: Palette },
            { id: "testimonials", label: "Testimonials", icon: Quote },
            { id: "settings", label: "System Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm("");
              }}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-bold transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 translate-x-2" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-emerald-950"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</p>
                <p className="text-sm font-bold text-emerald-600">All Systems Operational</p>
              </div>
            </div>
            <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors mb-3">
              View System Logs
            </button>
            <button 
              onClick={() => handleAdminLogout()}
              className="w-full py-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Secure Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-emerald-950 tracking-tight mb-2">
              Welcome Back, <span className="text-emerald-600">Admin</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm relative group"
            >
              <Bell className="w-6 h-6" />
              {notifications.some(n => !n.is_read) && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all text-lg"
            >
              <Plus className="w-6 h-6" />
              Create New Entry
            </button>
          </div>
        </header>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-emerald-950 mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-emerald-950">Financial Performance</h3>
                    <p className="text-sm font-bold text-slate-400">Transaction monitoring and trends</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
                
                <div className="h-80 flex items-end justify-between gap-6 px-4">
                  {[65, 45, 85, 55, 95, 75, 80, 60, 90, 70, 85, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div 
                        style={{ height: `${h}%` }}
                        className="w-full bg-emerald-50 group-hover:bg-emerald-600 rounded-2xl relative transition-all duration-300"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-950 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ৳{(h * 1500).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">M{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-emerald-950">Recent Logs</h3>
                  <button className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">See All</button>
                </div>
                <div className="space-y-8">
                  {orders.slice(0, 5).map((order) => {
                    const book = books.find(b => b.id === order.book_id);
                    return (
                      <div key={order.id} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-emerald-950 truncate">New order for "{book?.title}"</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">৳{order.amount}</span>
                            <span className="text-[10px] font-bold text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-slate-300">{new Date(order.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {orders.length === 0 && (
                    <div className="text-center py-20">
                      <Archive className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No recent transactions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Books Management Tab */}
        {activeTab === "books" && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black text-emerald-950 mb-1 tracking-tight">Content Repository</h3>
                <p className="text-sm font-bold text-slate-400">Total volume: {books.length} publications</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/30" />
                  <input 
                    type="text" 
                    placeholder="Filter by title, author or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <button className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-emerald-600 transition-all shadow-sm">
                  <Filter className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-emerald-900/30 text-[10px] uppercase tracking-[0.3em] font-black">
                    <th className="px-10 py-8">Publication Details</th>
                    <th className="px-10 py-8">Lifecycle State</th>
                    <th className="px-10 py-8">Marketability</th>
                    <th className="px-10 py-8">Unit Price</th>
                    <th className="px-10 py-8 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img src={book.cover} className="w-14 h-20 object-cover rounded-xl shadow-xl group-hover:scale-105 transition-transform" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center border-4 border-white">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          </div>
                          <div>
                            <div className="font-black text-emerald-950 text-lg mb-1">{book.title}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-emerald-600/40 uppercase tracking-widest">{book.author}</span>
                              <span className="text-[10px] font-bold text-slate-200">•</span>
                              <span className="text-[10px] font-black text-emerald-600/40 uppercase tracking-widest">{book.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          book.status === "Published" ? "bg-emerald-50 text-emerald-600" : 
                          book.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            book.status === "Published" ? "bg-emerald-600" : 
                            book.status === "Draft" ? "bg-amber-600" : "bg-slate-500"
                          }`}></div>
                          {book.status}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <button 
                          onClick={() => toggleFeatured(book)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                            book.isFeatured 
                              ? "bg-amber-100 text-amber-600 shadow-sm scale-105" 
                              : "bg-slate-50 text-slate-300 hover:text-slate-400"
                          }`}
                        >
                          <Zap className={`w-3.5 h-3.5 ${book.isFeatured ? "fill-amber-600" : ""}`} />
                          {book.isFeatured ? "Featured" : "Regular"}
                        </button>
                      </td>
                      <td className="px-10 py-8 font-black text-emerald-950 text-lg">৳{book.price}</td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEditBook(book)}
                            className="p-3 bg-white hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-xl border border-slate-100"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-3 bg-white hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-xl border border-slate-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Author Network Tab */}
        {activeTab === "authors" && (
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
              <div>
                <h3 className="text-2xl font-black text-emerald-950 mb-1 tracking-tight">Author Network</h3>
                <p className="text-sm font-bold text-slate-400">Collaborators: {authors.length} verified creators</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/30" />
                  <input 
                    type="text" 
                    placeholder="Search authors by name, ID or tier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-emerald-900/30 text-[10px] uppercase tracking-[0.3em] font-black">
                    <th className="px-10 py-8">Author Identity</th>
                    <th className="px-10 py-8">Service Tier</th>
                    <th className="px-10 py-8">Access Expiration</th>
                    <th className="px-10 py-8">Inventory</th>
                    <th className="px-10 py-8 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAuthors.map((author) => (
                    <tr key={author.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img src={author.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-xl group-hover:rotate-6 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-black text-emerald-950 text-lg mb-0.5">{author.name}</div>
                            <div className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.15em]">{author.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          author.subscriptionPlan === "প্ল্যান ৩" 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          <Star className={`w-3 h-3 ${author.subscriptionPlan === "প্ল্যান ৩" ? "fill-current" : ""}`} />
                          {author.subscriptionPlan}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-emerald-950">{author.subscriptionExpiry}</div>
                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Valid Term</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-950">{author.bookCount}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titles</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEditAuthor(author)}
                            className="p-3 bg-white hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-xl border border-slate-100"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAuthor(author.id)}
                            className="p-3 bg-white hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-xl border border-slate-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-10">
            <div className="flex items-center justify-between mb-2 px-4">
              <div>
                <h2 className="text-3xl font-black text-emerald-950 mb-2">পেমেন্ট ভেরিফিকেশন</h2>
                <p className="text-slate-400 font-bold text-sm">ম্যানুয়াল পেমেন্ট রিকোয়েস্টগুলো যাচাই করুন</p>
              </div>
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">অর্ডার ও তারিখ</th>
                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ব্যবহারকারী ও পেমেন্ট</th>
                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ট্রানজেকশন আইডি</th>
                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">স্ক্রিনশট</th>
                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">অবস্থা</th>
                    <th className="py-8 px-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-8 px-10">
                        <div className="flex flex-col">
                          <span className="font-black text-emerald-950 mb-1">
                            {order.order_type === 'subscription' ? `Subscription: ${order.plan_name}` : "Book Purchase"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-8 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-emerald-950">{order.user_name || "Unknown User"}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {order.user_email}
                          </span>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                            {order.payment_method} - ৳{order.amount}
                          </span>
                        </div>
                      </td>
                      <td className="py-8 px-6">
                        <code className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                          {order.transaction_id || "N/A"}
                        </code>
                      </td>
                      <td className="py-8 px-6">
                        {order.screenshot_url ? (
                          <button 
                            onClick={() => window.open(order.screenshot_url, '_blank')}
                            className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition-all"
                          >
                            <img src={order.screenshot_url} className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs italic">No Proof</span>
                        )}
                      </td>
                      <td className="py-8 px-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-8 px-10">
                        <div className="flex items-center justify-end gap-3">
                          {order.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => {
                                  if (confirm("পেমেন্টটি কি সঠিক? নিশ্চিত করলে ইউজারের সাবস্ক্রিপশন/বই সক্রিয় হবে।")) {
                                    approvePayment(order.id);
                                    showNotify("Payment approved successfully!");
                                  }
                                }}
                                className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-xl shadow-emerald-600/5"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm("পেমেন্টটি রিজেক্ট করতে চান?")) {
                                    rejectPayment(order.id);
                                    showNotify("Payment rejected");
                                  }
                                }}
                                className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-xl shadow-rose-600/5"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400 font-bold">
                        কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="mb-12">
              <h3 className="text-2xl font-black text-emerald-950 mb-1 tracking-tight">Site Appearance</h3>
              <p className="text-sm font-bold text-slate-400">Modify hero section, CTA text, and other site-wide information</p>
            </div>

            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest px-4 border-l-4 border-emerald-500">Hero Section</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Hero Title (Top Line)</label>
                    <input 
                      value={siteSettings.heroTitle} 
                      onChange={(e) => updateSiteSettings({ heroTitle: e.target.value })}
                      className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Hero Subtitle (Colored Line)</label>
                    <input 
                      value={siteSettings.heroSubtitle} 
                      onChange={(e) => updateSiteSettings({ heroSubtitle: e.target.value })}
                      className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Hero Description</label>
                    <textarea 
                      value={siteSettings.heroDescription} 
                      onChange={(e) => updateSiteSettings({ heroDescription: e.target.value })}
                      rows={3} 
                      className="w-full px-8 py-5 bg-slate-50 border-0 rounded-[2rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none resize-none" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest px-4 border-l-4 border-emerald-500">Call to Actions</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Primary CTA Text</label>
                    <input 
                      value={siteSettings.heroCtaText} 
                      onChange={(e) => updateSiteSettings({ heroCtaText: e.target.value })}
                      className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Secondary CTA Text</label>
                    <input 
                      value={siteSettings.heroSecondaryCtaText} 
                      onChange={(e) => updateSiteSettings({ heroSecondaryCtaText: e.target.value })}
                      className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-10 border-t border-slate-50">
                <div className="px-12 py-6 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black flex items-center gap-3 text-lg border border-emerald-100">
                  Auto-saved to Browser
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
              <div>
                <h3 className="text-4xl font-black text-emerald-950 mb-2 tracking-tight">Testimonial Management</h3>
                <p className="text-sm font-bold text-slate-400">Review and approve user feedback for the homepage</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-3xl">
                <div className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20">
                  {testimonials.length} Total
                </div>
                <div className="px-6 py-3 bg-white text-slate-500 rounded-2xl font-black text-sm shadow-sm">
                  {testimonials.filter(t => !t.is_approved).length} Pending
                </div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-12 px-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-50">
                    <th className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Info</th>
                    <th className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Testimonial Content</th>
                    <th className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rating</th>
                    <th className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="text-right py-8 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-all">
                      <td className="py-8 px-6">
                        <div className="flex items-center gap-4">
                          <img src={t.user_avatar} className="w-12 h-12 rounded-2xl object-cover shadow-xl group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="font-black text-emerald-950 text-lg">{t.user_name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-6 max-w-md">
                        <p className="text-slate-600 font-medium italic leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all cursor-pointer">
                          "{t.content}"
                        </p>
                      </td>
                      <td className="py-8 px-6">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </td>
                      <td className="py-8 px-6">
                        {t.is_approved ? (
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Approved</span>
                        ) : (
                          <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Pending</span>
                        )}
                      </td>
                      <td className="py-8 px-6">
                        <div className="flex items-center justify-end gap-3">
                          {!t.is_approved && (
                            <button 
                              onClick={async () => {
                                try {
                                  await approveTestimonial(t.id);
                                  showNotify("Testimonial approved!");
                                } catch (err: any) {
                                  console.error(err);
                                  showNotify(`Error: ${err.message || 'Failed to approve'}`, 'error');
                                }
                              }}
                              className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-xl shadow-emerald-600/5"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                            onClick={async () => {
                              if (confirm("Delete this testimonial?")) {
                                try {
                                  await deleteTestimonial(t.id);
                                  showNotify("Testimonial deleted");
                                } catch (err: any) {
                                  console.error(err);
                                  showNotify(`Error: ${err.message || 'Failed to delete'}`, 'error');
                                }
                              }
                            }}
                            className="p-3 bg-white hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-xl border border-slate-100"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {testimonials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <Quote className="w-8 h-8 text-slate-200" />
                          </div>
                          <p className="text-slate-400 font-bold">কোনো মতামত পাওয়া যায়নি</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      {(showAddModal || showEditBookModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
          <div 
            onClick={() => { setShowAddModal(false); setShowEditBookModal(false); }}
            className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
          ></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-80 bg-emerald-950 p-12 text-white flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                  <BookCopy className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-4 leading-tight">{showAddModal ? "Establish New Publication" : "Modify Content Meta"}</h3>
                <p className="text-emerald-100/50 font-medium">Ensure all bibliographic data is accurate and categorized correctly for optimal platform discovery.</p>
              </div>
            </div>

            <div className="flex-1 p-12 md:p-20 overflow-y-auto max-h-[90vh]">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const bookData = {
                    title: formData.get("title") as string,
                    author: formData.get("author") as string,
                    price: Number(formData.get("price")),
                    category: formData.get("category") as string,
                    status: (formData.get("status") as any) || "Published",
                    isFeatured: formData.get("isFeatured") === "on",
                    cover: (formData.get("cover") as string) || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
                    description: formData.get("desc") as string,
                  };
                  
                  if (showAddModal) {
                    addBook(bookData);
                    showNotify("New book published successfully");
                  } else if (selectedBook) {
                    updateBook(selectedBook.id, bookData);
                    showNotify("Publication updated");
                  }
                  setShowAddModal(false);
                  setShowEditBookModal(false);
                }}
                className="space-y-10"
              >
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Publication Title</label>
                    <input name="title" required defaultValue={selectedBook?.title} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" placeholder="Enter book title" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Author Assignment</label>
                    <input name="author" required defaultValue={selectedBook?.author} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" placeholder="Primary author" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Unit Price (৳)</label>
                    <input name="price" type="number" required defaultValue={selectedBook?.price} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" placeholder="Price in BDT" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Category</label>
                    <input name="category" required defaultValue={selectedBook?.category} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" placeholder="Fiction, Non-fiction etc" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Publication Status</label>
                    <select name="status" defaultValue={selectedBook?.status || "Published"} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none appearance-none">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Cover URL</label>
                    <input name="cover" defaultValue={selectedBook?.cover} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none" placeholder="Image URL" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Brief Summary / Description</label>
                  <textarea name="desc" defaultValue={selectedBook?.description} rows={4} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-[2.5rem] font-bold focus:ring-4 focus:ring-emerald-50 outline-none resize-none" placeholder="What is this book about?" />
                </div>

                <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                  <input 
                    type="checkbox" 
                    name="isFeatured" 
                    id="isFeatured" 
                    defaultChecked={selectedBook?.isFeatured} 
                    className="w-6 h-6 rounded-lg border-2 border-emerald-200 text-emerald-600 focus:ring-emerald-500" 
                  />
                  <label htmlFor="isFeatured" className="text-sm font-bold text-emerald-950 cursor-pointer">
                    Highlight as Featured Publication
                  </label>
                </div>
                
                <div className="flex gap-4 pt-10">
                  <button 
                    type="button" 
                    onClick={() => { setShowAddModal(false); setShowEditBookModal(false); }}
                    className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all text-lg">
                    Confirm & Sync Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Author Modal */}
      {showEditAuthorModal && selectedAuthor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
          <div 
            onClick={() => setShowEditAuthorModal(false)}
            className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
          ></div>
          <div className="relative w-full max-w-3xl bg-white rounded-[4rem] shadow-2xl overflow-hidden">
            <div className="p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 bg-emerald-50/50 border-b border-emerald-100">
              <div className="relative">
                <img src={selectedAuthor.avatar} className="w-32 h-32 rounded-[3rem] object-cover shadow-2xl border-4 border-white" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-emerald-50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-4xl font-black text-emerald-950 mb-2 tracking-tight">{selectedAuthor.name}</h3>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                    <Mail className="w-4 h-4" />
                    {selectedAuthor.email}
                  </span>
                </div>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateAuthor(selectedAuthor.id, {
                  subscriptionPlan: formData.get("plan") as string,
                  subscriptionExpiry: formData.get("expiry") as string,
                  bookCount: Number(formData.get("books")),
                });
                showNotify("Author privileges updated successfully");
                setShowEditAuthorModal(false);
              }}
              className="p-12 md:p-20 space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Membership Level</label>
                  <select name="plan" defaultValue={selectedAuthor.subscriptionPlan} className="w-full px-8 py-5 bg-slate-50 border-0 rounded-3xl font-bold focus:ring-4 focus:ring-emerald-50 outline-none appearance-none">
                    <option>প্ল্যান ১</option>
                    <option>প্ল্যান ২</option>
                    <option>প্ল্যান ৩</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-10">
                <button 
                  type="button" 
                  onClick={() => setShowEditAuthorModal(false)}
                  className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all text-lg">
                  Save Privileges
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Notification Modal */}
        {showNotifications && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md" onClick={() => setShowNotifications(false)}></div>
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-2xl font-black text-emerald-950">Notifications History</h3>
                  <p className="text-sm font-bold text-slate-400">System updates and user activity</p>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                      <Bell className="w-10 h-10" />
                    </div>
                    <p className="text-slate-400 font-bold">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div 
                      key={notif.id}
                      className={`p-6 rounded-[2rem] border transition-all ${
                        notif.is_read ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-emerald-100 shadow-lg shadow-emerald-600/5'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          notif.type === 'new_payment' ? 'bg-emerald-50 text-emerald-600' :
                          notif.type === 'new_book' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {notif.type === 'new_payment' ? <CreditCard className="w-5 h-5" /> : 
                           notif.type === 'new_book' ? <BookCopy className="w-5 h-5" /> : 
                           <Quote className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-emerald-950 mb-1">{notif.message}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
