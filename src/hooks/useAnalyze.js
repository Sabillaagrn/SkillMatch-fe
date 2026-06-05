import { useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { loadLastAnalysis, saveLastAnalysis } from "../lib/storage.js";

// Encapsulates the /match call lifecycle: loading, error, and result state.
// Kept out of the page component so the UI stays declarative. The last result
// is persisted so it survives navigation and reloads (auto-save).
export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(() => loadLastAnalysis());

  const analyze = useCallback(async (userSkills, jobDescription) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.match(userSkills, jobDescription);
      setResult(data);
      saveLastAnalysis(data);
      return data;
    } catch (e) {
      setError(e.message || "Gagal menganalisis. Coba lagi.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError("");
  }, []);

  return { loading, error, result, analyze, reset, setError };
}
