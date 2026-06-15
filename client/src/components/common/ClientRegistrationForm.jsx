import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, Send, CheckCircle2 } from "lucide-react";
import apiClient from "../../api/client";

export default function ClientRegistrationForm({ onSubmit, onClose }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    phone: "",
    niche: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const niches = [
    "gym",
    "restaurant",
    "ecommerce",
    "personal brand",
    "technology",
    "healthcare",
    "education",
    "finance",
    "real estate",
    "other",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = t("validation.required");
    if (!formData.lastName.trim()) newErrors.lastName = t("validation.required");
    if (!formData.city.trim()) newErrors.city = t("validation.required");
    if (!formData.email.trim()) newErrors.email = t("validation.required");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("validation.email");
    if (!formData.phone.trim()) newErrors.phone = t("validation.required");
    if (!formData.niche) newErrors.niche = t("validation.required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await apiClient.post("/contact", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        subject: "Client Registration - " + formData.niche,
        message: `City: ${formData.city}\nNiche: ${formData.niche}`,
      });

      setSubmitted(true);
      setTimeout(() => {
        onSubmit?.(formData);
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Form */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative bg-gradient-to-br from-gray-900 to-black border border-purple-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Registration received!</h2>
            <p className="text-gray-400 text-sm">We'll get back to you shortly.</p>
          </motion.div>
        ) : (
        <>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{t("navbar.join")}</h2>
          <p className="text-gray-400 text-sm">{t("getStarted.subtitle")}</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* First Name */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("contact.name")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <motion.input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.2)" }}
                transition={{ duration: 0.2 }}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.firstName ? "border-red-500" : "border-gray-600"
                }`}
                placeholder={t("contact.namePlaceholder")}
              />
            </div>
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </motion.div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("contact.name")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.lastName ? "border-red-500" : "border-gray-600"
                }`}
                placeholder={t("contact.namePlaceholder")}
              />
            </div>
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("contact.location")}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.city ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Your city"
              />
            </div>
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("contact.emailLabel")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-600"
                }`}
                placeholder={t("contact.emailPlaceholder")}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("contact.phone")}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.phone ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="+212 6XX XXX XXX"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Niche */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("catalog.niche")}
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <select
                value={formData.niche}
                onChange={(e) => handleChange("niche", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.niche ? "border-red-500" : "border-gray-600"
                }`}
              >
                <option value="">{t("catalog.filters")}</option>
                {niches.map(niche => (
                  <option key={niche} value={niche} className="bg-gray-800">
                    {niche.charAt(0).toUpperCase() + niche.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {errors.niche && <p className="text-red-400 text-xs mt-1">{errors.niche}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            variants={fieldVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t("common.submit")}
              </>
            )}
          </motion.button>
        </motion.form>

        </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}