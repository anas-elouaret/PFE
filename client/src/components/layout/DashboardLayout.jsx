import DashboardSidebar from "./DashboardSidebar";
import NotificationDropdown from "../notifications/NotificationDropdown";
import ToastContainer from "../ui/Toast";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <DashboardSidebar />
      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b-2 border-black bg-white">
          <div className="flex items-center justify-end gap-3 px-6 h-14">
            <Link to="/get-started"
              className="hidden sm:inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 transition-all">
              + New Project
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <NotificationDropdown />
          </div>
        </header>
        <main className="bg-white">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
