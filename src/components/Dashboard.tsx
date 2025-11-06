import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { Building2, Layers, Maximize, Ruler } from "lucide-react";

interface DashboardProps {
  data: DataItem[];
}

export const Dashboard = ({ data }: DashboardProps) => {
  const totalArea = data.reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
  const totalItems = data.length;
  const uniqueFinishes = new Set(data.map(item => item.ACABAMENTO)).size;
  const avgArea = totalArea / totalItems;

  const stats = [
    {
      title: "Área Total",
      value: `${totalArea.toFixed(2)} m²`,
      icon: Maximize,
      description: "Soma de todas as áreas"
    },
    {
      title: "Total de Itens",
      value: totalItems.toString(),
      icon: Layers,
      description: "Ambientes cadastrados"
    },
    {
      title: "Tipos de Acabamento",
      value: uniqueFinishes.toString(),
      icon: Building2,
      description: "Acabamentos únicos"
    },
    {
      title: "Área Média",
      value: `${avgArea.toFixed(2)} m²`,
      icon: Ruler,
      description: "Por ambiente"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
