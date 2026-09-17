import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Camera, LogOut, UserRound, Gem, MessageSquarePlus } from "lucide-react";
import {
  readPosts,
  writePosts,
  fileToDataURL,
  initialsAvatar,
  readPolls,
  writePolls,
  ensureGuestId,
  migrateCommunityData,
} from "../../utils/communityStorage";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import PostCard from "./PostCard";
import PollCard from "./PollCard";
import CreatePostModal from "./CreatePostModal";
import AccountLoginModal from "./AccountLoginModal";
import LiveActivityStream from "./LiveActivityStream";

function getInitialPosts() {
  migrateCommunityData();
  return normalizeStoredPosts(readPosts());
}

function normalizeStoredPosts(list) {
  return list.map((p) => {
    const commentsList = Array.isArray(p.commentsList) ? p.commentsList : [];
    return { ...p, commentsList, comments: commentsList.length };
  });
}

function getInitialPolls() {
  migrateCommunityData();
  return readPolls();
}

export default function CommunityFeed() {
  const { t } = useTranslation();
  const community = useCommunityAuth();
  const [posts, setPosts] = useState(getInitialPosts);
  const [polls, setPolls] = useState(getInitialPolls);
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [pendingCompose, setPendingCompose] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    writePosts(posts);
  }, [posts]);

  useEffect(() => {
    writePolls(polls);
  }, [polls]);

  const castPollVote = (pollId, optionId) => {
    const voterId = community.currentUser?.id || ensureGuestId();
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        const choices = poll.choices || {};
        if (choices[voterId]) return poll;
        return {
          ...poll,
          votes: {
            ...(poll.votes || {}),
            [optionId]: (poll.votes?.[optionId] || 0) + 1,
          },
          choices: { ...choices, [voterId]: optionId },
        };
      })
    );
  };

  const toggleLike = (id) => {
    const target = posts.find((p) => p.id === id);
    const gainingLike = target ? !target.liked : false;
    if (gainingLike) community.awardPoints("like", { postId: id });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p
      )
    );
  };

  const addComment = (postId, text) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const me = community.currentUser;
        const comment = {
          id: `c-${Date.now()}`,
          author: {
            accountId: me?.id,
            name: me?.name || t("community.you"),
            avatar: me?.avatar || initialsAvatar(me?.name || t("community.you")),
          },
          text,
          createdAt: Date.now(),
        };
        const commentsList = [...(p.commentsList || []), comment];
        return { ...p, commentsList, comments: commentsList.length };
      })
    );
    community.awardPoints("comment");
  };

  const handleDelete = (id) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsOpen(true);
  };

  const handleUpdate = ({ id, text, image, video }) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              text,
              image: image ?? p.image,
              video: video ?? p.video,
            }
          : p
      )
    );

  const openComposer = () => {
    if (!community.currentUser) {
      setPendingCompose(true);
      setAccountOpen(true);
      return;
    }
    setIsOpen(true);
  };

  const handleAuthed = () => {
    if (pendingCompose) {
      setPendingCompose(false);
      setIsOpen(true);
    }
  };

  const handleSubmit = async ({ text, media, mediaType }) => {
    const me = community.currentUser;
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        accountId: me?.id,
        name: me?.name || t("community.you"),
        role: me?.companyName
          ? `${me.role || "Client"} @ ${me.companyName}`
          : me?.role || t("community.member"),
        company: me?.companyName || null,
        avatar: me?.avatar || initialsAvatar(me?.name || t("community.you")),
      },
      createdAt: Date.now(),
      text,
      likes: 0,
      comments: 0,
      commentsList: [],
      shares: 0,
    };

    if (media && mediaType === "image") newPost.image = await fileToDataURL(media);
    if (media && mediaType === "video") newPost.video = await fileToDataURL(media);

    setPosts((prev) => [newPost, ...prev]);
    community.awardPoints("post");
    community.recordActivity({
      type: "community_post",
      actor: {
        id: newPost.author.accountId,
        name: newPost.author.name,
        avatar: newPost.author.avatar,
      },
    });
  };

  const composerAvatar = community.currentUser?.avatar || "/logo.png";
  const composerName = community.currentUser?.name || t("community.you");

  const interleaved = [];
  let pollIndex = 0;
  posts.forEach((post, i) => {
    interleaved.push({ type: "post", key: post.id, index: i, post });
    if ((i + 1) % 2 === 0 && pollIndex < polls.length) {
      interleaved.push({ type: "poll", key: polls[pollIndex].id, poll: polls[pollIndex] });
      pollIndex += 1;
    }
  });
  while (pollIndex < polls.length) {
    interleaved.push({ type: "poll", key: polls[pollIndex].id, poll: polls[pollIndex] });
    pollIndex += 1;
  }

  return (
    <>
      {/* Session bar */}
      <div className="border border-slate-200 bg-white shadow-sm p-4 mb-5">
        <div className="flex items-center gap-3">
          {community.currentUser ? (
            <>
              <Link to={`/profile/${community.currentUser.id}`} className="shrink-0 block">
                <img
                  src={composerAvatar}
                  alt={composerName}
                  className="w-11 h-11 object-cover border border-slate-200 shrink-0 hover:border-orange-500 transition-colors"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = initialsAvatar(composerName);
                  }}
                />
              </Link>
              <Link
                to={`/profile/${community.currentUser.id}`}
                className="min-w-0 flex-1 group"
              >
                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                  {composerName}
                </p>
                {community.currentUser.companyName && (
                  <p className="text-xs text-slate-500 truncate">
                    {community.currentUser.companyName}
                  </p>
                )}
              </Link>
              <Link
                to={`/profile/${community.currentUser.id}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors shrink-0"
                aria-label={t("points.balance")}
                title={t("points.balance")}
              >
                <Gem size={14} />
                {community.currentUser.points ?? 0} {t("points.pts")}
              </Link>
              <button
                onClick={community.logout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                aria-label={t("community.logout")}
              >
                <LogOut size={15} />
                {t("community.logout")}
              </button>
            </>
          ) : (
            <>
              <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-400">
                <UserRound size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{t("community.you")}</p>
                <p className="text-xs text-slate-500">{t("community.accountHintGuest")}</p>
              </div>
              <button
                onClick={() => setAccountOpen(true)}
                className="px-3 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shrink-0"
              >
                {t("community.signinTab")}
              </button>
            </>
          )}
        </div>

        {/* Composer */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={openComposer}
            className="flex-1 text-left border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            {t("community.composerPlaceholder")}
          </button>
          <button
            onClick={openComposer}
            className="w-11 h-11 shrink-0 flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            aria-label={t("community.createTitle")}
          >
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Live Activity Stream */}
      <LiveActivityStream className="mb-5" />

      {/* Feed */}
      {interleaved.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white p-10 sm:p-14 text-center">
          <span className="mx-auto w-14 h-14 flex items-center justify-center bg-orange-50 border border-orange-200 text-orange-600">
            <MessageSquarePlus size={26} />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-900">
            {t("community.feedEmptyTitle")}
          </p>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {t("community.feedEmpty")}
          </p>
          <button
            onClick={openComposer}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            {t("community.create")}
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {interleaved.map((item) => (
            <div key={item.key} className="mb-5">
              {item.type === "post" ? (
                <PostCard
                  post={item.post}
                  index={item.index}
                  onLike={() => toggleLike(item.post.id)}
                  onAddComment={addComment}
                  onRequireAuth={() => setAccountOpen(true)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <PollCard poll={item.poll} onVote={castPollVote} />
              )}
            </div>
          ))}
        </AnimatePresence>
      )}

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={openComposer}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 pl-4 pr-5 h-14 bg-orange-500 text-white hover:bg-orange-600 shadow-lg border-2 border-orange-600 transition-colors"
        aria-label={t("community.createTitle")}
      >
        <Plus size={22} strokeWidth={2.5} />
        <span className="text-sm font-bold">{t("community.create")}</span>
      </motion.button>

      <CreatePostModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleSubmit}
        editingPost={editingPost}
        onUpdate={handleUpdate}
      />

      <AccountLoginModal
        isOpen={accountOpen}
        onClose={() => {
          setAccountOpen(false);
          setPendingCompose(false);
        }}
        onAuthed={handleAuthed}
      />
    </>
  );
}