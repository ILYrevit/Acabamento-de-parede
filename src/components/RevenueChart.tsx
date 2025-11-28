import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/types/data";
import { DollarSign, TrendingUp } from "lucide-react";

interface RevenueChartProps {
    data: DataItem[];
}

// Pricing configuration
const PRICING = {
    "PINTURA ACRÍLICA LATEX": [
        { name: "APLICAÇÃO E LIXAMENTO DE MASSA LÁTEX", price: 14.98 },
        { name: "APLICAÇÃO MANUAL DE PINTURA COM TINTA LÁTEX ACRÍLICA", price: 15.07 }
    ],
    "PINTURA TEXTURA ACRILICA": [
        { name: "PINTURA TEXTURA ACRÍLICA", price: 13.59 }
    ],
    "CERÂMICA RETIFICADA BRANCA": [
        { name: "REVESTIMENTO CERÂMICO PARA PISO OU PAREDE, 30 X 90", price: 247.81 }
    ],
    "PINTURA EPÓXI": [
        { name: "APLICAÇÃO E LIXAMENTO DE MASSA LÁTEX", price: 14.98 },
        { name: "PINTURA DE PAREDE COM TINTA EPÓXI", price: 51.23 }
    ]
};

export const RevenueChart = ({ data }: RevenueChartProps) => {
    // Calculate revenue by finish type
    const revenueByFinish = data.reduce((acc, item) => {
        const finishType = item.ACABAMENTO.toUpperCase();
        const area = item.AREA_CALCULADA;

        // Find matching pricing
        let matchedKey = "";
        for (const key of Object.keys(PRICING)) {
            if (finishType.includes(key.toUpperCase())) {
                matchedKey = key;
                break;
            }
        }

        if (matchedKey) {
            if (!acc[matchedKey]) {
                acc[matchedKey] = {
                    totalArea: 0,
                    items: PRICING[matchedKey as keyof typeof PRICING].map(p => ({
                        name: p.name,
                        price: p.price,
                        revenue: 0
                    })),
                    totalRevenue: 0
                };
            }

            acc[matchedKey].totalArea += area;
            acc[matchedKey].items.forEach(priceItem => {
                priceItem.revenue += area * priceItem.price;
            });
            acc[matchedKey].totalRevenue = acc[matchedKey].items.reduce((sum, i) => sum + i.revenue, 0);
        }

        return acc;
    }, {} as Record<string, {
        totalArea: number;
        items: Array<{ name: string; price: number; revenue: number }>;
        totalRevenue: number;
    }>);

    const sortedFinishes = Object.entries(revenueByFinish)
        .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue);

    return (
        <Card className="border border-orange-200/50 dark:border-orange-900/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                        <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-foreground">Faturamento por Acabamento</CardTitle>
                </div>
                <CardDescription className="mt-2">Cálculo baseado em m² por tipo de acabamento</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {sortedFinishes.map(([finishType, finishData], index) => (
                        <div
                            key={finishType}
                            className="p-4 rounded-lg border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            style={{
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 -2px 4px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        {finishType}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Área total: {finishData.totalArea.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-primary">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-lg font-bold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finishData.totalRevenue)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                </div>
                            </div>

                            <div className="space-y-2 mt-3 pt-3 border-t border-border/50">
                                {finishData.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center text-xs p-2 rounded bg-background/50 hover:bg-background transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-muted-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}/m²</p>
                                        </div>
                                        <div className="text-right font-semibold text-primary">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.revenue)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {sortedFinishes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Nenhum dado de faturamento disponível</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
