import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, AlertCircle, Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import OnboardingSuccess from "./OnboardingSuccess";
import apiClient from "../../api/client";

const FORM_STORAGE_KEY = "sw_onboarding_form";

function loadForm() {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

const projectTypes = [
  "Website",
  "Mobile App",
  "E-commerce",
  "Dashboard",
  "Other",
];

const contactMethods = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "phone", label: "Phone Call" },
];

const steps = [
  { num: 1, label: "Client" },
  { num: 2, label: "Project" },
  { num: 3, label: "Services" },
  { num: 4, label: "Preferences" },
  { num: 5, label: "Summary" },
];

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+$/.test(v);
}

function validateForm(data) {
  const errors = {};
  if (!data.firstName?.trim()) errors.firstName = t("validation.required");
  if (!data.lastName?.trim()) errors.lastName = t("validation.required");
  if (!data.email?.trim()) errors.email = t("validation.required");
  else if (!validateEmail(data.email)) errors.email = t("validation.email");
  if (!data.projectName?.trim()) errors.projectName = t("validation.required");
  if (!data.projectType?.trim()) errors.projectType = t("validation.required");
  return errors;
}

function validateStep(step, data) {
  const errors = {};
  if (step === 1) {
    if (!data.firstName?.trim()) errors.firstName = t("validation.required");
    if (!data.lastName?.trim()) errors.lastName = t("validation.required");
    if (!data.email?.trim()) errors.email = t("validation.required");
    else if (!validateEmail(data.email)) errors.email = t("validation.email");
  }
  if (step === 2) {
    if (!data.projectName?.trim()) errors.projectName = t("validation.required");
    if (!data.projectType?.trim()) errors.projectType = t("validation.required");
  }
  return errors;
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 260 : -260, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -260 : 260, opacity: 0 }),
};

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-400 tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-red-400 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-purple-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_12px_rgba(139,92,246,0.08)]"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-purple-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_12px_rgba(139,92,246,0.08)] resize-none"
    />
  );
}

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

export default function OnboardingModal({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    getTotalPrice,
  } = useCart();

  const [form, setForm] = useState(() => ({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectName: "",
    projectType: "",
    projectDescription: "",
    contactMethod: "email",
    budget: "",
    ideas: "",
    extraRequirements: "",
    ...loadForm(),
  }));

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setSubmitting(false);
      setErrors({});
      setCurrentStep(1);
      setDirection(1);
    }
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (prev[key]) {
        const { [key]: _, ...cleaned } = prev;
        return cleaned;
      }
      return prev;
    });
  }, []);

  const goNext = useCallback(() => {
    const stepErrors = validateStep(currentStep, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 5));
    setErrors({});
  }, [currentStep, form]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
    setErrors({});
  }, []);

  const totalPrice = useMemo(() => getTotalPrice(), [cartItems, getTotalPrice]);
  const itemCount = cartItems.length;

  const handleSubmit = useCallback(async () => {
    const allErrors = validateForm(form);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setSubmitting(true);

    const payload = {
      client: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      project: {
        name: form.projectName.trim(),
        type: form.projectType,
        description: form.projectDescription.trim(),
      },
      services: cartItems.map((item) => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        basePrice: item.basePrice || 0,
        finalPrice: item.finalPrice || item.price || 0,
        quantity: item.quantity ?? 1,
        options: item.selectedChoicesData || item.selectedOptions || [],
        category: item.category || "",
      })),
      contactPreference: form.contactMethod,
      notes: {
        budget: form.budget.trim(),
        ideas: form.ideas.trim(),
        extra: form.extraRequirements.trim(),
      },
      totalPrice,
    };

    try {
      await apiClient.post("/orders", payload);
    } catch {}

    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onClose();
      navigate("/client/dashboard");
    }, 2800);
  }, [form, cartItems, totalPrice, onClose, navigate]);

  const handleBrowseServices = useCallback(() => {
    onClose();
    navigate("/services");
  }, [onClose, navigate]);

  const isLastStep = currentStep === 5;
  const isFirstStep = currentStep === 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden bg-black/70 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
            className="relative w-full max-w-2xl mx-auto mt-6 mb-6 flex flex-col max-h-[calc(100vh-48px)]"
          >
            <div className="relative flex flex-col rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-purple-500/10 overflow-hidden flex-1">
              {/* Gradient border */}
              <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1), rgba(236,72,153,0.1), rgba(139,92,246,0.15))",
                    backgroundSize: "200% 200%",
                  }}
                />
              </div>

              {/* Header */}
              <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <motion.h2
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-bold text-white tracking-tight"
                >
                  {submitted ? "" : t("navbar.startProject")}
                </motion.h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors"
                  aria-label={t("common.close")}
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Progress bar */}
              {!submitted && (
                <div className="relative shrink-0 px-6 pt-5 pb-3 border-b border-white/[0.04]">
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    {steps.map((s, i) => {
                      const active = s.num === currentStep;
                      const completed = s.num < currentStep;
                      return (
                        <div key={s.num} className="flex items-center">
                          <button
                            onClick={() => {
                              if (completed) {
                                setDirection(s.num > currentStep ? 1 : -1);
                                setCurrentStep(s.num);
                                setErrors({});
                              }
                            }}
                            disabled={!completed}
                            className="relative flex flex-col items-center gap-1.5 group"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                                active
                                  ? "bg-gradient-to-br from-purple-600 to-cyan-600 border-purple-400/40 text-white shadow-lg shadow-purple-500/20 scale-110"
                                  : completed
                                    ? "bg-purple-500/15 border-purple-400/25 text-purple-300 cursor-pointer hover:bg-purple-500/25"
                                    : "bg-white/[0.03] border-white/[0.08] text-zinc-600"
                              }`}
                            >
                              {completed ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                s.num
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                                active
                                  ? "text-purple-300"
                                  : completed
                                    ? "text-purple-400/70"
                                    : "text-zinc-600"
                              }`}
                            >
                              {s.label}
                            </span>
                          </button>

                          {/* Connector */}
                          {i < steps.length - 1 && (
                            <div
                              className={`w-8 sm:w-12 h-px mx-2 transition-colors duration-500 ${
                                s.num < currentStep
                                  ? "bg-purple-500/40"
                                  : "bg-white/[0.06]"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step content */}
              {submitted ? (
                <div className="flex-1 flex items-center justify-center">
                  <OnboardingSuccess />
                </div>
              ) : (
                <>
                  <div className="relative flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        {/* Step 1: Client Info */}
                        {currentStep === 1 && (
                          <div className="space-y-4">
                            <div className="mb-5">
                              <h3 className="text-base font-semibold text-white">
                                Personal Information
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                Tell us about yourself
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="First Name *" error={errors.firstName}>
                                <Input
                                  value={form.firstName}
                                  onChange={(e) => update("firstName", e.target.value)}
                                  placeholder={t("contact.namePlaceholder")}
                                />
                              </Field>
                              <Field label="Last Name *" error={errors.lastName}>
                                <Input
                                  value={form.lastName}
                                  onChange={(e) => update("lastName", e.target.value)}
                                  placeholder={t("contact.namePlaceholder")}
                                />
                              </Field>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Email *" error={errors.email}>
                                <Input
                                  type="email"
                                  value={form.email}
                                  onChange={(e) => update("email", e.target.value)}
                                  placeholder={t("contact.emailPlaceholder")}
                                />
                              </Field>
                              <Field label="Phone / WhatsApp">
                                <Input
                                  type="tel"
                                  value={form.phone}
                                  onChange={(e) => update("phone", e.target.value)}
                                  placeholder={t("contact.phone")}
                                />
                              </Field>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Project Info */}
                        {currentStep === 2 && (
                          <div className="space-y-4">
                            <div className="mb-5">
                              <h3 className="text-base font-semibold text-white">
                                Project Details
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                What are you building?
                              </p>
                            </div>
                            <Field label="Project Name *" error={errors.projectName}>
                              <Input
                                value={form.projectName}
                                onChange={(e) => update("projectName", e.target.value)}
                                  placeholder={t("contact.subjectPlaceholder")}
                              />
                            </Field>
                            <Field label="Project Type *" error={errors.projectType}>
                              <div className="flex flex-wrap gap-2">
                                {projectTypes.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => update("projectType", type)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                                      form.projectType === type
                                        ? "bg-purple-500/15 border-purple-400/30 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                                        : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-zinc-300 hover:border-white/[0.12]"
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </Field>
                            <Field label="Project Description">
                              <TextArea
                                value={form.projectDescription}
                                onChange={(e) => update("projectDescription", e.target.value)}
                                  placeholder={t("getStarted.briefPlaceholder")}
                                rows={3}
                              />
                            </Field>
                          </div>
                        )}

                        {/* Step 3: Cart Review */}
                        {currentStep === 3 && (
                          <div className="space-y-4">
                            <div className="mb-5">
                              <h3 className="text-base font-semibold text-white">
                                Selected Services
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                Review and adjust your service selections
                              </p>
                            </div>
                            {itemCount === 0 ? (
                              <div className="text-center py-10 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                                  <p className="text-sm text-zinc-500 mb-4">
                                  {t("cart.empty")}
                                </p>
                                <button
                                  onClick={handleBrowseServices}
                                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                  {t("cart.browseServices")}
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                {cartItems.map((item) => {
                                  const unitPrice = item.finalPrice || item.price || 0;
                                  const lineTotal = unitPrice * (item.quantity ?? 1);
                                  return (
                                    <motion.div
                                      key={item.cartItemId}
                                      initial={{ opacity: 0, x: -12 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] p-3.5"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">
                                          {item.serviceName}
                                        </div>
                                        <div className="text-[11px] text-zinc-500 mt-0.5">
                                          {formatPrice(unitPrice)} MAD / unit
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() =>
                                            updateCartItemQuantity(
                                              item.cartItemId,
                                              (item.quantity ?? 1) - 1
                                            )
                                          }
                                          disabled={(item.quantity ?? 1) <= 1}
                                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium text-white tabular-nums">
                                          {item.quantity ?? 1}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateCartItemQuantity(
                                              item.cartItemId,
                                              (item.quantity ?? 1) + 1
                                            )
                                          }
                                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="text-sm font-semibold text-cyan-400 w-20 text-right tabular-nums">
                                        {formatPrice(lineTotal)} MAD
                                      </div>
                                      <button
                                        onClick={() => removeFromCart(item.cartItemId)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Step 4: Preferences & Notes */}
                        {currentStep === 4 && (
                          <div className="space-y-4">
                            <div className="mb-5">
                              <h3 className="text-base font-semibold text-white">
                                Preferences & Notes
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                How should we reach you?
                              </p>
                            </div>
                            <Field label="Preferred Contact Method">
                              <div className="flex flex-wrap gap-2">
                                {contactMethods.map((method) => (
                                  <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => update("contactMethod", method.id)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                                      form.contactMethod === method.id
                                        ? "bg-purple-500/15 border-purple-400/30 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                                        : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-zinc-300 hover:border-white/[0.12]"
                                    }`}
                                  >
                                    {method.label}
                                  </button>
                                ))}
                              </div>
                            </Field>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Budget (MAD)">
                                <Input
                                  type="text"
                                  value={form.budget}
                                  onChange={(e) => update("budget", e.target.value)}
                                  placeholder={t("getStarted.budgetPlaceholder")}
                                />
                              </Field>
                              <Field label="Ideas & Inspiration">
                                <Input
                                  value={form.ideas}
                                  onChange={(e) => update("ideas", e.target.value)}
                                  placeholder={t("getStarted.briefPlaceholder")}
                                />
                              </Field>
                            </div>
                            <Field label="Extra Requirements">
                              <TextArea
                                value={form.extraRequirements}
                                onChange={(e) => update("extraRequirements", e.target.value)}
                                  placeholder={t("getStarted.briefPlaceholder")}
                                rows={2}
                              />
                            </Field>
                          </div>
                        )}

                        {/* Step 5: Summary & Submit */}
                        {currentStep === 5 && (
                          <div className="space-y-4">
                            <div className="mb-5">
                              <h3 className="text-base font-semibold text-white">
                                Review & Submit
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                Verify everything looks correct
                              </p>
                            </div>

                            {/* Summary cards */}
                            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 space-y-3">
                              <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
                                Client
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-zinc-500 text-xs">{t("contact.name")}</span>
                                  <p className="text-white">{form.firstName} {form.lastName}</p>
                                </div>
                                <div>
                                  <span className="text-zinc-500 text-xs">{t("contact.email")}</span>
                                  <p className="text-white truncate">{form.email}</p>
                                </div>
                                {form.phone && (
                                  <div>
                                    <span className="text-zinc-500 text-xs">{t("contact.phone")}</span>
                                    <p className="text-white">{form.phone}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 space-y-3">
                              <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
                                Project
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-zinc-500 text-xs">Name</span>
                                  <p className="text-white">{form.projectName}</p>
                                </div>
                                <div>
                                  <span className="text-zinc-500 text-xs">Type</span>
                                  <p className="text-white">{form.projectType}</p>
                                </div>
                              </div>
                              {form.projectDescription && (
                                <div>
                                  <span className="text-zinc-500 text-xs">Description</span>
                                  <p className="text-white/80 text-sm mt-0.5 leading-relaxed">
                                    {form.projectDescription}
                                  </p>
                                </div>
                              )}
                            </div>

                            {itemCount > 0 && (
                              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 space-y-3">
                                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
                                  {t("services")}
                                </h4>
                                <div className="space-y-2">
                                  {cartItems.map((item) => {
                                    const lineTotal = (item.finalPrice || item.price || 0) * (item.quantity ?? 1);
                                    return (
                                      <div key={item.cartItemId} className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-300 truncate">
                                          {item.serviceName}
                                          <span className="text-zinc-500 ml-1">
                                            x{item.quantity ?? 1}
                                          </span>
                                        </span>
                                        <span className="text-cyan-400 font-medium tabular-nums ml-2 shrink-0">
                                          {formatPrice(lineTotal)} MAD
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                                  <span className="text-sm font-semibold text-white">{t("cart.total")}</span>
                                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tabular-nums">
                                    {formatPrice(totalPrice)} MAD
                                  </span>
                                </div>
                              </div>
                            )}

                            {itemCount === 0 && (
                              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                                <p className="text-sm text-zinc-500 text-center">
                                  No services selected. You can still submit and add services later.
                                </p>
                              </div>
                            )}

                            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 space-y-3">
                              <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
                                {t("contact")}
                              </h4>
                              <div className="text-sm">
                                <span className="text-zinc-400">
                                  Preferred method:{" "}
                                </span>
                                <span className="text-white capitalize">
                                  {form.contactMethod}
                                </span>
                              </div>
                              {form.budget && (
                                <div className="text-sm">
                                  <span className="text-zinc-400">Budget: </span>
                                  <span className="text-white">{form.budget} MAD</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Footer navigation */}
                  <div className="relative shrink-0 border-t border-white/[0.06] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {!isFirstStep && (
                          <button
                            onClick={goBack}
                            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                          >
                            <ArrowRight className="w-3 h-3 rotate-180" />
                            {t("common.back")}
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-600 tabular-nums">
                        Step {currentStep} of 5
                      </div>

                      {isLastStep ? (
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              {t("common.loading")}
                            </>
                          ) : (
                            <>
                              {t("onboarding.submit")}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={goNext}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.97]"
                        >
                          {t("common.next")}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-red-400 mt-2 text-center"
                      >
                        {t("validation.required")}
                      </motion.p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
