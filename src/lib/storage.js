// Lightweight persistence for the most recent analysis so results (and the
// related job recommendations derived from them) survive navigation and reloads.
const KEY = "skillmatch:last-analysis";

export function loadLastAnalysis() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLastAnalysis(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Ignore quota / unavailable storage — persistence is best-effort.
  }
}

// User profile (editable details + skills) persisted across sessions.
const PROFILE_KEY = "skillmatch:profile";

export const DEFAULT_PROFILE = {
  name: "Amalia Putri",
  location: "Jawa Barat, Bandung",
  photo: null,
  skills: ["Python", "Data Analysis", "Machine Learning", "SQL", "TensorFlow"],
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore quota / unavailable storage — persistence is best-effort.
  }
}
