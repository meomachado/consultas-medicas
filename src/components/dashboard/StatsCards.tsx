// src/components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Stethoscope, Calendar, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  total: number;
  agendadasHoje: number;
  realizadas: number;
  loading: boolean;
}

export function StatsCards({ total, agendadasHoje, realizadas, loading }: StatsCardsProps) {
  const stats = [
    { title: "Consultas Totais", value: total, icon: Stethoscope, description: "Registradas no sistema" },
    { title: "Agendadas para Hoje", value: agendadasHoje, icon: Calendar, description: "Consultas a serem realizadas hoje" },
    { title: "Consultas Concluídas", value: realizadas, icon: CheckCircle, description: "Total de consultas já realizadas" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}