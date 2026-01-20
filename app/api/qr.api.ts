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
export const createQR = async (data: QRData, token: string): Promise<QRData> => {
  const res = await axiosClient.post("/qr/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ----------------- GET QR BY FACTORY -----------------
export const fetchQRByFactory = async (factoryCode: string, token: string): Promise<QRData[]> => {
  const res = await axiosClient.get(`/qr/factory/${factoryCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ----------------- UPDATE QR -----------------
export const updateQR = async (qrId: number, data: Partial<QRData>, token: string): Promise<QRData> => {
  const res = await axiosClient.put(`/qr/${qrId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Supabase returns an array of updated rows
  return res.data[0];
};

// ----------------- DELETE QR -----------------
export const deleteQR = async (qrId: number, token: string): Promise<void> => {
  await axiosClient.delete(`/qr/${qrId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ----------------- FETCH FACTORIES -----------------
export const fetchFactories = async (token: string): Promise<Factory[]> => {
  const res = await axiosClient.get("/factories", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
