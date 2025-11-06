import { Dashboard } from "@/components/Dashboard";
import { AreaChart } from "@/components/AreaChart";
import { FinishChart } from "@/components/FinishChart";
import { DataTable } from "@/components/DataTable";
import { BlocksChart } from "@/components/BlocksChart";
import { ExecutionTracker } from "@/components/ExecutionTracker";
import { DataItem } from "@/types/data";
import rawData from "@/data/dados_estruturados_1.json";
import { Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeData, exportToCSV } from "@/lib/dataUtils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const data = normalizeData(rawData as DataItem[]);

  const handleExport = () => {
    exportToCSV(data);
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso para CSV.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Análise de Acabamentos
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerenciamento e visualização de dados de construção
                </p>
              </div>
            </div>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Dados
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <Dashboard data={data} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AreaChart data={data} />
          <FinishChart data={data} />
        </div>

        {/* Blocks Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BlocksChart data={data} />
          <ExecutionTracker data={data} />
        </div>

        {/* Data Table */}
        <DataTable data={data} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Dashboard de Análise de Acabamentos © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
