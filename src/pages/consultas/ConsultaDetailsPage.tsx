import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Edit, Stethoscope, Trash2, User } from "lucide-react";

import { useConsultasStore } from "@/store/consultasStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, badgeVariants } from "@/components/ui/Badge"; // Importe badgeVariants
import { Button } from "@/components/ui/Button";
import type { VariantProps } from "class-variance-authority"; // Importe VariantProps

// Criamos o tipo para as variantes do Badge
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export function ConsultaDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getConsultaById, deleteConsulta } = useConsultasStore();

  if (!id) {
    return <div>ID da consulta não fornecido.</div>;
  }

  const consulta = getConsultaById(id);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita.")) {
      await deleteConsulta(id); // Agora passamos a string diretamente
      toast.success("Consulta excluída com sucesso!");
      navigate("/");
    }
  };
  
  // A função agora retorna nosso tipo específico
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case "Agendada": return "default";
      case "Realizada": return "secondary";
      case "Cancelada": return "destructive";
      default: return "outline";
    }
  };

  if (!consulta) {
    // Adiciona um pequeno delay para a store carregar, caso o usuário chegue direto na URL
    // Idealmente, você teria um estado de 'loading' aqui
    return <div>Consulta não encontrada ou carregando...</div>;
  }

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Detalhes da Consulta</CardTitle>
              <CardDescription>Informações completas da consulta agendada.</CardDescription>
            </div>
            {/* Removemos o "as any" */}
            <Badge variant={getStatusVariant(consulta.status)}>{consulta.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Paciente</p>
                <p className="text-muted-foreground">{consulta.paciente}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Médico</p>
                <p className="text-muted-foreground">{consulta.medico}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Especialidade</p>
                <p className="text-muted-foreground">{consulta.especialidade}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Data e Hora</p>
                <p className="text-muted-foreground">{new Date(consulta.data).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
          
          {consulta.notas && (
             <div>
                <p className="font-semibold text-sm mb-2">Notas Adicionais</p>
                <div className="p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
                  {consulta.notas}
                </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </Button>
            <Link to={`/consultas/${id}/editar`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" /> Editar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}