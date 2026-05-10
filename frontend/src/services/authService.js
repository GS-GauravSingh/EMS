import api from "../api/axios.js";

export async function fetchMe() {
  const { data } = await api.get("/api/auth/me");
  return data.user;
}

export async function login(credentials) {
  const { data } = await api.post("/api/auth/login", credentials);
  return data.user;
}

export async function register(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data.user;
}

export async function logout() {
  await api.post("/api/auth/logout");
}
