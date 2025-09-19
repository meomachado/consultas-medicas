import { create } from "zustand";
import { consultasService } from "../services/consultasService";
import type { Consulta } from "../types/Consulta";
import { toast } from "sonner";

// Para criar, omitimos o 'id'. A API irá gerá-lo.
type CreateConsultaDto = Omit<Consulta, "id">;
// Para atualizar, o 'id' é obrigatório.
type UpdateConsultaDto = Consulta;

interface ConsultasState {
  consultas: Consulta[];
  loading: boolean;
  search: string;
  statusFilter: string;
  especialidadeFilter: string;
  fetchConsultas: () => Promise<void>;
  deleteConsulta: (id: string) => Promise<void>;
  getConsultaById: (id: string) => Consulta | undefined;
  addConsulta: (data: CreateConsultaDto) => Promise<void>;
  updateConsulta: (data: UpdateConsultaDto) => Promise<void>;
  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setEspecialidadeFilter: (value: string) => void;
}

export const useConsultasStore = create<ConsultasState>((set, get) => ({
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
  deleteConsulta: async (id: string) => {
    try {
      await consultasService.remove(Number(id));
      set((state) => ({
        consultas: state.consultas.filter((c) => String(c.id) !== id),
      }));
    } catch {
      toast.error("Erro ao excluir a consulta.");
    }
  },
  getConsultaById: (id: string) => {
    return get().consultas.find((c) => String(c.id) === id);
  },
  // Lógica de adicionar corrigida
  addConsulta: async (data) => {
    try {
      const novaConsulta = await consultasService.create(data);
      set((state) => ({
        consultas: [...state.consultas, novaConsulta],
      }));
      toast.success("Consulta agendada com sucesso!");
    } catch (error) {
      toast.error("Erro ao agendar a consulta.");
      throw error;
    }
  },
  // Lógica de atualizar corrigida
  updateConsulta: async (data) => {
    try {
      // O serviço de update espera o ID e os dados separados
      const consultaAtualizada = await consultasService.update(data.id, data);
      set((state) => ({
        consultas: state.consultas.map((c) =>
          c.id === consultaAtualizada.id ? consultaAtualizada : c
        ),
      }));
      toast.success("Consulta atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar a consulta.");
      throw error;
    }
  },
  setSearch: (value) => set({ search: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
  setEspecialidadeFilter: (value) => set({ especialidadeFilter: value }),
}));