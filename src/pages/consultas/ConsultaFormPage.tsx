import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useConsultasStore } from "@/store/consultasStore";
import { consultaSchema } from "@/lib/validation/consulta.schema";

type ConsultaFormData = z.infer<typeof consultaSchema>;

export function ConsultaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { addConsulta, updateConsulta, getConsultaById } = useConsultasStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema),
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const consultaExistente = getConsultaById(id);
      if (consultaExistente) {
        setValue("paciente", consultaExistente.paciente);
        setValue("medico", consultaExistente.medico);
        setValue("especialidade", consultaExistente.especialidade);
        const dataFormatada = new Date(consultaExistente.data).toISOString().slice(0, 16);
        setValue("data", dataFormatada);
        setValue("notas", consultaExistente.notas);
      }
    }
  }, [id, isEditing, getConsultaById, setValue]);

  const onSubmit = async (data: ConsultaFormData) => {
    try {
      if (isEditing && id) {
        const consultaAtual = getConsultaById(id);
        // Enviamos o objeto completo, incluindo o status que já existia
        await updateConsulta({
          ...data,
          id: Number(id),
          status: consultaAtual?.status || 'Agendada', // Mantém o status antigo
        });
      } else {
        // Para novas consultas, o status é sempre 'Agendada'
        await addConsulta({ ...data, status: 'Agendada' });
      }
      navigate("/");
    } catch (error) {
      console.error("Falha ao salvar a consulta:", error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Consulta" : "Nova Consulta"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize os detalhes da consulta abaixo."
            : "Preencha o formulário para agendar uma nova consulta."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ... (o resto do formulário JSX continua o mesmo) ... */}
          <div className="space-y-2">
            <Label htmlFor="paciente">Nome do Paciente</Label>
            <Input id="paciente" {...register("paciente")} />
            {errors.paciente && <p className="text-sm text-red-600">{errors.paciente.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medico">Nome do Médico</Label>
            <Input id="medico" {...register("medico")} />
            {errors.medico && <p className="text-sm text-red-600">{errors.medico.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input id="especialidade" {...register("especialidade")} />
            {errors.especialidade && <p className="text-sm text-red-600">{errors.especialidade.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data e Hora</Label>
            <Input id="data" type="datetime-local" {...register("data")} />
            {errors.data && <p className="text-sm text-red-600">{errors.data.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas (Opcional)</Label>
            <Textarea id="notas" {...register("notas")} />
            {errors.notas && <p className="text-sm text-red-600">{errors.notas.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Consulta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}