import { Dashboard } from "@/components/Dashboard";
import { RevenueChart } from "@/components/RevenueChart";
import { BuildingMap } from "@/components/BuildingMap";
import { DataTable } from "@/components/DataTable";
import { ExecutionTracker } from "@/components/ExecutionTracker";
import { DataGrid } from "@/components/DataGrid";
import { DataItem } from "@/types/data";
import rawData from "@/data/dados_estruturados_1.json";
import { Building2 } from "lucide-react";
import { normalizeData } from "@/lib/dataUtils";
import { CompletionProvider } from "@/contexts/CompletionContext";
import { PhotoProvider } from "@/contexts/PhotoContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const Index = () => {
  const data = normalizeData(rawData as DataItem[]);

  return (
    <CompletionProvider>
      <PhotoProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-orange-200/50 dark:border-orange-900/50 bg-gradient-to-r from-white via-orange-50/40 to-red-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Augusto Velloso" className="h-12 w-auto" />
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Análise de Acabamentos de Parede
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Gerenciamento e visualização de dados de construção
                  </p>
                </div>
              </div>
              <ThemeToggle />
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

          {/* Data Grid - Full Width */}
          <div className="mb-8">
            <DataGrid data={data} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-orange-200/50 dark:border-orange-900/50 bg-gradient-to-r from-white via-orange-50/40 to-red-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Criado por Higor Ramos
            </p>
          </div>
        </footer>
        </div>
      </PhotoProvider>
    </CompletionProvider>
  );
};

export default Index;
