import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-24 left-6 z-50 flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
