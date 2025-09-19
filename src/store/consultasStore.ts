import { create } from "zustand";
import { consultasService } from "../services/consultasService";
import type { Consulta } from "../types/Consulta";

interface ConsultasState {
  consultas: Consulta[];
  loading: boolean;
  search: string;
  statusFilter: string;
  especialidadeFilter: string;
  fetchConsultas: () => Promise<void>;
  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setEspecialidadeFilter: (value: string) => void;
}

export const useConsultasStore = create<ConsultasState>((set) => ({
  consultas: [],
  loading: false,
  search: "",
  statusFilter: "Todos",
  especialidadeFilter: "Todas",
  fetchConsultas: async () => {
    set({ loading: true });
    const data = await consultasService.list();
    set({ consultas: data, loading: false });
  },
  setSearch: (value) => set({ search: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
  setEspecialidadeFilter: (value) => set({ especialidadeFilter: value })
}));