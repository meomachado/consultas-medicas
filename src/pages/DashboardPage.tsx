import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { useConsultasStore } from "@/store/consultasStore";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ConsultasList } from "@/components/dashboard/ConsultasList";
import { Button } from "@/components/ui/Button";
// --- A CORREÇÃO ESTÁ AQUI ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"; // Adicionamos CardDescription
// -----------------------------
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export function DashboardPage() {
  const {
    consultas,
    loading,
    fetchConsultas,
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

  const stats = useMemo(() => {
    const hoje = new Date().toDateString();
    
    const agendadasHoje = consultas.filter(c => 
        new Date(c.data).toDateString() === hoje && c.status === 'Agendada'
    ).length;
    
    return {
      total: consultas.length,
      realizadas: consultas.filter(c => c.status === 'Realizada').length,
      agendadasHoje: agendadasHoje,
    };
  }, [consultas]);

  const especialidades = useMemo(() => {
    const todasAsEspecialidades = consultas.map((c) => c.especialidade);
    return ["Todas", ...Array.from(new Set(todasAsEspecialidades))];
  }, [consultas]);

  const filteredConsultas = useMemo(() => {
    return consultas.filter((c) => {
      const matchSearch =
        c.paciente.toLowerCase().includes(search.toLowerCase()) ||
        c.medico.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todas" ? true : c.status === statusFilter;
      const matchEspecialidade = especialidadeFilter === "Todas" ? true : c.especialidade === especialidadeFilter;
      
      return matchSearch && matchStatus && matchEspecialidade;
    });
  }, [consultas, search, statusFilter, especialidadeFilter]);


  return (
    <div className="space-y-6">
      <StatsCards 
        total={stats.total} 
        agendadasHoje={stats.agendadasHoje} 
        realizadas={stats.realizadas} 
        loading={loading} 
      />

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Consultas</CardTitle>
              <CardDescription>Gerencie todas as consultas agendadas.</CardDescription>
            </div>
            <Link to="/consultas/nova">
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Nova Consulta
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input 
              placeholder="Buscar por paciente ou médico..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-1"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Status</SelectItem>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Realizada">Realizada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por especialidade" />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp === "Todas" ? "Todas as Especialidades" : esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ConsultasList consultas={filteredConsultas} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}