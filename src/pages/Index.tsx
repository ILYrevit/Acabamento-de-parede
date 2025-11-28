import { Dashboard } from "@/components/Dashboard";
import { RevenueChart } from "@/components/RevenueChart";
import { BuildingMap } from "@/components/BuildingMap";
import { DataTable } from "@/components/DataTable";
import { ExecutionTracker } from "@/components/ExecutionTracker";
import { DataItem } from "@/types/data";
import rawData from "@/data/dados_estruturados_1.json";
import { Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeData, exportToCSV } from "@/lib/dataUtils";
import { useToast } from "@/hooks/use-toast";
import { CompletionProvider } from "@/contexts/CompletionContext";

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
    <CompletionProvider>
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

          {/* Building Map - Full Width */}
          <div className="mb-8">
            <BuildingMap data={data} />
          </div>

          {/* Charts & Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart data={data} />
            <ExecutionTracker data={data} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Criado por Higor Ramos
            </p>
          </div>
        </footer>
      </div>
    </CompletionProvider>
  );
};

export default Index;
