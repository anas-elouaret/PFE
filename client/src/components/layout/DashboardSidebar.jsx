import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FolderOpen, CreditCard, Settings, LogOut, ChevronLeft, Menu, Bell } from "lucide-react";

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
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.04]">
        {!collapsed && (
          <Link to="/" className="text-lg font-black tracking-tight">
            <span className="text-white">grow</span><span className="text-[#00AEEF]">stack</span><span className="text-[#00AEEF]">.</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="text-lg font-black text-[#00AEEF] mx-auto">g</Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-b border-white/[0.04]">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0095D4] flex items-center justify-center text-xs font-black text-[#000000] shrink-0 shadow-lg shadow-[#00AEEF]/20">
            {user?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || "Client"}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email || ""}</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                collapsed ? "justify-center" : ""
              } ${active ? "text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"}`}>
              {active && (
                <motion.div layoutId="dash-nav-glow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00AEEF]/20 via-[#33C8FF]/10 to-transparent border border-[#00AEEF]/15 shadow-lg shadow-[#00AEEF]/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <item.icon className="w-4.5 h-4.5 relative z-10" />
              {!collapsed && <span className="relative z-10">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/[0.04]">
        <button onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all ${collapsed ? "justify-center" : ""}`}>
          <LogOut className="w-4.5 h-4.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-400">
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-r border-white/[0.06] overflow-hidden">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 h-full w-64 bg-[#0A0A0F]/95 backdrop-blur-2xl border-r border-white/[0.06] overflow-y-auto">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all lg:hidden">
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
