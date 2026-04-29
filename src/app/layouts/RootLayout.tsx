import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export function RootLayout() {
  const location = useLocation();
  const isWriterPath = location.pathname.startsWith("/writer");

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Premium Noise Texture Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      ></div>
      <ScrollToTop />
      {!isWriterPath && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isWriterPath && <Footer />}
    </div>
  );
}
