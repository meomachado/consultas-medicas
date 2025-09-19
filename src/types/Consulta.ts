export interface Consulta {
    id: number;
    paciente: string;
    medico: string;
    especialidade: string;
    data: string; // ISO
    status: "Agendada" | "Realizada" | "Cancelada";
    notas?: string;
  }