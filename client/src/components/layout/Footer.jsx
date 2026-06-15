import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowRight, LayoutGrid } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/ste_2m/";

const socialLinks = [
  { label: "Instagram", href: INSTAGRAM_URL, hoverColor: "#E1306C" },
  { label: "LinkedIn", href: "#", hoverColor: "#0A66C2" },
  { label: "TikTok", href: "#", hoverColor: "#000000" },
  { label: "Dribbble", href: "#", hoverColor: "#EA4C89" },
];

const companyLinks = [
  { labelKey: "home", path: "/" },
  { labelKey: "about", path: "/about" },
  { labelKey: "contact", path: "/contact" },
];

const serviceLinks = [
  { labelKey: "services.ugc", path: "/services/ugc" },
  { labelKey: "services.graphicDesign", path: "/services" },
  { labelKey: "services.photography", path: "/services/photography" },
  { labelKey: "services.socialMedia", path: "/services/social-media" },
  { labelKey: "services.marketingStrategy", path: "/services/marketing-strategy" },
];

const resourceLinks = [
  { label: "Portfolio", path: "/portfolio" },
  { label: "Packages", path: "/packages" },
  { label: "Catalog", path: "/catalog" },
];

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        background: "var(--theme-bg)",
        borderTop: "1px solid var(--border-color, rgba(0,0,0,0.06))",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 py-16">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,174,239,0.1)", border: "1px solid rgba(0,174,239,0.25)" }}>
                <LayoutGrid size={16} strokeWidth={1.75} style={{ color: "#00AEEF" }} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span style={{ color: "var(--theme-text)" }}>grow</span>
                <span style={{ color: "#00AEEF" }}>stack.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--theme-text-muted)" }}>
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ color: "var(--theme-text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = s.hoverColor; e.currentTarget.style.background = `${s.hoverColor}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--theme-text-muted)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {s.label === "Instagram" ? <InstagramIcon size={16} /> : (
                    <span className="text-[10px] font-bold uppercase tracking-wider">{s.label.slice(0, 2)}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--theme-text)" }}>Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors duration-200 hover:text-[#4F46E5]"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--theme-text)" }}>Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors duration-200 hover:text-[#4F46E5]"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--theme-text)" }}>Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors duration-200 hover:text-[#4F46E5]"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--theme-text)" }}>Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm transition-colors duration-200 hover:text-[#4F46E5]"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm transition-colors duration-200 hover:text-[#4F46E5]"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 rounded-lg bg-[#00AEEF] hover:bg-[#0095D4] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.97]"
              >
                {t("footer.startProject")}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 py-6"
          style={{ borderTop: "1px solid var(--border-color, rgba(0,0,0,0.06))" }}
        >
          <p className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-xs transition-colors duration-200 hover:text-[#4F46E5]" style={{ color: "var(--theme-text-muted)" }}>
              {t("footer.privacy")}
            </Link>
            <Link to="#" className="text-xs transition-colors duration-200 hover:text-[#4F46E5]" style={{ color: "var(--theme-text-muted)" }}>
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
