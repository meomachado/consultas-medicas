import { useEffect, useMemo } from "react";
import { useConsultasStore } from "../../store/consultasStore";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const {
    consultas,
    fetchConsultas,
    loading,
    search,
    statusFilter,
    especialidadeFilter,
    setSearch,
    setStatusFilter,
    setEspecialidadeFilter
  } = useConsultasStore();

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  const especialidades = useMemo(() => {
    const all = consultas.map((c) => c.especialidade);
    return ["Todas", ...Array.from(new Set(all))];
  }, [consultas]);

  if (loading) return <p className="text-center mt-8">Carregando consultas...</p>;

  const consultasFiltradas = consultas.filter((c) => {
    const matchSearch =
      c.paciente.toLowerCase().includes(search.toLowerCase()) ||
      c.medico.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todas" ? true : c.status === statusFilter;
    const matchEspecialidade = especialidadeFilter === "Todas" ? true : c.especialidade === especialidadeFilter;
    return matchSearch && matchStatus && matchEspecialidade;
  });

  return (
    // Container principal com padding
    <div className="container mx-auto p-4 md:p-6">
      
      {/* Card principal para agrupar o conteúdo */}
      <div className="bg-white p-6 rounded-lg shadow-md">

        {/* Cabeçalho da página */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Consultas</h1>
          <Link to="/consultas/nova" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold shadow">
            + Nova Consulta
          </Link>
        </div>

        {/* Barra de busca e filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por paciente ou médico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-1 md:col-span-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Agendada">Agendada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          <select
            value={especialidadeFilter}
            onChange={(e) => setEspecialidadeFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {especialidades.map((esp) => (
              <option key={esp} value={esp}>
                {esp === "Todas" ? "Todas as Especialidades" : esp}
              </option>
            ))}
          </select>
        </div>

        {/* Tabela com container para overflow em telas pequenas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="border-b-2 border-gray-200">
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Paciente</th>
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Médico</th>
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Especialidade</th>
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Data</th>
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {consultasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    Nenhuma consulta encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                consultasFiltradas.map((c) => (
                  <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <Link to={`/consultas/${c.id}`} className="text-blue-600 hover:underline font-semibold">
                        {c.paciente}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-700">{c.medico}</td>
                    <td className="p-3 text-gray-700">{c.especialidade}</td>
                    <td className="p-3 text-gray-700">{new Date(c.data).toLocaleString('pt-BR')}</td>
                    <td className="p-3 text-gray-700">{c.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}