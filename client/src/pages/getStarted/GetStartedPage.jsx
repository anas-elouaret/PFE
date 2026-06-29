import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Trash2, Check, Sparkles, AlertCircle, Paperclip, Mic, Link2, File as FileIcon } from "lucide-react";
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
import { uploadFile } from "../../services/uploadService";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

export default function GetStartedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice, getDiscountInfo, clearCart } = useCart();
  const { createProject } = useProjects();
  const [form, setForm] = useState({
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

  const validate = () => {
    const e = {};
    if (cartItems.length === 0) e.cart = t("cart.empty");
    if (!form.description.trim()) e.description = t("validation.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
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

      await createProject({
        clientName: form.description,
        description: form.description,
        serviceTitle: form.description,
        serviceIds: cartItems.map((i) => i.serviceId),
        price: finalTotal,
        status: "pending",
        files: uploadedFiles,
      });

      setSubmitted(true);
      clearCart();
      setTimeout(() => navigate("/client/dashboard"), 2500);
    } catch {
      setErrors({ submit: t("error.general") });
    } finally {
      setSubmitting(false);
    }
  };

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
                    <button onClick={() => removeFromCart(item.cartItemId)}
                      className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100">
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
                    <button key={tl} onClick={() => handleChange("timeline", tl)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                        form.timeline === tl
                          ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                          : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700"
                      }`}>
                      {tl}
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
              <label className="block text-sm font-medium text-slate-700 mb-3">Voice Message</label>
              <AudioRecorder recording={recording} duration={duration} recordings={recordings} onStart={startRecording} onStop={stopRecording} onDelete={deleteRecording} formatDuration={formatDuration} />
            </div>

            <div className="pt-2 border-t border-slate-200">
              <ReferenceLinks references={references} onAdd={addReference} onUpdate={updateReference} onRemove={removeReference} getTypeLabel={getTypeLabel} getTypePlaceholder={getTypePlaceholder} referenceTypes={referenceTypes} />
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">{t("getStarted.submit")}</h2>

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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{t("cart.total")}</span>
                    <div className="text-right">
                      {discount.eligible && <span className="text-xs text-slate-400 line-through mr-2">{formatPrice(totalPrice)} MAD</span>}
                      <span className="text-lg font-bold text-indigo-600">{formatPrice(finalTotal)} MAD</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 font-medium">
                    Acompte de 50 % à la commande — Solde de 50 % à la livraison. Paiement par virement bancaire.
                  </div>
                </div>
              </>
            )}

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

            {errors.submit && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> {errors.submit}
              </div>
            )}

            <Button variant="gradient" onClick={handleSubmit} loading={submitting} disabled={submitting || cartItems.length === 0} className="w-full">
              {submitting ? t("common.loading") : t("common.submit")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
