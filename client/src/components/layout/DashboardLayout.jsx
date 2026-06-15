import DashboardSidebar from "./DashboardSidebar";
import NotificationDropdown from "../notifications/NotificationDropdown";
import ToastContainer from "../ui/Toast";
import AmbientWaves from "../ui/AmbientWaves";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      <AmbientWaves intensity="low" />
      <DashboardSidebar />
      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ borderColor: "var(--theme-border-light)", background: "var(--theme-header-bg)" }}>
          <div className="flex items-center justify-end gap-3 px-6 h-14">
            <Link to="/start-project"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#00AEEF] px-4 py-2 text-xs font-bold text-[#000000] shadow-lg shadow-[#00AEEF]/20 hover:bg-[#0095D4] transition-all">
              + New Project
            </Link>
            <NotificationDropdown />
          </div>
        </header>
        <main>{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
