import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { seedAccounts } from "../data/communityAccountsData";
import { seedClientAccounts } from "../data/communityAccountsData";
import { seedProjectHistory } from "../data/communityProjectsData";
import {
  readAccounts,
  writeAccounts,
  readSession,
  writeSession,
  readProjects,
  writeProjects,
  readActivities,
  writeActivities,
  normalizeEmail,
  initialsAvatar,
} from "../utils/communityStorage";
import {
  applyPointsAward,
  applyRewardRedemption,
  POINT_RULES,
  REWARDS,
  MILESTONES,
} from "../utils/communityPoints";

const CommunityAuthContext = createContext(null);

function normalizeAccount(a) {
  const seed = seedAccounts.find((s) => s.id === a.id);
  return {
    ...a,
    points: typeof a.points === "number" ? a.points : seed?.points ?? 0,
    pointsHistory: Array.isArray(a.pointsHistory)
      ? a.pointsHistory
      : seed?.pointsHistory ?? [],
    redeemedRewards: Array.isArray(a.redeemedRewards)
      ? a.redeemedRewards
      : seed?.redeemedRewards ?? [],
  };
}

function getInitialAccounts() {
  const saved = readAccounts();
  if (saved && saved.length) return saved.map(normalizeAccount);
  writeAccounts(seedAccounts);
  return seedAccounts;
}

function getInitialProjects() {
  const saved = readProjects();
  if (saved && saved.length) return saved;
  writeProjects(seedProjectHistory);
  return seedProjectHistory;
}

function getInitialActivities() {
  return readActivities();
}

function isExistingEmail(accounts, email) {
  const normalized = normalizeEmail(email);
  return accounts.some((a) => normalizeEmail(a.email) === normalized);
}

export function CommunityAuthProvider({ children }) {
  const [accounts, setAccounts] = useState(getInitialAccounts);
  const [currentUserId, setCurrentUserId] = useState(readSession);
  const [activities, setActivities] = useState(getInitialActivities);

  useEffect(() => {
    writeAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    writeSession(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    writeActivities(activities);
  }, [activities]);

  useEffect(() => {
    getInitialProjects();
  }, []);

  const currentUser = accounts.find((a) => a.id === currentUserId) || null;

  const getUserById = useCallback(
    (id) => accounts.find((a) => a.id === id) || null,
    [accounts]
  );

  const signup = useCallback(
    ({ name, email, avatar, companyName, industry, role }) => {
      const account = {
        id: `acc_${Date.now()}`,
        name: (name || "").trim(),
        username: normalizeEmail(email).split("@")[0],
        email: normalizeEmail(email),
        avatar: avatar || initialsAvatar(name),
        companyName: (companyName || "").trim(),
        industry: industry || "other",
        role: role || "Client",
        joinedAt: Date.now(),
      };
      setAccounts((prev) => [
        account,
        ...prev.filter((a) => normalizeEmail(a.email) !== normalizeEmail(account.email)),
      ]);
      setCurrentUserId(account.id);
      return account;
    },
    []
  );

  const loginAs = useCallback((accountId) => {
    setCurrentUserId(accountId);
  }, []);

  const simulateClient = useCallback(() => {
    let account = accounts.find((a) => a.id === "acc-demo-client");
    if (!account) {
      const existing = seedClientAccounts[0];
      const taken = isExistingEmail(accounts, existing.email);
      account = taken
        ? {
            ...existing,
            id: `acc_demo_${Date.now()}`,
            email: `demo${Date.now()}@growstack.ma`,
            avatar: initialsAvatar("Client"),
          }
        : { ...existing, avatar: initialsAvatar("Client") };
      setAccounts((prev) => [...prev, account]);
    }
    loginAs(account.id);
    return account;
  }, [accounts, loginAs]);

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  const updateProfile = useCallback((patch) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === patch.id ? { ...a, ...patch } : a))
    );
  }, []);

  const recordActivity = useCallback(
    (activity) => {
      const actor = activity.actor || {
        id: currentUser?.id,
        name: currentUser?.name || "Guest",
        avatar: currentUser?.avatar || initialsAvatar("Guest"),
      };
      setActivities((prev) =>
        [
          {
            id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            createdAt: Date.now(),
            ...activity,
            actor,
          },
          ...prev,
        ].slice(0, 50)
      );
    },
    [currentUser]
  );

  const awardPoints = useCallback(
    (actionKey, metadata = {}) => {
      if (!POINT_RULES[actionKey] || !currentUserId) return 0;
      const points = POINT_RULES[actionKey].points;
      const account = accounts.find((a) => a.id === currentUserId);
      const beforeTotal = account?.points || 0;
      const afterTotal = beforeTotal + points;

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === currentUserId ? applyPointsAward(a, actionKey, metadata) : a
        )
      );

      const milestone = MILESTONES.find(
        (m) => beforeTotal < m && afterTotal >= m
      );
      if (milestone) {
        recordActivity({
          type: "milestone",
          params: { points: afterTotal, milestone },
        });
      }
      return points;
    },
    [currentUserId, accounts, recordActivity]
  );

  const redeemReward = useCallback(
    (rewardId) => {
      if (!currentUser) return { ok: false, error: "unauthenticated" };
      const reward = REWARDS.find((r) => r.id === rewardId);
      if (!reward) return { ok: false, error: "invalid" };
      if ((currentUser.points || 0) < reward.cost) {
        return { ok: false, error: "insufficient" };
      }
      const { account } = applyRewardRedemption(currentUser, reward);
      setAccounts((prev) =>
        prev.map((a) => (a.id === currentUser.id ? account : a))
      );
      return { ok: true, reward };
    },
    [currentUser]
  );

  const value = {
    accounts,
    currentUser,
    currentUserId,
    isAuthenticated: !!currentUser,
    signup,
    loginAs,
    simulateClient,
    logout,
    updateProfile,
    getUserById,
    awardPoints,
    redeemReward,
    activities,
    recordActivity,
  };

  return (
    <CommunityAuthContext.Provider value={value}>
      {children}
    </CommunityAuthContext.Provider>
  );
}

export function useCommunityAuth() {
  const ctx = useContext(CommunityAuthContext);
  if (!ctx) throw new Error("useCommunityAuth must be used within CommunityAuthProvider");
  return ctx;
}