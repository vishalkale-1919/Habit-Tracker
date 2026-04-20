const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" }, ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message ?? res.statusText);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => req("/habits"),
  create: (name) => req("/habits", { method: "POST", body: JSON.stringify({ name }) }),
  toggle: (id, date) =>
    req(`/habits/${id}/toggle`, { method: "PATCH", body: JSON.stringify({ date }) }),
  remove: (id) => req(`/habits/${id}`, { method: "DELETE" }),
  clear:  () => req(`/habits`, { method: "DELETE" }),
};
