import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractBlock } from "@/lib/dataUtils";
import { useCompletion } from "@/contexts/CompletionContext";

interface ExecutionTrackerProps {
  data: DataItem[];
}

export const ExecutionTracker = ({ data }: ExecutionTrackerProps) => {
  const { completedItems: completed, toggleItem } = useCompletion();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [passwordError, setPasswordError] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedFinish, setSelectedFinish] = useState<string>("all");

  const handleCheckboxClick = (itemId: number) => {
    setPendingItemId(itemId);
    setShowPasswordDialog(true);
    setPassword("");
    setPasswordError(false);
  };

  const handlePasswordSubmit = () => {
    if (password === "32245") {
      if (pendingItemId !== null) {
        toggleItem(pendingItemId);
      }
      setShowPasswordDialog(false);
      setPassword("");
      setPendingItemId(null);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  // Extrai blocos e acabamentos únicos para os filtros
  const blocks = Array.from(new Set(data.map(item => extractBlock(item.LOCAL)))).sort();
  const finishes = Array.from(new Set(data.map(item => item.ACABAMENTO))).sort();

  // Filtra os dados baseado nos filtros selecionados
  const filteredData = data.filter(item => {
    const blockMatch = selectedBlock === "all" || extractBlock(item.LOCAL) === selectedBlock;
    const finishMatch = selectedFinish === "all" || item.ACABAMENTO === selectedFinish;
    return blockMatch && finishMatch;
  });

  const totalItems = filteredData.length;
  const completedItems = filteredData.filter(item => completed.has(item.ITEM)).length;
  const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const totalCompletedArea = filteredData
    .filter(item => completed.has(item.ITEM))
    .reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
  const totalArea = filteredData.reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
  const areaPercentage = totalArea > 0 ? (totalCompletedArea / totalArea) * 100 : 0;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Acompanhamento de Execução
          <Badge variant="secondary">
            {completedItems}/{totalItems}
          </Badge>
        </CardTitle>
        <CardDescription>
          Marque os itens conforme forem executados (protegido por senha)
        </CardDescription>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por bloco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os blocos</SelectItem>
                {blocks.map(block => (
                  <SelectItem key={block} value={block}>{block}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedFinish} onValueChange={setSelectedFinish}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por acabamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os acabamentos</SelectItem>
                {finishes.map(finish => (
                  <SelectItem key={finish} value={finish}>
                    {finish.length > 30 ? finish.substring(0, 30) + "..." : finish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
            {filteredData.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhum item encontrado com os filtros selecionados
              </div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item.ITEM}
                  className={`flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors ${completed.has(item.ITEM) ? 'opacity-60' : ''
                    }`}
                >
                  <Checkbox
                    id={`item-${item.ITEM}`}
                    checked={completed.has(item.ITEM)}
                    onCheckedChange={() => handleCheckboxClick(item.ITEM)}
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
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Dialog de Senha */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Autenticação Necessária
            </DialogTitle>
            <DialogDescription>
              Digite a senha para marcar/desmarcar itens como executados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              onKeyPress={handleKeyPress}
              className={passwordError ? "border-red-500" : ""}
              autoFocus
            />
            {passwordError && (
              <p className="text-sm text-red-500">Senha incorreta. Tente novamente.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword("");
                setPendingItemId(null);
                setPasswordError(false);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
