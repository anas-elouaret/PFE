import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Rocket,
  Palette,
  BarChart3,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

const LOGOS = [
  { name: "TechCorp", icon: Building2 },
  { name: "Globex", icon: Globe },
  { name: "RocketLab", icon: Rocket },
  { name: "Creative", icon: Palette },
  { name: "DataPulse", icon: BarChart3 },
  { name: "NovaAI", icon: Sparkles },
  { name: "SecureIT", icon: Shield },
  { name: "FastUp", icon: Zap },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ClientTrustSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            {t("client_trust_title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {LOGOS.map((client) => {
            const Icon = client.icon;
            return (
              <motion.div key={client.name} variants={itemVariants}>
                <div className="group aspect-square border-2 border-black rounded-none flex items-center justify-center bg-white p-6 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Icon
                    size={48}
                    strokeWidth={1.5}
                    className="text-slate-400 grayscale transition-all duration-300 group-hover:text-indigo-600 group-hover:grayscale-0"
                  />
                  <span className="sr-only">{client.name}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
