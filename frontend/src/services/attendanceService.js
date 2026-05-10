import api from "../api/axios.js";

export async function getDailyAttendance(date) {
  const { data } = await api.get("/api/attendance/daily", { params: { date } });
  return data.data;
}

export async function saveDailyAttendance(date, records) {
  const { data } = await api.post("/api/attendance/daily", { date, records });
  return data;
}

export async function getAttendanceHistory(params) {
  const { data } = await api.get("/api/attendance/history", { params });
  return data;
}

export async function markSelfAttendance(payload) {
  const { data } = await api.post("/api/attendance/self", payload);
  return data;
}

export async function getSelfAttendanceHistory(params) {
  const { data } = await api.get("/api/attendance/self/history", { params });
  return data;
}
