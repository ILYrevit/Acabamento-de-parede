import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { Building2, Layers, Maximize, Ruler } from "lucide-react";
import { calculateRevenue } from "@/utils/pricing";

interface DashboardProps {
  data: DataItem[];
}

export const Dashboard = ({ data }: DashboardProps) => {
  const totalArea = data.reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
  const totalItems = data.length;
  const uniqueFinishes = new Set(data.map(item => item.ACABAMENTO)).size;
  const avgArea = totalArea / totalItems;
  const totalRevenue = data.reduce((sum, item) => sum + calculateRevenue(item), 0);

  const stats = [
    {
      title: "Área Total",
      value: `${totalArea.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`,
      icon: Maximize,
      description: "Soma de todas as áreas",
      gradient: "from-orange-400 to-orange-500",
      bgGradient: "from-orange-50/50 to-orange-100/50 dark:from-orange-950/10 dark:to-orange-900/10"
    },
    {
      title: "Total de Itens",
      value: totalItems.toString(),
      icon: Layers,
      description: "Ambientes cadastrados",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-100/50 to-orange-200/50 dark:from-orange-900/10 dark:to-orange-800/10"
    },
    {
      title: "Tipos de Acabamento",
      value: uniqueFinishes.toString(),
      icon: Building2,
      description: "Acabamentos únicos",
      gradient: "from-orange-600 to-red-500",
      bgGradient: "from-orange-200/50 to-red-100/50 dark:from-orange-800/10 dark:to-red-900/10"
    },
    {
      title: "Faturamento Total",
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue),
      icon: Ruler,
      description: "Estimativa de receita",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-100/50 to-red-200/50 dark:from-red-900/10 dark:to-red-800/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`border-0 bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
