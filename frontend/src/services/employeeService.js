import api from "../api/axios.js";

export async function getEmployees() {
  const { data } = await api.get("/api/employees");
  return data.data;
}

export async function getEmployee(id) {
  const { data } = await api.get(`/api/employees/${id}`);
  return data.data;
}

export async function createEmployee(body) {
  const { data } = await api.post("/api/employees", body);
  return data.data;
}

export async function updateEmployee(id, body) {
  const { data } = await api.put(`/api/employees/${id}`, body);
  return data.data;
}

export async function deleteEmployee(id) {
  await api.delete(`/api/employees/${id}`);
}
