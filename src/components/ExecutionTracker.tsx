import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface ExecutionTrackerProps {
  data: DataItem[];
}

export const ExecutionTracker = ({ data }: ExecutionTrackerProps) => {
  const [completed, setCompleted] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('executionTracker');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('executionTracker', JSON.stringify(Array.from(completed)));
  }, [completed]);

  const toggleItem = (itemId: number) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const totalItems = data.length;
  const completedItems = completed.size;
  const percentage = (completedItems / totalItems) * 100;
  const totalCompletedArea = data
    .filter(item => completed.has(item.ITEM))
    .reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
  const totalArea = data.reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
  const areaPercentage = (totalCompletedArea / totalArea) * 100;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Acompanhamento de Execução
          <Badge variant="secondary">
            {completedItems}/{totalItems}
          </Badge>
        </CardTitle>
        <CardDescription>
          Marque os itens conforme forem executados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso por Itens</span>
            <span className="font-semibold">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso por Área</span>
            <span className="font-semibold">{areaPercentage.toFixed(1)}% ({totalCompletedArea.toFixed(2)} m²)</span>
          </div>
          <Progress value={areaPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Executado</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-2xl font-bold">{completedItems}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pendente</p>
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">{totalItems - completedItems}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.ITEM}
                className={`flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors ${
                  completed.has(item.ITEM) ? 'opacity-60' : ''
                }`}
              >
                <Checkbox
                  id={`item-${item.ITEM}`}
                  checked={completed.has(item.ITEM)}
                  onCheckedChange={() => toggleItem(item.ITEM)}
                  className="mt-1"
                />
                <label
                  htmlFor={`item-${item.ITEM}`}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {item.ITEM}. {item.LOCAL}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.ACABAMENTO} • {item.AREA_CALCULADA.toFixed(2)} m²
                  </p>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
