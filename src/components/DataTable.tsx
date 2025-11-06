import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataItem } from "@/types/data";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  data: DataItem[];
}

type SortField = keyof DataItem | null;
type SortDirection = 'asc' | 'desc';

export const DataTable = ({ data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: keyof DataItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      item.LOCAL.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ACABAMENTO.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Tabela de Dados</CardTitle>
        <CardDescription>
          {filteredAndSortedData.length} de {data.length} itens
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por local ou acabamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSort('ITEM')}
                      className="h-8 px-2"
                    >
                      Item
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSort('LOCAL')}
                      className="h-8 px-2"
                    >
                      Local
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSort('PERIMETRO')}
                      className="h-8 px-2"
                    >
                      Perímetro (m)
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSort('ALTURA')}
                      className="h-8 px-2"
                    >
                      Altura (m)
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Acabamento</TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSort('AREA_CALCULADA')}
                      className="h-8 px-2"
                    >
                      Área (m²)
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum resultado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((item) => (
                    <TableRow key={item.ITEM} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{item.ITEM}</TableCell>
                      <TableCell className="font-medium">{item.LOCAL}</TableCell>
                      <TableCell className="text-right">{item.PERIMETRO.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.ALTURA.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{item.ACABAMENTO}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.AREA_CALCULADA.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
