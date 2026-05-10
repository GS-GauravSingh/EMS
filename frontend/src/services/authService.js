import api from "../api/axios.js";

export async function fetchMe() {
  const { data } = await api.get("/api/auth/me");
  return data.user;
}

export async function requestRegisterOtp(payload) {
  const { data } = await api.post("/api/auth/register/request-otp", payload);
  return data;
}

export async function verifyRegisterOtp(payload) {
  const { data } = await api.post("/api/auth/register/verify-otp", payload);
  return data.user;
}

export async function requestLoginOtp(payload) {
  const { data } = await api.post("/api/auth/login/request-otp", payload);
  return data;
}

export async function verifyLoginOtp(payload) {
  const { data } = await api.post("/api/auth/login/verify-otp", payload);
  return data.user;
}

export async function logout() {
  await api.post("/api/auth/logout");
}
