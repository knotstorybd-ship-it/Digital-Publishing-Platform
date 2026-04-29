import { BookOpen, Mail, Phone, Facebook, Youtube } from "lucide-react";
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
              বাংলাদেশের #১ ডিজিটাল বুক প্ল্যাটফর্ম
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
                <Link to="/writer" className="hover:text-secondary transition-colors">
                  লেখক হন
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  যোগাযোগ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">বিভাগসমূহ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  উপন্যাস
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  কবিতা
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  ইতিহাস
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  শিশু সাহিত্য
                </a>
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
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/80">
          © 2026 Digital Prokashoni. All rights reserved. • <Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
