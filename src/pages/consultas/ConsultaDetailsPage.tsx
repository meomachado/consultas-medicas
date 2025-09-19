import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useConsultasStore } from "../../store/consultasStore";
import { consultasService } from "../../services/consultasService";
import type { Consulta } from "../../types/Consulta";
// CORREÇÃO: Importando os componentes de UI do App.tsx.
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "../../App";
import { ArrowLeft } from "lucide-react";


export function ConsultaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const deleteConsulta = useConsultasStore(state => state.deleteConsulta);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      consultasService.getById(Number(id))
        .then(setConsulta)
        .catch(() => {
            toast.error("Consulta não encontrada.");
            navigate('/');
        });
    }
  }, [id, navigate]);
  
  const handleDelete = async () => {
      if (consulta) {
          await deleteConsulta(consulta.id);
          navigate('/');
      }
  };

  if (!consulta) return <div className="text-center p-6">Carregando...</div>;

  return (
    <>
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard
        </Button>
      </div>
      <Card className="w-full max-w-3xl mx-auto shadow-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Detalhes da Consulta</CardTitle>
              <CardDescription>
                Agendada para {new Date(consulta.data).toLocaleDateString('pt-BR')} às {new Date(consulta.data).toLocaleTimeString('pt-BR', {timeStyle: 'short'})}
              </CardDescription>
            </div>
             <Badge status={consulta.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Paciente</p><p className="text-lg font-semibold">{consulta.paciente}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Médico</p><p className="text-lg font-semibold">{consulta.medico}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Especialidade</p><p className="text-lg font-semibold">{consulta.especialidade}</p></div>
            </div>
             <div className="space-y-1 border-t pt-6">
                <p className="text-sm font-medium text-muted-foreground">Notas</p>
                <p className="text-foreground whitespace-pre-wrap">{consulta.notas || 'Nenhuma nota adicional.'}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Link to={`/consultas/${consulta.id}/editar`}>
                <Button variant="outline">Editar</Button>
              </Link>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>Excluir</Button>
            </div>
        </CardContent>
      </Card>
      
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <Card className="w-full max-w-md">
                 <CardHeader>
                    <CardTitle>Confirmar Exclusão</CardTitle>
                    <CardDescription>
                        Tem certeza que deseja excluir a consulta do paciente <strong>{consulta.paciente}</strong>? Esta ação não pode ser desfeita.
                    </CardDescription>
                 </CardHeader>
                 <CardContent className="flex justify-end gap-2">
                     <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                     <Button variant="destructive" onClick={handleDelete}>Confirmar Exclusão</Button>
                 </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}