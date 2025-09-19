import { create } from "zustand";
import { consultasService } from "../services/consultasService";
import type { Consulta } from "../types/Consulta";
import { toast } from "sonner";

interface ConsultasState {
  consultas: Consulta[];
  loading: boolean;
  search: string;
  statusFilter: string;
  especialidadeFilter: string;
  fetchConsultas: () => Promise<void>;
  // Adicionamos a função de deletar aqui
  deleteConsulta: (id: number) => Promise<void>;
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
    try {
      const data = await consultasService.list();
      set({ consultas: data, loading: false });
    } catch {
      toast.error("Erro ao buscar as consultas.");
      set({ loading: false });
    }
  },
  // E aqui implementamos a lógica dela
  deleteConsulta: async (id: number) => {
    try {
      await consultasService.remove(id);
      set((state) => ({
        consultas: state.consultas.filter((c) => c.id !== id),
      }));
      toast.success("Consulta excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir a consulta.");
    }
  },
  setSearch: (value) => set({ search: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
  setEspecialidadeFilter: (value) => set({ especialidadeFilter: value }),
}));