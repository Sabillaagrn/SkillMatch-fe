// Thin fetch wrapper around the SkillMatch FastAPI backend.
const BASE =
  import.meta.env.VITE_API_URL ||
  "https://skilmatch.up.railway.app";

async function post(path, body) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan backend berjalan di " + BASE
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || `Terjadi kesalahan (HTTP ${res.status}).`);
  }
  return data;
}

export const api = {
  health: () => fetch(`${BASE}/health`).then((r) => r.json()),
  extractSkill: (job_description, threshold) =>
    post("/extract-skill", { job_description, threshold }),
  match: (user_skills, job_description, threshold) =>
    post("/match", { user_skills, job_description, threshold }),
  recommend: (user_skills) => post("/recommend", { user_skills }),
};

export const API_BASE = BASE;
