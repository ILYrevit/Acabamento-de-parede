import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { DataItem } from "@/types/data";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { calculateRevenue } from "@/utils/pricing";
import { extractBlock } from "@/lib/dataUtils";

interface DataGridProps {
    data: DataItem[];
}

export const DataGrid = ({ data }: DataGridProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAcabamento, setFilterAcabamento] = useState<string>("all");
    const [filterBlock, setFilterBlock] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Get unique acabamentos and blocks for filter
    const acabamentos = useMemo(() => {
        const unique = Array.from(new Set(data.map(item => item.ACABAMENTO)));
        return unique.sort();
    }, [data]);

    const blocks = useMemo(() => {
        const unique = Array.from(new Set(data.map(item => extractBlock(item.LOCAL))));
        return unique.sort((a, b) => {
            // Ordena blocos em ordem numérica crescente (B1, B2, ..., B14)
            const aNum = parseInt(a.replace('B', '')) || 999;
            const bNum = parseInt(b.replace('B', '')) || 999;
            return aNum - bNum;
        });
    }, [data]);

    // Filter and search data
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch =
                item.LOCAL.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ACABAMENTO.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ITEM.toString().includes(searchTerm);

            const matchesAcabamento =
                filterAcabamento === "all" || item.ACABAMENTO === filterAcabamento;

            const matchesBlock =
                filterBlock === "all" || extractBlock(item.LOCAL) === filterBlock;

            return matchesSearch && matchesAcabamento && matchesBlock;
        });
    }, [data, searchTerm, filterAcabamento, filterBlock]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, filterAcabamento, filterBlock]);

    return (
        <Card className="border border-orange-200/50 dark:border-orange-900/50 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                        <Table2 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-foreground">Planilha de Dados Completa</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    Visualização detalhada de todos os itens de acabamento
                </p>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por local, acabamento ou item..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={filterBlock} onValueChange={setFilterBlock}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Filtrar bloco" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os blocos</SelectItem>
                                {blocks.map((block) => (
                                    <SelectItem key={block} value={block}>
                                        {block}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-64">
                        <Select value={filterAcabamento} onValueChange={setFilterAcabamento}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Filtrar acabamento" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os acabamentos</SelectItem>
                                {acabamentos.map((acabamento) => (
                                    <SelectItem key={acabamento} value={acabamento}>
                                        {acabamento.length > 40 ? acabamento.substring(0, 40) + "..." : acabamento}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-4 text-sm text-muted-foreground">
                    Mostrando {paginatedData.length} de {filteredData.length} itens
                    {filteredData.length !== data.length && ` (${data.length} total)`}
                </div>

                {/* Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Local
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Acabamento
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Perímetro (m)
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Altura (m)
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Área (m²)
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                        Faturamento
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {paginatedData.map((item, index) => (
                                    <tr
                                        key={item.ITEM}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                                            {item.ITEM}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-foreground">
                                            {item.LOCAL}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs">
                                            <div className="truncate" title={item.ACABAMENTO}>
                                                {item.ACABAMENTO}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-foreground">
                                            {item.PERIMETRO.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-foreground">
                                            {item.ALTURA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                                            {item.AREA_CALCULADA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold text-primary">
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(calculateRevenue(item))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="gap-1"
                            >
                                Próxima
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
