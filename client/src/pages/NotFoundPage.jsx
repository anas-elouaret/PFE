import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-8xl font-black mb-4" style={{ color: "var(--theme-primary)" }}>404</h1>
        <h2 className="text-2xl font-bold mb-4">{t("common.pageNotFound") || "Page not found"}</h2>
        <p className="text-lg mb-8" style={{ color: "var(--theme-muted)" }}>
          {t("common.pageNotFoundDesc") || "The page you're looking for doesn't exist or has been moved."}
        </p>
        <Link to="/">
          <Button size="lg">{t("common.backToHome") || "Back to Home"}</Button>
        </Link>
      </motion.div>
    </div>
  );
}