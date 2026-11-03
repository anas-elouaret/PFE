import AdminSidebar from "./AdminSidebar";
import AmbientWaves from "../ui/AmbientWaves";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      <AmbientWaves intensity="low" />
      <AdminSidebar />
      <div className="lg:ps-60">
        <main className="p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
