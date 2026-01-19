import axiosClient from "./axiosClient";

/* GET scan points by factory */
export const getScanPointsByFactory = (factoryId) =>
  axiosClient.get(`/scan-points?factory_id=${factoryId}`);

/* GET scan point by ID */
export const getScanPointById = (id) =>
  axiosClient.get(`/scan-points/${id}`);

/* CREATE scan point */
export const createScanPoint = (data) =>
  axiosClient.post("/scan-points", data);

/* UPDATE scan point */
export const updateScanPoint = (id, data) =>
  axiosClient.put(`/scan-points/${id}`, data);

/* DELETE scan point */
export const deleteScanPoint = (id) =>
  axiosClient.delete(`/scan-points/${id}`);
