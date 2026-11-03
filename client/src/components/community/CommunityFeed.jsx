import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, LogIn, UserRound, AlertCircle, MessageSquarePlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { uploadFile } from "../../services/uploadService";
import * as postApi from "../../api/posts";
import { initialsAvatar } from "../../utils/communityStorage";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";

/**
 * The community feed.
 *
 * Posts live on the server and are the same for everyone. Reading needs no
 * account; publishing, liking and commenting need a real GROWSTACK account,
 * which is also what keeps a name attached to each post.
 */
export default function CommunityFeed() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postApi.getFeed({ limit: 30 });
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
    } catch (err) {
      setError(err.message || "Le fil n'a pas pu être chargé.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, isAuthenticated]);

  const replacePost = (updated) =>
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const toggleLike = async (id) => {
    if (!isAuthenticated) return;
    // Show the change at once, then correct it from the server's count.
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p
      )
    );
    try {
      const { liked, likes } = await postApi.toggleLike(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked, likes } : p)));
    } catch {
      load();
    }
  };

  const addComment = async (postId, text) => {
    if (!isAuthenticated || !text.trim()) return;
    try {
      replacePost(await postApi.addComment(postId, text.trim()));
    } catch (err) {
      setError(err.message || "Le commentaire n'a pas pu être publié.");
    }
  };

  const handleDelete = async (id) => {
    const previous = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await postApi.deletePost(id);
    } catch (err) {
      setPosts(previous);
      setError(err.message || "La publication n'a pas pu être supprimée.");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsOpen(true);
  };

  const handleUpdate = async ({ id, text, media, mediaType, existingMediaUrl, existingMediaType }) => {
    setBusy(true);
    try {
      let image = null;
      let video = null;
      if (media) {
        const { url } = await uploadFile(media, () => {});
        if (mediaType === "image") image = url;
        else video = url;
      } else if (existingMediaUrl) {
        if (existingMediaType === "image") image = existingMediaUrl;
        else video = existingMediaUrl;
      }
      replacePost(await postApi.updatePost(id, { text, image, video }));
    } catch (err) {
      setError(err.message || "La publication n'a pas pu être modifiée.");
    } finally {
      setBusy(false);
      setEditingPost(null);
    }
  };

  const handleSubmit = async ({ text, media, mediaType }) => {
    setBusy(true);
    setError(null);
    try {
      let image = null;
      let video = null;
      if (media) {
        // Media goes to storage and the post keeps the URL. Inlining the file
        // would put a multi-megabyte string in every copy of the feed.
        const { url } = await uploadFile(media, () => {});
        if (mediaType === "image") image = url;
        else video = url;
      }
      const created = await postApi.createPost({ text, image, video });
      setPosts((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message || "La publication n'a pas pu être envoyée.");
    } finally {
      setBusy(false);
    }
  };

  const openComposer = () => {
    if (!isAuthenticated) return;
    setEditingPost(null);
    setIsOpen(true);
  };

  const displayName = user?.name || t("community.you");
  const avatar = user?.avatar || initialsAvatar(displayName);

  return (
    <>
      <div className="border border-slate-200 bg-white shadow-sm p-4 mb-5">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <img
                src={avatar}
                alt=""
                className="w-11 h-11 object-cover border border-slate-200 shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = initialsAvatar(displayName);
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <Link
                to="/client/dashboard"
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
              >
                {t("nav_dashboard", "Mon espace")}
              </Link>
            </>
          ) : (
            <>
              <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-400">
                <UserRound size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{t("community.you")}</p>
                <p className="text-xs text-slate-500">
                  Connectez-vous pour publier, aimer et commenter.
                </p>
              </div>
              <Link
                to="/client/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shrink-0"
              >
                <LogIn size={14} />
                {t("community.signinTab")}
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={openComposer}
              className="flex-1 text-start border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              {t("community.composerPlaceholder", "Partagez quelque chose…")}
            </button>
            <button
              onClick={openComposer}
              aria-label={t("community.newPost", "Nouvelle publication")}
              className="w-11 h-11 shrink-0 flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="flex-1 text-sm text-red-700">{error}</p>
          <button onClick={load} className="shrink-0 text-xs font-bold text-red-700 underline">
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse border border-slate-200 bg-white" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-slate-200 bg-white px-6 py-16 text-center">
          <MessageSquarePlus className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">Rien n'a encore été publié.</p>
          <p className="mt-1 text-sm text-slate-500">
            {isAuthenticated
              ? "Soyez le premier à partager quelque chose."
              : "Connectez-vous pour publier la première."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <PostCard
                  post={post}
                  index={index}
                  onLike={() => toggleLike(post.id)}
                  onAddComment={(text) => addComment(post.id, text)}
                  onEdit={() => handleEdit(post)}
                  onDelete={() => handleDelete(post.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreatePostModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleSubmit}
        onUpdate={handleUpdate}
        editingPost={editingPost}
        submitting={busy}
      />
    </>
  );
}
