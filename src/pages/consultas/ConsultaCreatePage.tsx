import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultaSchema } from "../../lib/validation/consulta.schema";
import type { ConsultaFormData } from "../../lib/validation/consulta.schema";
import { consultasService } from "../../services/consultasService";
import { useNavigate } from "react-router-dom";

export function ConsultaCreatePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema)
  });

  const onSubmit = async (data: ConsultaFormData) => {
    const nova = await consultasService.create(data);
    navigate(`/consultas/${nova.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Nova Consulta</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Paciente</label>
            <input
              {...register("paciente")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2"
              placeholder="Nome do paciente"
            />
            {errors.paciente && <p className="text-red-500 text-sm">{errors.paciente.message}</p>}
          </div>

          {/* Médico */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do médico</label>
            <input
              {...register("medico")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2"
              placeholder="Nome do médico"
            />
            {errors.medico && <p className="text-red-500 text-sm">{errors.medico.message}</p>}
          </div>

          {/* Especialidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidade</label>
            <input
              {...register("especialidade")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2"
              placeholder="Ex: Cardiologia"
            />
            {errors.especialidade && <p className="text-red-500 text-sm">{errors.especialidade.message}</p>}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              {...register("data")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2"
            />
            {errors.data && <p className="text-red-500 text-sm">{errors.data.message}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register("status")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2"
            >
              <option value="Agendada">Agendada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              {...register("notas")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2"
              placeholder="Observações adicionais"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}