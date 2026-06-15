import { useTranslation } from "react-i18next";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Paperclip, Mic, Link2, Image, Video, FileText, Layers, Archive, File as FileIcon } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProjects } from "../../context/ProjectContext";
import { Button, Container, Input } from "../../components/ui";
import FileDropZone from "../../components/getStarted/FileDropZone";
import FilePreview from "../../components/getStarted/FilePreview";
import AudioRecorder from "../../components/getStarted/AudioRecorder";
import ReferenceLinks from "../../components/getStarted/ReferenceLinks";
import useFileUpload from "../../hooks/useFileUpload";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import useReferences from "../../hooks/useReferences";
import { uploadFile, submitProjectRequest } from "../../services/uploadService";

const steps = ["common.services", "getStarted.projectBrief", "getStarted.projectBrief", "getStarted.submit"];

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

function StepIndicator({ current, steps }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => (
        <div key={label + i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
            i <= current
              ? "bg-indigo-50 border border-indigo-200 text-slate-900"
              : "bg-slate-50 border border-slate-200 text-slate-500"
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i < current
                ? "bg-indigo-600 text-white"
                : i === current
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}>
              {i < current ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className="hidden sm:inline">{t(label)}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px ${i < current ? "bg-indigo-400/50" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function GetStartedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice, getDiscountInfo, clearCart } = useCart();
  const { createProject, submitting: projectSubmitting } = useProjects();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    timeline: "standard",
    budget: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { files, addFiles, removeFile, clearAll, grouped, totalSize, formatSize: formatFileSize } = useFileUpload();
  const { recordings, recording, duration, startRecording, stopRecording, deleteRecording, formatDuration } = useAudioRecorder();
  const { references, addReference, updateReference, removeReference, getTypeLabel, getTypePlaceholder, referenceTypes } = useReferences();

  const discount = getDiscountInfo();
  const totalPrice = getTotalPrice();
  const finalTotal = discount.eligible ? discount.totalAfterDiscount : totalPrice;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateStep = useCallback(() => {
    const e = {};
    if (cartItems.length === 0) e.cart = t("cart.empty");
    if (step === 1) {
      if (!form.projectName.trim()) e.projectName = t("validation.required");
      if (!form.description.trim()) e.description = t("validation.required");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, cartItems, form, t]);

  const handleNext = useCallback(() => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  }, [validateStep]);

  const handleBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const uploadedFiles = [];
      for (const f of files) {
        try {
          const result = await uploadFile(f.file, (progress) => {});
          uploadedFiles.push({ name: f.file.name, url: result.url, size: f.file.size, type: f.file.type, category: f.category });
        } catch { uploadedFiles.push({ name: f.file.name, url: null, size: f.file.size, type: f.file.type, category: f.category }); }
      }

      const audioRecordings = recordings.map((r) => ({ url: r.url, duration: r.duration }));

      await submitProjectRequest({
        name: form.projectName,
        description: form.description,
        services: cartItems.map((i) => ({
          serviceId: i.serviceId,
          name: i.serviceName,
          price: i.finalPrice || i.basePrice,
        })),
        totalBudget: finalTotal,
        timeline: form.timeline,
        budget: form.budget,
        status: "new",
        files: uploadedFiles,
        audioRecordings,
        references: references.filter((r) => r.url.trim()).map((r) => ({ type: r.type, url: r.url })),
      });

      await createProject({
        name: form.projectName,
        description: form.description,
        services: cartItems.map((i) => ({ serviceId: i.serviceId, name: i.serviceName, price: i.finalPrice || i.basePrice })),
        totalBudget: finalTotal,
        timeline: form.timeline,
        status: "new",
      });

      setSubmitted(true);
      clearCart();
      setTimeout(() => navigate("/client/dashboard"), 2500);
    } catch {
      setErrors({ submit: t("error.general") });
    } finally {
      setSubmitting(false);
    }
  }, [validateStep, files, recordings, references, form, cartItems, finalTotal, createProject, clearCart, navigate, t]);

  const fileCount = files.length;
  const recordingCount = recordings.length;
  const refCount = references.filter((r) => r.url.trim()).length;

  if (submitted) {
    return (
      <section className="relative pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_60%)]" />
        <Container>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t("getStarted.success")}</h2>
            <p className="text-slate-500 mb-6">{t("onboarding.success.subtitle")}</p>
            <Link to="/client/dashboard"><Button variant="gradient">{t("onboarding.success.viewDashboard")}</Button></Link>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative pt-32 pb-20 min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),transparent_60%)]" />
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("getStarted")}</h1>
            <p className="text-slate-500">{t("getStarted.subtitle")}</p>
          </div>

          <StepIndicator current={step} steps={steps} />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">{t("services")}</h2>
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
                        <motion.div key={item.cartItemId} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }}
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
                          <button onClick={() => removeFromCart(item.cartItemId)}
                            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {cartItems.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                      {discount.eligible && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-indigo-600 font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> {t("cart.discount", { percent: discount.percent })}
                          </span>
                          <span className="text-indigo-600 font-medium">-{formatPrice(discount.discount)} MAD</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{t("cart.total")}</span>
                        <div className="text-right">
                          {discount.eligible && <span className="text-xs text-slate-400 line-through mr-2">{formatPrice(totalPrice)} MAD</span>}
                          <span className="text-lg font-bold text-indigo-600">{formatPrice(finalTotal)} MAD</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {errors.cart && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" /> {errors.cart}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Link to="/services"><Button variant="secondary"><ArrowLeft className="w-4 h-4" /> {t("cart.continueShopping")}</Button></Link>
                  <Button variant="gradient" onClick={handleNext} disabled={cartItems.length === 0}>
                    {t("onboarding.next")} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
                  <h2 className="text-lg font-bold text-slate-900">{t("getStarted.projectBrief")}</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.selectService")} *</label>
                    <Input
                      placeholder={t("contact.subjectPlaceholder")}
                      value={form.projectName}
                      onChange={(e) => handleChange("projectName", e.target.value)}
                      error={errors.projectName}
                    />
                    {errors.projectName && <p className="text-xs text-red-600 mt-1">{errors.projectName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.briefPlaceholder")} *</label>
                    <textarea
                      placeholder={t("getStarted.briefPlaceholder")}
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={4}
                      className={`w-full rounded-xl bg-white border ${errors.description ? "border-red-300" : "border-slate-200"} px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none`}
                    />
                    {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.budgetRange")}</label>
                      <div className="flex gap-2">
                        {["standard", "express", "priority"].map((t) => (
                          <button key={t} onClick={() => handleChange("timeline", t)}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                              form.timeline === t
                                ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700"
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("getStarted.budgetRange")}</label>
                      <Input placeholder={t("getStarted.budgetPlaceholder")} value={form.budget} onChange={(e) => handleChange("budget", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="secondary" onClick={handleBack}><ArrowLeft className="w-4 h-4" /> {t("common.back")}</Button>
                  <Button variant="gradient" onClick={handleNext}>{t("onboarding.next")} <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
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
                    <label className="block text-sm font-medium text-slate-700 mb-3">Voice Message</label>
                    <AudioRecorder recording={recording} duration={duration} recordings={recordings} onStart={startRecording} onStop={stopRecording} onDelete={deleteRecording} formatDuration={formatDuration} />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <ReferenceLinks references={references} onAdd={addReference} onUpdate={updateReference} onRemove={removeReference} getTypeLabel={getTypeLabel} getTypePlaceholder={getTypePlaceholder} referenceTypes={referenceTypes} />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="secondary" onClick={handleBack}><ArrowLeft className="w-4 h-4" /> {t("common.back")}</Button>
                  <Button variant="gradient" onClick={handleNext}>{t("onboarding.next")} <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
                  <h2 className="text-lg font-bold text-slate-900">{t("getStarted.submit")}</h2>

                  {/* Project Summary */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-1">{form.projectName}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{form.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 capitalize">{form.timeline}</span>
                      {form.budget && <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">{form.budget} MAD</span>}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{t("services")} ({cartItems.length})</p>
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

                  {/* Attachments Summary */}
                  {(fileCount > 0 || recordingCount > 0 || refCount > 0) && (
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

                  {/* Pricing */}
                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{t("cart.subtotal")}</span>
                      <span className="text-slate-700">{formatPrice(totalPrice)} MAD</span>
                    </div>
                    {discount.eligible && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-indigo-600 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> {t("cart.discount", { percent: discount.percent })}</span>
                        <span className="text-indigo-600">-{formatPrice(discount.discount)} MAD</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-sm font-semibold text-slate-900">{t("cart.total")}</span>
                      <span className="text-lg font-bold text-indigo-600">{formatPrice(finalTotal)} MAD</span>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" /> {errors.submit}
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="secondary" onClick={handleBack}><ArrowLeft className="w-4 h-4" /> {t("common.back")}</Button>
                  <Button variant="gradient" onClick={handleSubmit} loading={submitting} disabled={submitting}>
                    {submitting ? t("common.loading") : t("common.submit")}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
