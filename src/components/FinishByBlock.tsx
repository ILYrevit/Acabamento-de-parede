import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { groupByBlockAndFinish } from "@/lib/dataUtils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FinishByBlockProps {
  data: DataItem[];
}

export const FinishByBlock = ({ data }: FinishByBlockProps) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const blockData = groupByBlockAndFinish(data);

  const toggleBlock = (block: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(block)) {
      newExpanded.delete(block);
    } else {
      newExpanded.add(block);
    }
    setExpandedBlocks(newExpanded);
  };

  const toggleAll = () => {
    if (expandedBlocks.size === blockData.length) {
      setExpandedBlocks(new Set());
    } else {
      setExpandedBlocks(new Set(blockData.map(b => b.block)));
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Totais por Bloco e Acabamento</CardTitle>
            <CardDescription>Área total de cada acabamento separada por bloco</CardDescription>
          </div>
          <button
            onClick={toggleAll}
            className="text-sm text-primary hover:underline"
          >
            {expandedBlocks.size === blockData.length ? 'Recolher Todos' : 'Expandir Todos'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {blockData.map((blockInfo) => {
            const isExpanded = expandedBlocks.has(blockInfo.block);
            const blockTotal = blockInfo.finishes.reduce((sum, f) => sum + f.totalArea, 0);
            const blockItems = blockInfo.finishes.reduce((sum, f) => sum + f.items, 0);

            return (
              <div key={blockInfo.block} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleBlock(blockInfo.block)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-primary">
                      {blockInfo.block}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {blockInfo.finishes.length} acabamentos • {blockTotal.toFixed(2)} m² • {blockItems} itens
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-card">
                    <div className="space-y-2">
                      {blockInfo.finishes.map((finish, index) => (
                        <div
                          key={`${blockInfo.block}-${finish.finish}`}
                          className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {finish.finish}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {finish.items} {finish.items === 1 ? 'item' : 'itens'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {finish.totalArea.toFixed(2)} m²
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {((finish.totalArea / blockTotal) * 100).toFixed(1)}% do bloco
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total do Bloco
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {blockTotal.toFixed(2)} m²
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {blockData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
};
