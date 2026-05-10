import api from "../api/axios.js";

export async function getUsers() {
  const { data } = await api.get("/api/users");
  return data.data;
}

export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/api/users/${id}/role`, { role });
  return data.data;
}
