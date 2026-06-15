import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, XCircle, Trash2, Star, Clock, MessageSquare, ChevronDown, Filter } from "lucide-react";
import { getAllReviews, updateReviewStatus, deleteReview } from "../../services/reviewApi";

const statusConfig = {
  pending: { label: "Pending", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: Clock },
  approved: { label: "Approved", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: CheckCircle },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle },
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllReviews({ status: statusFilter, search });
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchReviews, 300);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleStatus = async (id, status) => {
    try {
      await updateReviewStatus(id, status);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const tabs = [
    { key: "all", label: "All", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
  ];

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Reviews</h1>
        <p className="text-zinc-500 mt-1">Manage customer reviews and testimonials</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`relative rounded-xl border p-4 text-left transition-all ${
              statusFilter === tab.key
                ? "border-[#00AEEF]/30 bg-[#00AEEF]/5"
                : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">{tab.label}</p>
            <p className="text-2xl font-bold text-white">{tab.count}</p>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or comment..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#00AEEF]/40 focus:border-[#00AEEF]/30"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-white/5 rounded" />
                  <div className="h-3 w-48 bg-white/5 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 font-medium">No reviews found</p>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review, i) => {
              const status = statusConfig[review.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-5 hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center shrink-0 border border-white/[0.06]">
                        <span className="text-xs font-bold text-zinc-300">
                          {review.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-bold text-white">{review.name}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.color} ${status.border} border`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star key={s} className={`w-3 h-3 ${s < review.rating ? "text-[#00AEEF] fill-[#00AEEF]" : "text-zinc-600"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-zinc-600">{review.email}</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{review.comment}</p>
                        {review.likes > 0 && (
                          <p className="text-[10px] text-zinc-600 mt-1">{review.likes} helpful</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {review.status === "pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStatus(review._id, "approved")}
                            className="p-2 rounded-lg bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20 border border-[#00AEEF]/20 transition-all"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStatus(review._id, "rejected")}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      {review.status === "approved" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatus(review._id, "pending")}
                          className="p-2 rounded-lg bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20 border border-[#00AEEF]/20 transition-all"
                          title="Move to Pending"
                        >
                          <Clock className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(review._id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
