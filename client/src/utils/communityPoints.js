const REWARD = "reward";

export const POINT_RULES = {
  post: { points: 15, action: "post" },
  comment: { points: 5, action: "comment" },
  like: { points: 2, action: "like" },
  project: { points: 100, action: "project" },
  redeem: { points: 0, action: "redeem" },
};

export const MILESTONES = [100, 250, 500, 900];

export const REWARDS = [
  {
    id: "grow10",
    code: "GROW10",
    cost: 500,
    discount: 10,
    title: "points.rewardGrow10",
    subtitle: "points.rewardGrow10Sub",
  },
  {
    id: "grow20",
    code: "GROW20",
    cost: 900,
    discount: 20,
    title: "points.rewardGrow20",
    subtitle: "points.rewardGrow20Sub",
  },
];

export function withPointsDefaults(account) {
  return {
    ...account,
    points: typeof account.points === "number" ? account.points : 0,
    pointsHistory: Array.isArray(account.pointsHistory) ? account.pointsHistory : [],
    redeemedRewards: Array.isArray(account.redeemedRewards) ? account.redeemedRewards : [],
  };
}

export function buildPointsEntry({ amount, action, note, id }) {
  return {
    id: id || `pt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount,
    action,
    note: note || "",
    createdAt: Date.now(),
  };
}

export function applyPointsAward(account, actionKey, metadata = {}) {
  const rule = POINT_RULES[actionKey];
  if (!rule) return account;
  const entry = buildPointsEntry({
    amount: rule.points,
    action: rule.action,
    note: metadata.note || "",
  });
  return {
    ...account,
    points: (account.points || 0) + rule.points,
    pointsHistory: [entry, ...(account.pointsHistory || [])],
  };
}

export function applyRewardRedemption(account, reward) {
  if ((account.points || 0) < reward.cost) {
    return { account, error: "insufficient" };
  }
  const entry = buildPointsEntry({
    amount: -reward.cost,
    action: REWARD,
    note: reward.code,
  });
  const next = {
    ...account,
    points: (account.points || 0) - reward.cost,
    pointsHistory: [entry, ...(account.pointsHistory || [])],
    redeemedRewards: [
      {
        id: reward.id,
        code: reward.code,
        cost: reward.cost,
        discount: reward.discount,
        createdAt: Date.now(),
      },
      ...(account.redeemedRewards || []),
    ],
  };
  return { account: next, error: null };
}