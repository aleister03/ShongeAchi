
export async function apiRequest(url, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const response = await fetch(url, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const fallback = response.status >= 500
      ? "The backend API is unavailable. Confirm it is running on the configured BACKEND_URL."
      : "The request could not be completed.";
    const error = new Error(body?.error?.message || fallback);
    // Carry the status so callers can distinguish cases that need different UI —
    // notably 402 (Premium required), which should offer an upgrade rather than
    // read as a failure. The message is unchanged, so existing callers are unaffected.
    error.status = response.status;
    throw error;
  }
  return body;
}