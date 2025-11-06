import { DataItem } from "@/types/data";

// Normaliza acabamentos para unificar variações e não especificados
export const normalizeFinish = (finish: string): string => {
  const trimmed = finish.trim();
  
  // Unifica acabamentos não especificados
  if (trimmed.includes('!!!!') || trimmed.includes('????') || trimmed.toLowerCase().includes('não especificad')) {
    return 'NÃO ESPECIFICADA EM PROJETO';
  }
  
  // Remove espaços extras e normaliza
  return trimmed.replace(/\s+/g, ' ');
};

// Extrai o bloco do local (B1, B2, etc)
export const extractBlock = (local: string): string => {
  const match = local.match(/^(B\d+)/);
  return match ? match[1] : 'Outros';
};

// Gera uma cor consistente para cada tipo de acabamento
export const getFinishColor = (finish: string): string => {
  const normalizedFinish = normalizeFinish(finish);
  const colors = [
    'bg-blue-100 dark:bg-blue-950/30',
    'bg-green-100 dark:bg-green-950/30',
    'bg-purple-100 dark:bg-purple-950/30',
    'bg-orange-100 dark:bg-orange-950/30',
    'bg-pink-100 dark:bg-pink-950/30',
    'bg-yellow-100 dark:bg-yellow-950/30',
    'bg-cyan-100 dark:bg-cyan-950/30',
    'bg-indigo-100 dark:bg-indigo-950/30',
    'bg-red-100 dark:bg-red-950/30',
    'bg-teal-100 dark:bg-teal-950/30',
  ];
  
  // Gera um hash simples da string para escolher uma cor consistente
  let hash = 0;
  for (let i = 0; i < normalizedFinish.length; i++) {
    hash = normalizedFinish.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Normaliza os dados aplicando a normalização de acabamentos
export const normalizeData = (data: DataItem[]): DataItem[] => {
  return data.map(item => ({
    ...item,
    ACABAMENTO: normalizeFinish(item.ACABAMENTO),
    LOCAL: item.LOCAL.trim()
  }));
};

// Agrupa dados por bloco
export const groupByBlock = (data: DataItem[]) => {
  const blocks = new Map<string, {
    totalArea: number;
    items: number;
    finishes: Set<string>;
  }>();
  
  data.forEach(item => {
    const block = extractBlock(item.LOCAL);
    if (!blocks.has(block)) {
      blocks.set(block, {
        totalArea: 0,
        items: 0,
        finishes: new Set()
      });
    }
    
    const blockData = blocks.get(block)!;
    blockData.totalArea += item.AREA_CALCULADA;
    blockData.items += 1;
    blockData.finishes.add(item.ACABAMENTO);
  });
  
  return Array.from(blocks.entries()).map(([block, data]) => ({
    block,
    totalArea: data.totalArea,
    items: data.items,
    finishes: data.finishes.size
  })).sort((a, b) => {
    // Ordena por número do bloco
    const aNum = parseInt(a.block.replace('B', ''));
    const bNum = parseInt(b.block.replace('B', ''));
    return aNum - bNum;
  });
};

// Exporta dados para CSV
export const exportToCSV = (data: DataItem[], filename: string = 'dados_acabamentos.csv') => {
  const headers = ['ITEM', 'LOCAL', 'PERÍMETRO', 'ALTURA', 'ACABAMENTO', 'ÁREA CALCULADA'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.ITEM,
      `"${item.LOCAL}"`,
      item.PERIMETRO,
      item.ALTURA,
      `"${item.ACABAMENTO}"`,
      item.AREA_CALCULADA
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
