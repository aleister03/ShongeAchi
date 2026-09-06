const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1078";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(json?.error || "Request failed");
    // CHANGED: the status code used to be dropped entirely, so callers
    // that need to tell "Premium required" (402) apart from a genuine
    // failure had no way to do it except fragile string-matching on the
    // message. Carrying the real status lets them check err.status
    // directly (see ConcernAssessment.js for the payoff).
    error.status = res.status;
    throw error;
  }
  return json;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
