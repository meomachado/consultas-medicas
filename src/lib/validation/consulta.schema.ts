import { z } from "zod";

export const consultaSchema = z.object({
  paciente: z.string().min(3, "Nome do paciente é obrigatório"),
  medico: z.string().min(3, "Nome do médico é obrigatório"),
  especialidade: z.string().min(3, "Especialidade é obrigatória"),
  data: z.string().min(1, "Data é obrigatória"),
  status: z.enum(["Agendada", "Realizada", "Cancelada"]),
  notas: z.string().optional()
});

export type ConsultaFormData = z.infer<typeof consultaSchema>;