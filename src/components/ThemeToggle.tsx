import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="border-orange-200/50 dark:border-orange-900/50"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="border-orange-200/50 dark:border-orange-900/50 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-orange-500" />
      ) : (
        <Moon className="h-5 w-5 text-orange-600" />
      )}
    </Button>
  );
}
