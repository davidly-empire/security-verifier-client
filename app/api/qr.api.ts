import axiosClient from "./axiosClient";

// ----------------- QR Data -----------------
export interface QRData {
  qr_id: number;
  qr_name: string;
  lat: number;
  lon: number;
  factory_code: string;
  status?: string;
  waiting_time: number; // ✅ Required waiting time
  created_at?: string;
}

// ----------------- Factory Data -----------------
export interface Factory {
  factory_code: string;
  factory_name: string;
}

// ----------------- CREATE QR -----------------
// Exclude qr_id and created_at when creating
export const createQR = async (
  data: Omit<QRData, "qr_id" | "created_at">
): Promise<QRData> => {
  // Ensure waiting_time defaults to 15 if missing
  const payload = { waiting_time: 15, ...data };
  const res = await axiosClient.post("/qr/", payload);
  return res.data;
};

// ----------------- GET QR BY FACTORY -----------------
export const fetchQRByFactory = async (factoryCode: string): Promise<QRData[]> => {
  const res = await axiosClient.get(`/qr/factory/${factoryCode}`);
  return res.data;
};

// ----------------- GET QR BY ID -----------------
export const fetchQRById = async (qrId: number): Promise<QRData> => {
  const res = await axiosClient.get(`/qr/${qrId}`);
  return res.data;
};

// ----------------- UPDATE QR -----------------
// Exclude qr_id and created_at for update payload
export const updateQR = async (
  qrId: number,
  data: Partial<Omit<QRData, "qr_id" | "created_at">>
): Promise<QRData> => {
  // Ensure waiting_time is always included, fallback to 15 if undefined
  const payload = { waiting_time: 15, ...data };
  const res = await axiosClient.put(`/qr/${qrId}`, payload);
  // Some backends return array of updated rows
  return Array.isArray(res.data) ? res.data[0] : res.data;
};

// ----------------- DELETE QR -----------------
export const deleteQR = async (qrId: number): Promise<void> => {
  await axiosClient.delete(`/qr/${qrId}`);
};

// ----------------- FETCH FACTORIES -----------------
export const fetchFactories = async (): Promise<Factory[]> => {
  const res = await axiosClient.get("/factories");
  return res.data;
};
