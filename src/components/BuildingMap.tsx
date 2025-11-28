import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Info } from "lucide-react";
import { DataItem } from "@/types/data";
import { useState } from "react";
import { calculateRevenue } from "@/utils/pricing";
import { useClickSound } from "@/hooks/useClickSound";
import { useCompletion } from "@/contexts/CompletionContext";

interface BuildingMapProps {
    data: DataItem[];
}

// Block definitions based on the floor‑plan image
const BLOCKS = [
    // Top row
    { id: "14", name: "ADMINISTRATIVO", x: 0, y: 10, width: 130, height: 80 },
    { id: "13", name: "BANCO DE SANGUE", x: 140, y: 10, width: 120, height: 80 },
    { id: "12", name: "RECEPÇÃO", x: 280, y: 10, width: 180, height: 90 },
    { id: "11", name: "AMBULATÓRIO", x: 470, y: 20, width: 90, height: 140 },
    // Second row
    { id: "08", name: "INTERNAÇÃO", x: 10, y: 130, width: 70, height: 210 },
    { id: "07", name: "U.T.I PEDIATRIA E NEONATAL", x: 90, y: 130, width: 170, height: 210 },
    { id: "10", name: "CAPELA", x: 270, y: 110, width: 190, height: 70 },
    { id: "09", name: "PRONTO ATENDIMENTO", x: 470, y: 170, width: 140, height: 80 },
    // Third row
    { id: "06", name: "U.T.I ADULTO", x: 270, y: 190, width: 190, height: 150 },
    { id: "05", name: "EMERGÊNCIA", x: 470, y: 260, width: 110, height: 70 },
    // Fourth row
    { id: "03", name: "CENTRO OBSTÉTRICO", x: 10, y: 350, width: 290, height: 180 },
    { id: "04", name: "CENTRO CIRÚRGICO", x: 310, y: 350, width: 250, height: 110 },
    // Bottom row
    { id: "02", name: "VESTIÁRIOS", x: 160, y: 540, width: 140, height: 140 },
    { id: "01", name: "SERVIÇOS", x: 340, y: 470, width: 250, height: 210 },
];

// Block item ranges based on user specification
const BLOCK_RANGES: Record<string, { start: number; end: number }> = {
    "01": { start: 1, end: 64 },
    "02": { start: 65, end: 83 },
    "03A": { start: 84, end: 204 },
    "03B": { start: 84, end: 204 },
    "03C": { start: 84, end: 204 },
    "04": { start: 205, end: 251 },
    "05": { start: 252, end: 266 },
    "06": { start: 267, end: 361 },
    "07": { start: 362, end: 484 },
    "08": { start: 485, end: 522 },
    "09": { start: 523, end: 554 },
    "10": { start: 555, end: 558 },
    "11": { start: 559, end: 596 },
    "12": { start: 597, end: 659 },
    "13": { start: 660, end: 690 },
    "14": { start: 691, end: 711 },
};

export const BuildingMap = ({ data }: BuildingMapProps) => {
    const [selectedBlock, setSelectedBlock] = useState<typeof BLOCKS[0] | null>(null);
    const { playClick } = useClickSound();
    const { completedItems } = useCompletion();

    const getBlockStats = (blockId: string) => {
        // Handle block 03 which has sub-blocks 03A, 03B, 03C
        let range = BLOCK_RANGES[blockId];
        if (!range && blockId === "03") {
            // Use 03A as the primary range for block 03
            range = BLOCK_RANGES["03A"];
        }

        if (!range) {
            return { totalArea: 0, totalRevenue: 0, finishBreakdown: [] };
        }

        const blockData = data.filter(item => {
            return item.ITEM >= range.start && item.ITEM <= range.end;
        });

        const totalArea = blockData.reduce((sum, item) => sum + item.AREA_CALCULADA, 0);
        const totalRevenue = blockData.reduce((sum, item) => sum + calculateRevenue(item), 0);

        // Group by finish type
        const finishMap = blockData.reduce((acc, item) => {
            const finish = item.ACABAMENTO;
            if (!acc[finish]) {
                acc[finish] = { area: 0, revenue: 0, totalItems: 0, completedItems: 0 };
            }
            acc[finish].area += item.AREA_CALCULADA;
            acc[finish].revenue += calculateRevenue(item);
            acc[finish].totalItems++;
            if (completedItems.has(item.ITEM)) {
                acc[finish].completedItems++;
            }
            return acc;
        }, {} as Record<string, { area: number; revenue: number; totalItems: number; completedItems: number }>);

        const finishBreakdown = Object.entries(finishMap).map(([finish, stats]) => ({
            finish,
            area: stats.area,
            revenue: stats.revenue,
            completionPercentage: stats.totalItems > 0 ? (stats.completedItems / stats.totalItems) * 100 : 0,
        }));

        return { totalArea, totalRevenue, finishBreakdown };
    };

    const handleBlockClick = (block: typeof BLOCKS[0]) => {
        playClick();
        setSelectedBlock(block);
    };

    const selectedStats = selectedBlock ? getBlockStats(selectedBlock.id) : null;

    return (
        <Card className="border border-orange-200/50 dark:border-orange-900/50 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-foreground">Mapa da Construção</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section - Takes up 2 columns */}
                    <div className="lg:col-span-2 relative w-full bg-muted/20 rounded-lg p-4">
                        <svg viewBox="0 0 640 690" className="w-full h-auto" style={{ maxHeight: "600px" }}>
                            {/* Background */}
                            <rect width="640" height="640" fill="hsl(var(--background))" />
                            {/* Grid pattern */}
                            <defs>
                                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.1" />
                                </pattern>
                                {/* 3D Shadow filters */}
                                <filter id="shadow3d" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                    <feOffset dx="4" dy="4" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <filter id="shadow3dHover" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                                    <feOffset dx="2" dy="2" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.4" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                {/* Gradient for 3D effect */}
                                <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                                    <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.3" />
                                </linearGradient>
                                <linearGradient id="blockGradientSelected" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            <rect width="640" height="640" fill="url(#smallGrid)" />
                            {/* Render blocks */}
                            {BLOCKS.map(block => {
                                const isSelected = selectedBlock?.id === block.id;
                                return (
                                    <g key={block.id} onClick={() => handleBlockClick(block)} className="cursor-pointer group">
                                        {/* Bottom shadow layer for 3D depth */}
                                        <rect
                                            x={block.x + 3}
                                            y={block.y + 3}
                                            width={block.width}
                                            height={block.height}
                                            fill="rgba(0,0,0,0.15)"
                                            rx="4"
                                            className="transition-all duration-300"
                                        />
                                        {/* Main block with gradient */}
                                        <rect
                                            x={block.x}
                                            y={block.y}
                                            width={block.width}
                                            height={block.height}
                                            fill={isSelected ? "url(#blockGradientSelected)" : "url(#blockGradient)"}
                                            stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                                            strokeWidth={isSelected ? 3 : 2}
                                            rx="4"
                                            filter="url(#shadow3d)"
                                            className="transition-all duration-300 group-hover:stroke-primary"
                                            style={{ filter: 'url(#shadow3d)' }}
                                        />
                                        {/* Top highlight for 3D effect */}
                                        <rect
                                            x={block.x + 2}
                                            y={block.y + 2}
                                            width={block.width - 4}
                                            height={block.height * 0.3}
                                            fill="white"
                                            fillOpacity="0.3"
                                            rx="2"
                                            className="pointer-events-none transition-all duration-300 group-hover:fill-primary/20"
                                        />
                                        <text
                                            x={block.x + block.width / 2}
                                            y={
                                                block.id === "03C"
                                                    ? block.y + block.height / 2 - 15
                                                    : block.id === "03B"
                                                        ? block.y + block.height / 2 + 15
                                                        : block.y + block.height / 2
                                            }
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className={`font-bold pointer-events-none select-none transition-colors ${isSelected ? "fill-primary" : "fill-foreground"} group-hover:fill-primary`}
                                            style={{ fontSize: block.width > 100 ? "13px" : "10px", fontWeight: "700" }}
                                        >
                                            BLOCO {block.id}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Details Section - Takes up 1 column */}
                    <div className="lg:col-span-1 flex flex-col h-full">
                        <div className="h-full rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col justify-center items-center text-center">
                            {selectedBlock && selectedStats ? (
                                <div className="space-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                                            <Building2 className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Bloco {selectedBlock.id}</h3>
                                        <p className="text-muted-foreground font-medium">{selectedBlock.name}</p>
                                    </div>

                                    <div className="space-y-4 w-full">
                                        <div className="p-4 rounded-lg bg-muted/50 border border-border transition-all hover:bg-muted/80">
                                            <p className="text-sm text-muted-foreground mb-1">Área Total de Acabamento</p>
                                            <p className="text-3xl font-bold text-foreground">{selectedStats.totalArea.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">m²</span></p>
                                        </div>

                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                                            <p className="text-sm text-primary/80 mb-1">Faturamento Estimado</p>
                                            <p className="text-3xl font-bold text-primary">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedStats.totalRevenue)}
                                            </p>
                                        </div>

                                        {/* Finish Breakdown */}
                                        {selectedStats.finishBreakdown.length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-border">
                                                <h4 className="text-sm font-semibold text-foreground mb-3 text-left">Acabamentos</h4>
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                    {selectedStats.finishBreakdown.map((finish, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="text-xs font-medium text-foreground text-left flex-1">
                                                                    {finish.finish.length > 35 ? finish.finish.substring(0, 35) + "..." : finish.finish}
                                                                </p>
                                                                <span className="text-xs font-bold text-primary ml-2">
                                                                    {finish.completionPercentage.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                <div className="text-left">
                                                                    <span className="text-muted-foreground">Área: </span>
                                                                    <span className="font-semibold">{finish.area.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-muted-foreground">Valor: </span>
                                                                    <span className="font-semibold text-primary">
                                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finish.revenue)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 text-muted-foreground animate-in fade-in duration-300">
                                    <div className="p-4 rounded-full bg-muted w-fit mx-auto">
                                        <Info className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Nenhum bloco selecionado</h3>
                                        <p className="text-sm mt-2 max-w-[200px] mx-auto">
                                            Clique em um bloco no mapa para visualizar os detalhes de área e faturamento.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
