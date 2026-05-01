import { Mail, Phone } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo isDark={true} />
            </div>
            <p className="text-sm text-white/80">
              বাংলা লেখক ও পাঠকদের জন্য আধুনিক ডিজিটাল প্রকাশনা প্ল্যাটফর্ম
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="hover:text-secondary transition-colors">
                  সব বই
                </Link>
              </li>
              <li>
                <Link to="/join-writer" className="hover:text-secondary transition-colors">
                  লেখক হন
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-secondary transition-colors">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">বিভাগসমূহ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse?category=উপন্যাস" className="hover:text-secondary transition-colors">
                  উপন্যাস
                </Link>
              </li>
              <li>
                <Link to="/browse?category=কবিতা" className="hover:text-secondary transition-colors">
                  কবিতা
                </Link>
              </li>
              <li>
                <Link to="/browse?category=ইতিহাস" className="hover:text-secondary transition-colors">
                  ইতিহাস
                </Link>
              </li>
              <li>
                <Link to="/browse?category=শিশু সাহিত্য" className="hover:text-secondary transition-colors">
                  শিশু সাহিত্য
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">যোগাযোগ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@digitalprokashoni.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +8801868519685
              </li>
            </ul>
            <div className="mt-4 text-xs text-white/60 font-medium">
              সোশ্যাল লিংক শীঘ্রই যুক্ত হবে
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold text-white/70">
          <Link to="/support" className="hover:text-white">সাপোর্ট</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/refund-policy" className="hover:text-white">Refund Policy</Link>
          <Link to="/copyright-policy" className="hover:text-white">Copyright Policy</Link>
          <Link to="/writer-agreement" className="hover:text-white">Writer Agreement</Link>
          <Link to="/publishing-policy" className="hover:text-white">প্রকাশনা নীতিমালা</Link>
          <Link to="/payment-terms" className="hover:text-white">Payment Terms</Link>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/80">
          © {new Date().getFullYear()} Digital Prokashoni. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
