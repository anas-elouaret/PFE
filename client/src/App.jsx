import { lazy, Suspense } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/client/ProtectedRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import Cart from "./components/cart/Cart";
import FlyingItem from "./components/cart/FlyingItem";
import PageTransition from "./components/common/PageTransition";
import ToastContainer from "./components/ui/Toast";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import GlowingTabsNavbar from "./components/layout/GlowingTabsNavbar";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";

import { CartProvider, useCart } from "./context/CartContext";

const HomePage = lazy(() => import("./pages/home/HomePage"));
const PortfolioPage = lazy(() => import("./pages/portfolio/PortfolioPage"));
const ProjectDetailPage = lazy(() => import("./pages/portfolio/ProjectDetailPage"));
const PackagesPage = lazy(() => import("./pages/pricing/PackagesPage"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const CatalogPage = lazy(() => import("./pages/catalog/CatalogPage"));
const ServicesPage = lazy(() => import("./pages/services/ServicesPage"));
const SocialMediaServicesPage = lazy(() => import("./pages/services/SocialMediaServicesPage"));
const MarketingStrategyPage = lazy(() => import("./pages/services/MarketingStrategyPage"));
const UgcServicesPage = lazy(() => import("./pages/services/UgcServicesPage"));
const PhotographyServicesPage = lazy(() => import("./pages/services/PhotographyServicesPage"));
const ServicesHubPage = lazy(() => import("./pages/services/ServicesHubPage"));
const ShowreelPage = lazy(() => import("./pages/showreel/ShowreelPage"));
const ServicesSection = lazy(() => import("./components/services/ServicesSection"));
const GetStartedPage = lazy(() => import("./pages/getStarted/GetStartedPage"));

const LoginPage = lazy(() => import("./pages/client/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/client/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/client/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/client/VerifyEmailPage"));
const DashboardOverviewPage = lazy(() => import("./pages/dashboard/DashboardOverviewPage"));
const DashboardProjectsPage = lazy(() => import("./pages/dashboard/DashboardProjectsPage"));
const DashboardBillingPage = lazy(() => import("./pages/dashboard/DashboardBillingPage"));
const DashboardSettingsPage = lazy(() => import("./pages/dashboard/DashboardSettingsPage"));
const ProjectDetailView = lazy(() => import("./pages/dashboard/ProjectDetailView"));
const CreatorDashboardPage = lazy(() => import("./pages/dashboard/CreatorDashboardPage"));

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminProjectsPage = lazy(() => import("./pages/admin/AdminProjectsPage"));
const AdminClientsPage = lazy(() => import("./pages/admin/AdminClientsPage"));
const AdminReviewsPage = lazy(() => import("./pages/admin/AdminReviewsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent" style={{ color: "var(--theme-text)" }}>
    
      <GlowingTabsNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function PageWrapper({ children }) {
  return <PageTransition><PublicLayout>{children}</PublicLayout></PageTransition>;
}

function AppContent() {
  const location = useLocation();
  const { flyingItems, removeFlyingItem, flyTargetRect, setActionTargetPulse, setShakeCart } = useCart();

  return (
    <>
    
      <Cart />
    
        {flyingItems.map((item) => (
          <FlyingItem
            key={item.id}
            item={item}
            targetRect={flyTargetRect}
            onComplete={() => {
              removeFlyingItem(item.id);
              setActionTargetPulse(true);
            }}
            setShakeCart={setShakeCart}
          />
        ))}
    
      <ToastContainer />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#00AEEF]/30 border-t-[#00AEEF] rounded-full animate-spin" /></div>}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesHubPage /></PageWrapper>} />
          <Route path="/services/social-media" element={<PageWrapper><SocialMediaServicesPage /></PageWrapper>} />
          <Route path="/services/marketing-strategy" element={<PageWrapper><MarketingStrategyPage /></PageWrapper>} />
          <Route path="/services/ugc" element={<PageWrapper><UgcServicesPage /></PageWrapper>} />
          <Route path="/services/photography" element={<PageWrapper><PhotographyServicesPage /></PageWrapper>} />
          <Route path="/start-project" element={<Navigate to="/get-started" replace />} />
          <Route path="/get-started" element={<PageWrapper><GetStartedPage /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><PortfolioPage /></PageWrapper>} />
          <Route path="/portfolio/:id" element={<PageWrapper><ProjectDetailPage /></PageWrapper>} />
          <Route path="/packages" element={<PageWrapper><PackagesPage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="/auth" element={<PageWrapper><AuthPage /></PageWrapper>} />
          <Route path="/catalog" element={<PageWrapper><CatalogPage /></PageWrapper>} />
          <Route path="/dashboard/creator" element={<PageWrapper><CreatorDashboardPage /></PageWrapper>} />

          <Route path="/showreel" element={<PageTransition><ShowreelPage /></PageTransition>} />
          <Route path="/services-showcase" element={<ServicesSection />} />

          {/* Auth routes — no public layout */}
          <Route path="/client/login" element={<LoginPage />} />
          <Route path="/client/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/client/reset-password" element={<ResetPasswordPage />} />
          <Route path="/client/verify-email" element={<VerifyEmailPage />} />

          {/* Client Dashboard routes — protected with sidebar layout */}
          <Route path="/client/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardOverviewPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/client/dashboard/projects" element={<ProtectedRoute><DashboardLayout><DashboardProjectsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/client/dashboard/billing" element={<ProtectedRoute><DashboardLayout><DashboardBillingPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/client/dashboard/settings" element={<ProtectedRoute><DashboardLayout><DashboardSettingsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/client/dashboard/:id" element={<ProtectedRoute><DashboardLayout><ProjectDetailView /></DashboardLayout></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/projects" element={<ProtectedAdminRoute><AdminLayout><AdminProjectsPage /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/clients" element={<ProtectedAdminRoute><AdminLayout><AdminClientsPage /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/reviews" element={<ProtectedAdminRoute><AdminLayout><AdminReviewsPage /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminLayout><AdminAnalyticsPage /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminLayout><DashboardSettingsPage /></AdminLayout></ProtectedAdminRoute>} />

          {/* Catch-all 404 */}
          <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <NotificationProvider>
            <ErrorBoundary><CartProvider><AppContent /></CartProvider></ErrorBoundary>
          </NotificationProvider>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
