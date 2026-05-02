import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { Lock, CheckCircle2, ChevronRight, Eye, EyeOff } from "lucide-react";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (Supabase handles the hash fragment automatically)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("রিসেট লিঙ্কটি সঠিক নয় অথবা মেয়াদ শেষ হয়ে গেছে।");
      }
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err: any) {
      setError(err.message || "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 selection:bg-emerald-100 font-inter">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-10 shadow-2xl border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-emerald-950 mb-4 tracking-tight">সফল হয়েছে!</h2>
            <p className="text-slate-600 font-medium">আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। আপনাকে হোমপেজে নিয়ে যাওয়া হচ্ছে...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-emerald-950 mb-2 tracking-tight">নতুন পাসওয়ার্ড</h2>
              <p className="text-slate-500 font-medium italic">Digital Prokashoni</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-950 ml-2 uppercase tracking-widest opacity-60">নতুন পাসওয়ার্ড</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-emerald-100 transition-all font-bold pr-16"
                    placeholder="পাসওয়ার্ড দিন"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-950 ml-2 uppercase tracking-widest opacity-60">নিশ্চিত করুন</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-emerald-100 transition-all font-bold"
                  placeholder="আবারও পাসওয়ার্ড দিন"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-rose-500 text-sm font-bold text-center">{error}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-950 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-950/20 hover:bg-black transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
