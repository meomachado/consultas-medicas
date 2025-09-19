import { Link } from "react-router-dom";
import { Badge, badgeVariants } from "@/components/ui/Badge"; // Importe também o badgeVariants
import { Button } from "@/components/ui/Button";
import type { Consulta } from "@/types/Consulta";
import { ArrowRight } from "lucide-react";
import type { VariantProps } from "class-variance-authority"; // Importe o VariantProps

interface ConsultasListProps {
  consultas: Consulta[];
  loading: boolean;
}

// Criamos um tipo específico para as variantes do nosso Badge
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

// A função agora retorna o nosso tipo específico, e não uma string genérica
const getStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "Agendada":
      return "default";
    case "Realizada":
      return "secondary";
    case "Cancelada":
      return "destructive";
    default:
      return "outline";
  }
};

export function ConsultasList({ consultas, loading }: ConsultasListProps) {
  if (loading) {
    return <div className="text-center p-8">Carregando consultas...</div>;
  }

  if (consultas.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Nenhuma consulta encontrada.</div>;
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        {/* ... (cabeçalho da tabela continua o mesmo) ... */}
        <thead className="bg-muted/50">
          <tr className="border-b">
            <th className="p-3 text-left font-medium">Paciente</th>
            <th className="p-3 text-left font-medium hidden md:table-cell">Médico</th>
            <th className="p-3 text-left font-medium hidden lg:table-cell">Data</th>
            <th className="p-3 text-center font-medium">Status</th>
            <th className="p-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {consultas.map((c) => (
            <tr key={c.id} className="hover:bg-muted/50 transition-colors">
              <td className="p-3 font-medium">{c.paciente}</td>
              <td className="p-3 text-muted-foreground hidden md:table-cell">{c.medico}</td>
              <td className="p-3 text-muted-foreground hidden lg:table-cell">{new Date(c.data).toLocaleString('pt-BR')}</td>
              <td className="p-3 text-center">
                {/* Agora não precisamos mais do "as any"! */}
                <Badge variant={getStatusVariant(c.status)}>
                  {c.status}
                </Badge>
              </td>
              <td className="p-3 text-right">
                <Link to={`/consultas/${c.id}`}>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}