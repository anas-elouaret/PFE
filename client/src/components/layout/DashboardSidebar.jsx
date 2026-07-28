import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FolderOpen, CreditCard, Settings, LogOut, ChevronLeft, Menu } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", path: "/client/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/client/dashboard/projects", icon: FolderOpen },
  { label: "Billing", path: "/client/dashboard/billing", icon: CreditCard },
  { label: "Settings", path: "/client/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/client/dashboard") return location.pathname === "/client/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  const sidebar = (
    <div className={`flex flex-col h-full ${collapsed ? "w-16" : "w-60"} transition-all duration-300`}>
      {/* Logo */}
      <div className="flex justify-center items-center p-4 border-b-2 border-black">
        {!collapsed && (
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="Growstack" className="w-12 h-auto object-contain" />
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="Growstack" className="w-10 h-auto object-contain" />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 transition-all absolute right-2 top-4">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-b-2 border-black">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-orange-500 flex items-center justify-center text-xs font-black text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Client"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || ""}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-all ${
                collapsed ? "justify-center" : ""
              } ${active ? "text-orange-500 bg-orange-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
              <item.icon className="w-4.5 h-4.5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t-2 border-black">
        <button onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all ${collapsed ? "justify-center" : ""}`}>
          <LogOut className="w-4.5 h-4.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-20 left-4 z-50 w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-50 transition-all">
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full z-40 bg-white border-r-2 border-black overflow-hidden">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden">
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 h-full w-64 bg-white border-r-2 border-black overflow-y-auto">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-slate-100 border-2 border-black flex items-center justify-center text-slate-400 hover:text-black transition-all lg:hidden">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
