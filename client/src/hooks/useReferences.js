import { useState, useCallback } from "react";

const REFERENCE_TYPES = [
  { id: "website", label: "Website", placeholder: "https://..." },
  { id: "googledrive", label: "Google Drive", placeholder: "https://drive.google.com/..." },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/..." },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { id: "competitor", label: "Competitor", placeholder: "https://..." },
  { id: "inspiration", label: "Inspiration", placeholder: "https://..." },
];

let refIdCounter = 1;

export default function useReferences() {
  const [references, setReferences] = useState([]);

  const addReference = useCallback((type) => {
    setReferences((prev) => [...prev, { id: refIdCounter++, type, url: "" }]);
  }, []);

  const updateReference = useCallback((id, url) => {
    setReferences((prev) => prev.map((r) => r.id === id ? { ...r, url } : r));
  }, []);

  const removeReference = useCallback((id) => {
    setReferences((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getTypeLabel = (typeId) => REFERENCE_TYPES.find((t) => t.id === typeId)?.label || typeId;
  const getTypePlaceholder = (typeId) => REFERENCE_TYPES.find((t) => t.id === typeId)?.placeholder || "https://...";

  return { references, addReference, updateReference, removeReference, getTypeLabel, getTypePlaceholder, referenceTypes: REFERENCE_TYPES };
}
