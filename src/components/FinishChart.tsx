import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FinishChartProps {
  data: DataItem[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export const FinishChart = ({ data }: FinishChartProps) => {
  const finishGroups = data.reduce((acc, item) => {
    const finish = item.ACABAMENTO;
    if (!acc[finish]) {
      acc[finish] = { name: finish, value: 0, count: 0 };
    }
    acc[finish].value += item.AREA_CALCULADA;
    acc[finish].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const chartData = Object.values(finishGroups)
    .map(item => ({
      name: item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name,
      value: Number(item.value.toFixed(2)),
      count: item.count
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Distribuição por Acabamento</CardTitle>
        <CardDescription>Área total por tipo de acabamento</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(2)} m² (${props.payload.count} itens)`,
                'Área Total'
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
