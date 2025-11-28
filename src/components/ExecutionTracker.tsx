import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock, Filter, Camera, X, Image as ImageIcon } from "lucide-react";
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
import { usePhotos } from "@/contexts/PhotoContext";

interface ExecutionTrackerProps {
  data: DataItem[];
}

export const ExecutionTracker = ({ data }: ExecutionTrackerProps) => {
  const { completedItems: completed, toggleItem } = useCompletion();
  const { addPhoto, removePhoto, getPhotos } = usePhotos();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [passwordError, setPasswordError] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedFinish, setSelectedFinish] = useState<string>("all");
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedItemForPhoto, setSelectedItemForPhoto] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoClick = (itemId: number) => {
    setSelectedItemForPhoto(itemId);
    setShowPhotoDialog(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedItemForPhoto) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          addPhoto(selectedItemForPhoto, reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (itemId: number, photoIndex: number) => {
    removePhoto(itemId, photoIndex);
  };

  // Extrai blocos e acabamentos únicos para os filtros
  const blocks = Array.from(new Set(data.map(item => extractBlock(item.LOCAL)))).sort((a, b) => {
    // Ordena blocos em ordem numérica crescente (B1, B2, ..., B14)
    const aNum = parseInt(a.replace('B', '')) || 999;
    const bNum = parseInt(b.replace('B', '')) || 999;
    return aNum - bNum;
  });
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
    <Card className="border border-orange-200/50 dark:border-orange-900/50 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <Lock className="h-5 w-5 text-white" />
          </div>
          Acompanhamento de Execução
          <Badge variant="secondary">
            {completedItems}/{totalItems}
          </Badge>
        </CardTitle>
        <CardDescription className="mt-2">
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
            <span className="font-semibold">{areaPercentage.toFixed(1)}% ({totalCompletedArea.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²)</span>
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
              filteredData.map((item) => {
                const photos = getPhotos(item.ITEM);
                const hasPhotos = photos.length > 0;
                return (
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
                        {item.ACABAMENTO} • {item.AREA_CALCULADA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
                      </p>
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePhotoClick(item.ITEM)}
                      className="shrink-0 h-8 w-8 p-0 relative"
                      title="Adicionar/Ver fotos"
                    >
                      <Camera className={`h-4 w-4 ${hasPhotos ? 'text-primary' : 'text-muted-foreground'}`} />
                      {hasPhotos && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                        >
                          {photos.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                );
              })
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

      {/* Dialog de Fotos */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Fotos do Ambiente
            </DialogTitle>
            <DialogDescription>
              {selectedItemForPhoto && `Item ${selectedItemForPhoto} - ${data.find(d => d.ITEM === selectedItemForPhoto)?.LOCAL}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
            >
              <Camera className="h-4 w-4 mr-2" />
              Adicionar Fotos
            </Button>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              {selectedItemForPhoto && getPhotos(selectedItemForPhoto).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {getPhotos(selectedItemForPhoto).map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        onClick={() => selectedItemForPhoto && handleRemovePhoto(selectedItemForPhoto, index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma foto adicionada ainda</p>
                  <p className="text-xs mt-1">Clique no botão acima para adicionar fotos</p>
                </div>
              )}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowPhotoDialog(false);
                setSelectedItemForPhoto(null);
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
