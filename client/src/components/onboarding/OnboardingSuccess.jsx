import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const circleVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, delay: 0.3, ease: "easeInOut" },
  },
};

export default function OnboardingSuccess() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center px-6 py-16"
    >
      {/* Animated checkmark */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border border-purple-400/30 flex items-center justify-center shadow-2xl shadow-purple-500/20"
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            className="absolute"
          >
            <motion.circle
              cx="30"
              cy="30"
              r="26"
              stroke="url(#success-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={circleVariants}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M20 30l7 7 13-13"
              stroke="url(#success-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkVariants}
              initial="hidden"
              animate="visible"
            />
            <defs>
              <linearGradient id="success-grad" x1="0" y1="0" x2="60" y2="60">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Glow rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.3, 1.6] }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.5, 1.8] }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none"
        />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-2xl font-bold text-white mb-2"
      >
        {t("onboarding.success.title")}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="text-zinc-400 text-sm max-w-sm"
      >
        {t("onboarding.success.subtitle")}
      </motion.p>
    </motion.div>
  );
}
