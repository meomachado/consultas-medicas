import axios from "axios";
import type { Consulta } from "../types/Consulta";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

export const consultasService = {
  list: async (): Promise<Consulta[]> => {
    const res = await api.get("/consultas");
    return res.data;
  },
  getById: async (id: number): Promise<Consulta> => {
    const res = await api.get(`/consultas/${id}`);
    return res.data;
  },
  create: async (data: Omit<Consulta, "id">): Promise<Consulta> => {
    const res = await api.post("/consultas", data);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },
  update: async (id: number, data: Omit<Consulta, "id">): Promise<Consulta> => {
    const res = await api.put(`/consultas/${id}`, data);
    return res.data;
  }
};