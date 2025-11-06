import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AreaChartProps {
  data: DataItem[];
}

export const AreaChart = ({ data }: AreaChartProps) => {
  // Top 10 areas by size
  const chartData = [...data]
    .sort((a, b) => b.AREA_CALCULADA - a.AREA_CALCULADA)
    .slice(0, 10)
    .map(item => ({
      name: item.LOCAL.length > 20 ? item.LOCAL.substring(0, 20) + "..." : item.LOCAL,
      area: Number(item.AREA_CALCULADA.toFixed(2)),
      perimetro: Number(item.PERIMETRO.toFixed(2))
    }));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Top 10 Maiores Áreas</CardTitle>
        <CardDescription>Ambientes ordenados por área calculada</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
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
            <Bar dataKey="area" fill="hsl(var(--primary))" name="Área (m²)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="perimetro" fill="hsl(var(--accent))" name="Perímetro (m)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
