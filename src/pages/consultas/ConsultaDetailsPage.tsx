import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { consultasService } from "../../services/consultasService";
import type { Consulta } from "../../types/Consulta";

export function ConsultaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<Consulta | null>(null);

  useEffect(() => {
    if (id) {
      consultasService.getById(Number(id)).then(setConsulta);
    }
  }, [id]);

  if (!consulta) return <p>Carregando...</p>;

  const handleDelete = async () => {
    await consultasService.remove(consulta.id);
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Detalhes da Consulta</h1>
      <p>
        <strong>Paciente:</strong> {consulta.paciente}
      </p>
      <p>
        <strong>Médico:</strong> {consulta.medico}
      </p>
      <p>
        <strong>Especialidade:</strong> {consulta.especialidade}
      </p>
      <p>
        <strong>Data:</strong> {new Date(consulta.data).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {consulta.status}
      </p>
      <p>
        <strong>Notas:</strong> {consulta.notas}
      </p>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
      >
        Excluir
      </button>
      <button
        onClick={() => navigate(`/consultas/${consulta.id}/editar`)}
        className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded ml-2" // usei ml-2 (margin-left) ao invés de mr-2
      >
        Editar
      </button>
    </div>
  );
}