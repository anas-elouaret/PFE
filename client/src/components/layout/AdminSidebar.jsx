import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, FolderKanban, Users, Settings, LogOut, Menu, ChevronLeft, LayoutDashboard, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Clients", path: "/admin/clients", icon: Users },
  { label: "Reviews", path: "/admin/reviews", icon: MessageSquare },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const sidebar = (
    <div className={`flex flex-col h-full ${collapsed ? "w-16" : "w-60"} transition-all duration-300`}>
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.04]">
        {!collapsed ? (
          <Link to="/admin" className="text-lg font-black tracking-tight">
            <span className="text-white">admin</span><span className="text-[#00AEEF]">.</span>
          </Link>
        ) : (
          <span className="text-lg font-black text-[#00AEEF] mx-auto">A</span>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${collapsed ? "justify-center" : ""} ${active ? "text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"}`}>
              {active && (
                <motion.div layoutId="admin-nav-glow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00AEEF]/20 via-[#0095D4]/10 to-transparent border border-[#00AEEF]/15 shadow-lg shadow-[#00AEEF]/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <item.icon className="w-4.5 h-4.5 relative z-10" />
              {!collapsed && <span className="relative z-10">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

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
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-400">
        <Menu className="w-5 h-5" />
      </button>
      <aside className="hidden lg:block fixed top-0 left-0 h-full z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-r border-white/[0.06] overflow-hidden">
        {sidebar}
      </aside>
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
