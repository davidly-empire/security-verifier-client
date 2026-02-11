import axiosClient from "./axiosClient";

/* ================= GET ================= */

export const getSecurityUsers = () =>
  axiosClient.get("/security-users");


/* ================= CREATE ================= */

export const createSecurityUser = (data) =>
  axiosClient.post("/security-users", data);


/* ================= UPDATE ================= */

export const updateSecurityUser = (id, data) =>
  axiosClient.put(`/security-users/${id}`, data);


/* ================= DELETE ================= */

export const deleteSecurityUser = (id) =>
  axiosClient.delete(`/security-users/${id}`);
