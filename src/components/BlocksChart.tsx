import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { groupByBlock } from "@/lib/dataUtils";

interface BlocksChartProps {
  data: DataItem[];
}

export const BlocksChart = ({ data }: BlocksChartProps) => {
  const chartData = groupByBlock(data);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Análise por Bloco</CardTitle>
        <CardDescription>Área total e quantidade de itens por bloco da obra</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="block" 
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="totalArea" fill="hsl(var(--primary))" name="Área Total (m²)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="items" fill="hsl(var(--accent))" name="Quantidade de Itens" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
