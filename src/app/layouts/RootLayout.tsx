import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export function RootLayout() {
  const location = useLocation();
  const isWriterPath = location.pathname === "/writer" || location.pathname.startsWith("/writer/");

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Premium Geometric Grid Texture Overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0l40 40M40 0L0 40M20 0v40M0 20h40' stroke='%23059669' stroke-width='0.5' stroke-opacity='0.1' fill='none'/%3E%3C/svg%3E")`
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
