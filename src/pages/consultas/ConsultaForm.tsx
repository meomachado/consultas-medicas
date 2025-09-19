import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useConsultasStore } from "../../store/consultasStore";
import { consultasService } from "../../services/consultasService";
// Reutilize os componentes do App.tsx (ou mova-os para um local compartilhado)
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button, Textarea } from "../../App";
import { ArrowLeft } from "lucide-react";

// Types
interface Consulta {
  id: number;
  paciente: string;
  medico: string;
  especialidade: string;
  data: string;
  status: "Agendada" | "Realizada" | "Cancelada";
  notas?: string;
}

const consultaSchema = z.object({
  paciente: z.string().min(3, "O nome do paciente é obrigatório."),
  medico: z.string().min(3, "O nome do médico é obrigatório."),
  especialidade: z.string().min(3, "A especialidade é obrigatória."),
  data: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Data e hora são obrigatórios." }),
  status: z.enum(["Agendada", "Realizada", "Cancelada"]),
  notas: z.string().optional(),
});

type ConsultaFormData = z.infer<typeof consultaSchema>;

export function ConsultaForm({ isEdit = false }: { isEdit?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchConsultas = useConsultasStore(state => state.fetchConsultas);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema),
    defaultValues: { status: 'Agendada' }
  });

  useEffect(() => {
    if (isEdit && id) {
      consultasService.getById(Number(id)).then(data => {
        const localDate = new Date(data.data).toISOString().slice(0, 16);
        reset({ ...data, data: localDate });
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ConsultaFormData) => {
    const promise = isEdit && id
      ? consultasService.update(Number(id), data)
      : consultasService.create(data);
    
    toast.promise(promise, {
      loading: 'Salvando...',
      success: (savedConsulta) => {
        fetchConsultas();
        navigate(`/consultas/${savedConsulta.id}`);
        return `Consulta ${isEdit ? 'atualizada' : 'criada'} com sucesso!`;
      },
      error: `Erro ao ${isEdit ? 'atualizar' : 'criar'} a consulta.`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>{isEdit ? 'Editar Consulta' : 'Nova Consulta'}</CardTitle>
            <CardDescription>Preencha os dados abaixo para {isEdit ? 'atualizar' : 'agendar'} a consulta.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"> <Label htmlFor="paciente">Paciente</Label> <Input id="paciente" {...register("paciente")} placeholder="Nome do Paciente" /> {errors.paciente && <p className="text-destructive text-sm">{errors.paciente.message}</p>} </div>
            <div className="space-y-2"> <Label htmlFor="medico">Médico</Label> <Input id="medico" {...register("medico")} placeholder="Nome do Médico" /> {errors.medico && <p className="text-destructive text-sm">{errors.medico.message}</p>} </div>
          </div>
           <div className="space-y-2"> <Label htmlFor="especialidade">Especialidade</Label> <Input id="especialidade" {...register("especialidade")} placeholder="Ex: Cardiologia" /> {errors.especialidade && <p className="text-destructive text-sm">{errors.especialidade.message}</p>} </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"> <Label htmlFor="data">Data e Hora</Label> <Input id="data" type="datetime-local" {...register("data")} /> {errors.data && <p className="text-destructive text-sm">{errors.data.message}</p>} </div>
            <div className="space-y-2"> <Label htmlFor="status">Status</Label> <Controller name="status" control={control} render={({ field }) => ( <select {...field} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"> <option value="Agendada">Agendada</option> <option value="Realizada">Realizada</option> <option value="Cancelada">Cancelada</option> </select> )} /> </div>
          </div>
          <div className="space-y-2"> <Label htmlFor="notas">Notas Adicionais</Label> <Textarea id="notas" {...register("notas")} placeholder="Observações..." /> </div>
          <div className="flex justify-end gap-2"> <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button> <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Button> </div>
        </form>
      </CardContent>
    </Card>
  );
}