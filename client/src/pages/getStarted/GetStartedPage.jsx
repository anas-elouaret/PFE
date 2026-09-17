import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Trash2, Check, ChevronDown, Sparkles, AlertCircle, Paperclip, Link2, File as FileIcon, User, Building2, Tag, Gift } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProjects } from "../../context/ProjectContext";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import { recordProject, initialsAvatar } from "../../utils/communityStorage";
import { Button, Container } from "../../components/ui";
import FileDropZone from "../../components/getStarted/FileDropZone";
import FilePreview from "../../components/getStarted/FilePreview";
import ReferenceLinks from "../../components/getStarted/ReferenceLinks";
import useFileUpload from "../../hooks/useFileUpload";
import useReferences from "../../hooks/useReferences";
import { uploadFile } from "../../services/uploadService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/\S+$/i;

const INDUSTRY_OPTIONS = [
  "ecommerce", "technology", "fashion",
  "food", "health", "realestate", "b2b", "other",
];

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

export default function GetStartedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice, getDiscountInfo, clearCart } = useCart();
  const { createProject } = useProjects();
  const community = useCommunityAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    website: "",
    description: "",
    timeline: "standard",
    budget: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const industryRef = useRef(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);

  useEffect(() => {
    if (!industryOpen) return;
    const onClickOutside = (e) => {
      if (industryRef.current && !industryRef.current.contains(e.target)) setIndustryOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIndustryOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [industryOpen]);

  const { files, addFiles, removeFile, grouped, totalSize, formatSize: formatFileSize } = useFileUpload();
  const { references, addReference, updateReference, removeReference, getTypeLabel, getTypePlaceholder, referenceTypes } = useReferences();

  const discount = getDiscountInfo();
  const totalPrice = getTotalPrice();
  const baseTotal = discount.eligible ? discount.totalAfterDiscount : totalPrice;
  const promoAmount = appliedPromo ? Math.round((baseTotal * appliedPromo.discount) / 100) : 0;
  const finalTotal = baseTotal - promoAmount;

  const applyPromo = (e) => {
    if (e) e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    console.debug("[GetStarted] applyPromo", code);
    if (!code) return;
    const rewards = community.currentUser?.redeemedRewards || [];
    const found = rewards.find((r) => r.code === code);
    if (found) {
      setAppliedPromo({ code: found.code, discount: found.discount });
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError(community.currentUser ? t("points.promoInvalid") : t("points.promoSignin"));
    }
  };

  const clearPromo = (e) => {
    if (e) e.preventDefault();
    console.debug("[GetStarted] clearPromo");
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
  };

  const fileCount = files.length;
  const refCount = references.filter((r) => r.url.trim()).length;

  const handleChange = (field, value) => {
    console.debug("[GetStarted] handleChange", field, value);
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = t("validation.required");
    if (!form.email.trim()) e.email = t("validation.required");
    else if (!EMAIL_REGEX.test(form.email.trim())) e.email = t("validation.invalidEmail");
    if (!form.phone.trim()) e.phone = t("validation.required");
    if (cartItems.length === 0) e.cart = t("cart.empty");
    if (!form.description.trim()) e.description = t("validation.required");
    if (form.budget && (isNaN(Number(form.budget)) || Number(form.budget) <= 0)) e.budget = t("validation.invalidBudget");
    const invalidRefs = references.filter((r) => r.url.trim() && !URL_REGEX.test(r.url.trim()));
    if (invalidRefs.length > 0) e.references = t("validation.invalidUrl");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.debug("[GetStarted] handleSubmit triggered", { submitting, cartCount: cartItems.length });
    if (!validate()) { console.debug("[GetStarted] handleSubmit validation failed"); return; }
    setSubmitting(true);
    try {
      const uploadedFiles = [];
      for (const f of files) {
        try {
          const result = await uploadFile(f.file, () => {});
          uploadedFiles.push({ name: f.file.name, url: result.url, size: f.file.size, type: f.file.type, category: f.category });
        } catch { uploadedFiles.push({ name: f.file.name, url: null, size: f.file.size, type: f.file.type, category: f.category }); }
}

      const base = {
        email: form.email.trim(),
        clientName: form.fullName.trim(),
        companyName: form.companyName.trim(),
        industry: form.industry,
        website: form.website.trim(),
        description: form.description.trim(),
        timeline: form.timeline,
        budget: form.budget,
        serviceIds: cartItems.map((i) => i.serviceId),
        serviceNames: cartItems.map((i) => i.serviceName),
        serviceTitle: cartItems.map((i) => i.serviceName).join(", "),
        price: finalTotal,
        status: "pending",
        files: uploadedFiles,
      };

      recordProject({
        ...base,
        accountId: community.currentUser?.id || null,
      });

      community.awardPoints("project");

      community.recordActivity({
        type: "service_request",
        actor: {
          id: community.currentUser?.id || null,
          name: community.currentUser?.name || form.fullName.trim(),
          avatar:
            community.currentUser?.avatar || initialsAvatar(form.fullName.trim()),
        },
        params: {
          service: cartItems.map((i) => i.serviceName).join(", "),
        },
      });

      try {
        await createProject({ ...base, phone: form.phone.trim() });
      } catch {
        // Server push is best-effort; the project is persisted locally.
      }

      setSubmitted(true);
      clearCart();
      setTimeout(() => navigate("/client/dashboard"), 2500);
    } catch {
      setErrors({ submit: t("error.general") });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  if (submitted) {
    return (
      <section className="relative pt-20 md:pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_60%)]" />
        <Container>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t("getStarted.success")}</h2>
            <p className="text-slate-500 mb-2">Merci {form.fullName} ! Nous avons bien reçu votre demande.</p>
            <p className="text-slate-400 text-sm mb-6">Nous vous contacterons sous peu à {form.email}.</p>
            <Link to="/client/dashboard"><Button variant="gradient">{t("onboarding.success.viewDashboard")}</Button></Link>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
      <section className="relative pt-20 md:pt-32 pb-20 min-h-screen">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),transparent_60%)]" />
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("getStarted.title")}</h1>
            <p className="text-slate-500">{t("getStarted.subtitle")}</p>
          </div>

          {/* Services */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">{t("services.title")}</h2>
              <span className="text-sm text-slate-500">{t("services.cartCount", { count: cartItems.length })}</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No services selected yet.</p>
                <Link to="/services"><Button variant="secondary">{t("cart.browseServices")}</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.cartItemId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center text-lg">
                      {item.serviceImage || "🎨"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.serviceName}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity ?? 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600">{formatPrice((item.finalPrice || item.basePrice) * (item.quantity ?? 1))} MAD</p>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); console.debug("[GetStarted] removeFromCart", item.cartItemId); removeFromCart(item.cartItemId); }}
                      className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all sm:opacity-0 sm:group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.cart && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> {errors.cart}
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">{t("getStarted.personalInfo")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("getStarted.fullName")} *</label>
                <input type="text" placeholder={t("getStarted.fullNamePlaceholder")} value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className={`${inputClass} ${errors.fullName ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`} />
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className={labelClass}>{t("getStarted.email")} *</label>
                <input type="email" placeholder={t("getStarted.emailPlaceholder")} value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={`${inputClass} ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("getStarted.phone")} *</label>
                <input type="tel" placeholder={t("getStarted.phonePlaceholder")} value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={`${inputClass} ${errors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`} />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">{t("getStarted.companyInfo")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("getStarted.companyName")}</label>
                <input type="text" placeholder={t("getStarted.companyNamePlaceholder")} value={form.companyName} onChange={(e) => handleChange("companyName", e.target.value)} className={inputClass} />
              </div>
              <div className="relative" ref={industryRef}>
                <label className={labelClass}>{t("getStarted.industry")}</label>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); console.debug("[GetStarted] industry toggle", !industryOpen); setIndustryOpen((o) => !o); }}
                  aria-haspopup="listbox"
                  aria-expanded={industryOpen}
                  className={`${inputClass} flex items-center justify-between text-left pr-10`}
                >
                  <span className={form.industry ? "text-slate-900" : "text-slate-400"}>
                    {form.industry ? t(`getStarted.industry_options_${form.industry}`) : t("getStarted.industryPlaceholder")}
                  </span>
                </button>
                <ChevronDown className={`pointer-events-none absolute right-4 top-[2.55rem] w-5 h-5 text-slate-400 transition-transform duration-200 ${industryOpen ? "rotate-180" : ""}`} />
                {industryOpen && (
                  <ul
                    role="listbox"
                    className="absolute z-30 mt-2 w-full max-h-60 overflow-auto rounded-xl bg-white border border-slate-200 shadow-lg shadow-slate-200/60 py-1.5"
                  >
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <li key={opt} role="option" aria-selected={form.industry === opt}>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.debug("[GetStarted] industry select", opt); handleChange("industry", opt); setIndustryOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-indigo-50 ${
                            form.industry === opt ? "bg-indigo-50/70 text-indigo-700 font-medium" : "text-slate-700"
                          }`}
                        >
                          {t(`getStarted.industry_options_${opt}`)}
                          {form.industry === opt && <Check className="w-4 h-4 text-indigo-600" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("getStarted.website")}</label>
                <input type="url" placeholder={t("getStarted.websitePlaceholder")} value={form.website} onChange={(e) => handleChange("website", e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Project Brief */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">{t("getStarted.projectBrief")}</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.briefPlaceholder")} *</label>
              <textarea
                placeholder={t("getStarted.briefPlaceholder")}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-y"
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.timeline")}</label>
                <div className="flex gap-2">
                  {["standard", "express", "priority"].map((tl) => (
                    <button key={tl} type="button" onClick={(e) => { e.preventDefault(); console.debug("[GetStarted] timeline select", tl); handleChange("timeline", tl); }}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                        form.timeline === tl
                          ? "bg-indigo-600 border border-indigo-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}>
                      {tl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.budgetRange")}</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={t("getStarted.budgetPlaceholder")}
                  value={form.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  className={`${inputClass} ${errors.budget ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                />
                {errors.budget && <p className="text-xs text-red-600 mt-1">{errors.budget}</p>}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Project Attachments & Media</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Upload Files</label>
              <FileDropZone onFilesAdded={(fl) => { const { errors: errs } = addFiles(fl); if (errs.length) setErrors((prev) => ({ ...prev, upload: errs })); }} errors={errors.upload || []} />
            </div>

            {files.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{files.length} file{files.length !== 1 ? "s" : ""}</span>
                  <span className="text-xs text-slate-500">{formatFileSize(totalSize)} total</span>
                </div>
                <FilePreview grouped={grouped} onRemove={removeFile} formatSize={formatFileSize} />
              </div>
            )}

            <div className="pt-2 border-t border-slate-200">
              <ReferenceLinks references={references} onAdd={addReference} onUpdate={updateReference} onRemove={removeReference} getTypeLabel={getTypeLabel} getTypePlaceholder={getTypePlaceholder} referenceTypes={referenceTypes} />
              {errors.references && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.references}
                </p>
              )}
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">{t("getStarted.submit")}</h2>

            {/* Personal Summary */}
            {form.fullName && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("getStarted.personalInfo")}</span>
                </div>
                <div className="text-sm text-slate-700 space-y-0.5">
                  <p><span className="font-medium">{t("getStarted.fullName")}:</span> {form.fullName}</p>
                  {form.email && <p><span className="font-medium">{t("getStarted.email")}:</span> {form.email}</p>}
                  {form.phone && <p><span className="font-medium">{t("getStarted.phone")}:</span> {form.phone}</p>}
                  {form.companyName && <p><span className="font-medium">{t("getStarted.companyName")}:</span> {form.companyName}</p>}
                  {form.industry && <p><span className="font-medium">{t("getStarted.industry")}:</span> {t(`getStarted.industry_options_${form.industry}`)}</p>}
                  {form.website && <p><span className="font-medium">{t("getStarted.website")}:</span> {form.website}</p>}
                </div>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-500 line-clamp-2">{form.description || "No description yet."}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 capitalize">{form.timeline}</span>
                {form.budget && <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">{form.budget} MAD</span>}
              </div>
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900 mb-2">{t("services.title")} ({cartItems.length})</p>
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.serviceImage || "🎨"}</span>
                        <span className="text-sm text-slate-700">{item.serviceName}</span>
                        {item.quantity > 1 && <span className="text-xs text-slate-400">x{item.quantity}</span>}
                      </div>
                      <span className="text-sm font-medium text-indigo-600">{formatPrice((item.finalPrice || item.basePrice) * (item.quantity ?? 1))} MAD</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5">
                  {discount.eligible && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-indigo-600 font-medium flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {t("cart.discount", { percent: discount.percent })}
                      </span>
                      <span className="text-indigo-600 font-medium">-{formatPrice(discount.discount)} MAD</span>
                    </div>
                  )}
                  {promoAmount > 0 && appliedPromo && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {appliedPromo.code} (-{appliedPromo.discount}%)
                      </span>
                      <span className="text-emerald-600 font-medium">-{formatPrice(promoAmount)} MAD</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{t("cart.total")}</span>
                    <div className="text-right">
                      {discount.eligible && <span className="text-xs text-slate-400 line-through mr-2">{formatPrice(totalPrice)} MAD</span>}
                      {promoAmount > 0 && <span className="text-xs text-slate-400 line-through mr-2">{formatPrice(baseTotal)} MAD</span>}
                      <span className="text-lg font-bold text-indigo-600">{formatPrice(finalTotal)} MAD</span>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="pt-2">
                    {appliedPromo ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-700">{appliedPromo.code}</span>
                          <span className="text-xs font-semibold text-emerald-600">-{appliedPromo.discount}%</span>
                        </div>
                        <button
                          type="button"
                          onClick={clearPromo}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                          aria-label={t("points.removePromo")}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }}
                            placeholder={t("points.promoPlaceholder")}
                            className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all uppercase"
                          />
                          <button
                            type="button"
                            onClick={applyPromo}
                            disabled={!promoInput.trim()}
                            className="rounded-xl px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            {t("points.apply")}
                          </button>
                        </div>
                        {promoError && (
                          <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 font-medium">
                    Acompte de 50 % à la commande — Solde de 50 % à la livraison. Paiement par virement bancaire.
                  </div>

                  {community.currentUser && (
                    <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-xs text-orange-700 font-medium">
                      <Gift className="w-4 h-4 shrink-0" />
                      {t("points.earnHint")} <span className="font-black">+100 {t("points.pts")}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {(fileCount > 0 || refCount > 0) && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attachments</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fileCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FileIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{fileCount} file{fileCount !== 1 ? "s" : ""} <span className="text-slate-400">({formatFileSize(totalSize)})</span></span>
                    </div>
                  )}
                  {recordingCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mic className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{recordingCount} voice message{recordingCount !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {refCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{refCount} reference link{refCount !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> {errors.submit}
              </div>
            )}

            <Button type="button" variant="gradient" onClick={handleSubmit} loading={submitting} disabled={submitting || cartItems.length === 0} className="w-full">
              {submitting ? t("common.loading") : t("getStarted.submitButton")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
