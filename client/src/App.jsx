import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ProjectProvider } from "./context/ProjectContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/client/ProtectedRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import BackgroundScene from "./components/common/BackgroundScene";
import Cart from "./components/cart/Cart";
import FlyingItem from "./components/cart/FlyingItem";
import PageTransition from "./components/common/PageTransition";
import ToastContainer from "./components/ui/Toast";
import AmbientWaves from "./components/ui/AmbientWaves";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import GlowingTabsNavbar from "./components/layout/GlowingTabsNavbar";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";

import HomePage from "./pages/home/HomePage";
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import ProjectDetailPage from "./pages/portfolio/ProjectDetailPage";
import PackagesPage from "./pages/pricing/PackagesPage";
import ContactPage from "./pages/contact/ContactPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/auth/AuthPage";
import CatalogPage from "./pages/catalog/CatalogPage";
import ServicesPage from "./pages/services/ServicesPage";
import SocialMediaServicesPage from "./pages/services/SocialMediaServicesPage";
import MarketingStrategyPage from "./pages/services/MarketingStrategyPage";
import UgcServicesPage from "./pages/services/UgcServicesPage";
import PhotographyServicesPage from "./pages/services/PhotographyServicesPage";
import ServicesHubPage from "./pages/services/ServicesHubPage";
import ShowreelPage from "./pages/showreel/ShowreelPage";
import ServicesSection from "./components/services/ServicesSection";
import GetStartedPage from "./pages/getStarted/GetStartedPage";

import LoginPage from "./pages/client/LoginPage";
import ForgotPasswordPage from "./pages/client/ForgotPasswordPage";
import ResetPasswordPage from "./pages/client/ResetPasswordPage";
import VerifyEmailPage from "./pages/client/VerifyEmailPage";
import DashboardOverviewPage from "./pages/dashboard/DashboardOverviewPage";
import DashboardProjectsPage from "./pages/dashboard/DashboardProjectsPage";
import DashboardBillingPage from "./pages/dashboard/DashboardBillingPage";
import DashboardSettingsPage from "./pages/dashboard/DashboardSettingsPage";
import ProjectDetailView from "./pages/dashboard/ProjectDetailView";
import CreatorDashboardPage from "./pages/dashboard/CreatorDashboardPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

import { useCart } from "./context/CartContext";

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
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesHubPage /></PageWrapper>} />
          <Route path="/services/social-media" element={<PageWrapper><SocialMediaServicesPage /></PageWrapper>} />
          <Route path="/services/marketing-strategy" element={<PageWrapper><MarketingStrategyPage /></PageWrapper>} />
          <Route path="/services/ugc" element={<PageWrapper><UgcServicesPage /></PageWrapper>} />
          <Route path="/services/photography" element={<PageWrapper><PhotographyServicesPage /></PageWrapper>} />
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
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <ProjectProvider>
              <NotificationProvider>
                <ErrorBoundary><AppContent /></ErrorBoundary>
              </NotificationProvider>
            </ProjectProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
