export const COMMUNITY_STORAGE_KEY = "growstack_community_posts";
export const COMMUNITY_ACCOUNTS_KEY = "growstack_community_accounts";
export const COMMUNITY_SESSION_KEY = "growstack_community_session";
export const COMMUNITY_PROJECTS_KEY = "growstack_community_projects";
export const COMMUNITY_POLLS_KEY = "growstack_community_polls";
export const COMMUNITY_GUEST_KEY = "growstack_guest_id";
export const COMMUNITY_SUCCESS_KEY = "growstack_community_success";
export const COMMUNITY_ACTIVITIES_KEY = "growstack_community_activities";
export const COMMUNITY_DATA_VERSION = "2";
export const COMMUNITY_DATA_VERSION_KEY = "growstack_community_data_v";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Could not persist ${key}`, err);
    return false;
  }
}

export function readPosts() {
  const parsed = readJSON(COMMUNITY_STORAGE_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function writePosts(posts) {
  return writeJSON(COMMUNITY_STORAGE_KEY, posts);
}

export function clearPosts() {
  try {
    localStorage.removeItem(COMMUNITY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function readAccounts() {
  const parsed = readJSON(COMMUNITY_ACCOUNTS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeAccounts(accounts) {
  return writeJSON(COMMUNITY_ACCOUNTS_KEY, accounts);
}

export function readSession() {
  return readJSON(COMMUNITY_SESSION_KEY, null);
}

export function writeSession(accountId) {
  if (accountId == null) {
    try {
      localStorage.removeItem(COMMUNITY_SESSION_KEY);
    } catch {
      /* ignore */
    }
    return true;
  }
  return writeJSON(COMMUNITY_SESSION_KEY, accountId);
}

export function readProjects() {
  const parsed = readJSON(COMMUNITY_PROJECTS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeProjects(projects) {
  return writeJSON(COMMUNITY_PROJECTS_KEY, projects);
}

export function readPolls() {
  const parsed = readJSON(COMMUNITY_POLLS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function writePolls(polls) {
  return writeJSON(COMMUNITY_POLLS_KEY, polls);
}

export function ensureGuestId() {
  try {
    let id = readJSON(COMMUNITY_GUEST_KEY, null);
    if (!id) {
      id = `guest-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      writeJSON(COMMUNITY_GUEST_KEY, id);
    }
    return id;
  } catch {
    return `guest-${Date.now()}`;
  }
}

export function readSuccessStories() {
  const parsed = readJSON(COMMUNITY_SUCCESS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeSuccessStories(stories) {
  return writeJSON(COMMUNITY_SUCCESS_KEY, stories);
}

export function readActivities() {
  const parsed = readJSON(COMMUNITY_ACTIVITIES_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeActivities(activities) {
  return writeJSON(COMMUNITY_ACTIVITIES_KEY, activities);
}

export function migrateCommunityData() {
  try {
    if (localStorage.getItem(COMMUNITY_DATA_VERSION_KEY) === COMMUNITY_DATA_VERSION) {
      return;
    }
    localStorage.removeItem(COMMUNITY_STORAGE_KEY);
    localStorage.removeItem(COMMUNITY_POLLS_KEY);
    localStorage.removeItem(COMMUNITY_SUCCESS_KEY);
    localStorage.setItem(COMMUNITY_DATA_VERSION_KEY, COMMUNITY_DATA_VERSION);
  } catch {
    // Storage unavailable — component state still works for this session.
  }
}

export function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function recordProject(entry) {
  const projects = readProjects();
  const next = [
    { ...entry, projectId: entry.projectId || `proj_${Date.now()}`, createdAt: entry.createdAt || Date.now() },
    ...projects,
  ];
  writeProjects(next);
  return next;
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function initialsAvatar(name = "", index = 0) {
  const clean = (name || "?").trim();
  const initials = clean
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
  const palette = ["#ff5722", "#e64a19", "#bf360c", "#c2410c", "#ea580c", "#f97316"];
  const sum = [...clean].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const color = palette[(sum + (index || 0)) % palette.length];
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>` +
    `<rect width='96' height='96' fill='${color}'/>` +
    `<text x='48' y='54' font-family='Inter, Arial, sans-serif' font-size='38' font-weight='700' fill='#ffffff' text-anchor='middle' dominant-baseline='middle'>${initials}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
