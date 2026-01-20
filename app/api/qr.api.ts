import axiosClient from "./axiosClient";

// ----------------- QR Data -----------------
export interface QRData {
  qr_id: number;
  qr_name: string;
  lat: number;
  lon: number;
  factory_code: string;
  status?: string;
  created_at?: string;
}

// ----------------- Factory Data -----------------
export interface Factory {
  factory_code: string;
  factory_name: string;
}

// ----------------- CREATE QR -----------------
export const createQR = async (data: QRData): Promise<QRData> => {
  // Removed token parameter and headers
  const res = await axiosClient.post("/qr/", data);
  return res.data;
};

// ----------------- GET QR BY FACTORY -----------------
export const fetchQRByFactory = async (factoryCode: string): Promise<QRData[]> => {
  // Removed token parameter and headers
  const res = await axiosClient.get(`/qr/factory/${factoryCode}`);
  return res.data;
};

// ----------------- UPDATE QR -----------------
export const updateQR = async (qrId: number, data: Partial<QRData>): Promise<QRData> => {
  // Removed token parameter and headers
  const res = await axiosClient.put(`/qr/${qrId}`, data);
  // Supabase returns an array of updated rows
  return res.data[0];
};

// ----------------- DELETE QR -----------------
export const deleteQR = async (qrId: number): Promise<void> => {
  // Removed token parameter and headers
  await axiosClient.delete(`/qr/${qrId}`);
};

// ----------------- FETCH FACTORIES -----------------
export const fetchFactories = async (): Promise<Factory[]> => {
  // Removed token parameter and headers
  const res = await axiosClient.get("/factories");
  return res.data;
};