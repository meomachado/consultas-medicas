import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultaSchema } from "../../lib/validation/consulta.schema";
import type { ConsultaFormData } from "../../lib/validation/consulta.schema";
import { consultasService } from "../../services/consultasService";
import { useNavigate, useParams } from "react-router-dom";
import type { Consulta } from "../../types/Consulta";

export function ConsultaEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<Consulta | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema)
  });

  // Buscar consulta e preencher formulário
  useEffect(() => {
    if (id) {
      consultasService.getById(Number(id)).then((data) => {
        setConsulta(data);
        reset({
          paciente: data.paciente,
          medico: data.medico,
          especialidade: data.especialidade,
          data: data.data.slice(0, 16), // ajustar para datetime-local
          status: data.status,
          notas: data.notas
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: ConsultaFormData) => {
    if (!id) return;
    await consultasService.update(Number(id), data);
    navigate(`/consultas/${id}`);
  };

  if (!consulta) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar Consulta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register("paciente")} placeholder="Paciente" className="border p-2 w-full" />
          {errors.paciente && <p className="text-red-500">{errors.paciente.message}</p>}
        </div>

        <div>
          <input {...register("medico")} placeholder="Médico" className="border p-2 w-full" />
          {errors.medico && <p className="text-red-500">{errors.medico.message}</p>}
        </div>

        <div>
          <input {...register("especialidade")} placeholder="Especialidade" className="border p-2 w-full" />
          {errors.especialidade && <p className="text-red-500">{errors.especialidade.message}</p>}
        </div>

        <div>
          <input type="datetime-local" {...register("data")} className="border p-2 w-full" />
          {errors.data && <p className="text-red-500">{errors.data.message}</p>}
        </div>

        <div>
          <select {...register("status")} className="border p-2 w-full">
            <option value="Agendada">Agendada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}
        </div>

        <div>
          <textarea {...register("notas")} placeholder="Notas" className="border p-2 w-full" />
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}