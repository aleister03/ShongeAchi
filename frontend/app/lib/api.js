export async function apiRequest(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const fallback = response.status >= 500
      ? "The backend API is unavailable. Confirm it is running on the configured BACKEND_URL."
      : "The request could not be completed.";
    throw new Error(body?.error?.message || fallback);
  }
  return body;
}
