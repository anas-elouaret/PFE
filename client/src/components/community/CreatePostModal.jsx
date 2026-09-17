import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ImagePlus, Video, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fileToDataURL } from "../../utils/communityStorage";
import Button from "../ui/Button";

export default function CreatePostModal({ isOpen, onClose, onSubmit, editingPost, onUpdate }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);
  const [existingMediaType, setExistingMediaType] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editingPost) {
        setText(editingPost.text || "");
        if (editingPost.image) {
          setExistingMediaUrl(editingPost.image);
          setExistingMediaType("image");
        } else if (editingPost.video) {
          setExistingMediaUrl(editingPost.video);
          setExistingMediaType("video");
        }
      }
    }
  }, [isOpen, editingPost]);

  const reset = () => {
    setText("");
    setMedia(null);
    setMediaType(null);
    setPreview(null);
    setExistingMediaUrl(null);
    setExistingMediaType(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) return;
    setMediaType(isImage ? "image" : "video");
    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!text.trim() && !media && !existingMediaUrl) return;

    if (editingPost) {
      let image, video;
      if (media) {
        const url = await fileToDataURL(media);
        if (mediaType === "image") image = url;
        else video = url;
      } else if (existingMediaUrl) {
        if (existingMediaType === "image") image = existingMediaUrl;
        else video = existingMediaUrl;
      }
      onUpdate({ id: editingPost.id, text: text.trim(), image, video });
    } else {
      onSubmit({
        text: text.trim(),
        media,
        mediaType,
      });
    }
    reset();
    onClose();
  };

  const authorName = user?.name || t("community.you");
  const authorAvatar = "/logo.png";
  const shownMedia = preview || existingMediaUrl;
  const shownMediaType = mediaType || existingMediaType;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-12"
        >
          <div className="absolute inset-0 bg-black/60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingPost ? t("community.editPost") : t("community.createTitle")}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <div className="flex items-start gap-3">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-10 h-10 object-cover border border-slate-200 shrink-0"
                />
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("community.postPlaceholder")}
                  rows={4}
                  autoFocus
                  className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Media preview */}
              {shownMedia && (
                <div className="mt-4 relative">
                  {shownMediaType === "image" ? (
                    <img
                      src={shownMedia}
                      alt="Preview"
                      className="w-full max-h-72 object-cover bg-slate-100"
                    />
                  ) : (
                    <video
                      src={shownMedia}
                      playsInline
                      controls
                      className="w-full max-h-72 object-contain bg-slate-900"
                    />
                  )}
                  <button
                    onClick={() => {
                      setMedia(null);
                      setMediaType(null);
                      setPreview(null);
                      setExistingMediaUrl(null);
                      setExistingMediaType(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white hover:bg-orange-500 transition-colors"
                    aria-label="Remove media"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFile}
                  className="hidden"
                  id="post-media-input"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <ImagePlus size={18} />
                  {t("community.photo")}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <Video size={18} />
                  {t("community.video")}
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!text.trim() && !media && !existingMediaUrl}
              >
                {editingPost ? t("community.update") : t("community.post")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}