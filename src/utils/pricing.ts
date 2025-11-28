import { DataItem } from "@/types/data";

export const getPricePerSqm = (finish: string): number => {
    const upperFinish = finish.toUpperCase();

    if (upperFinish.includes("PINTURA TEXTURA ACRÍLICA") || upperFinish.includes("PINTURA TEXTURA ACRILICA")) {
        return 13.59;
    }
    if (upperFinish.includes("PINTURA ACRÍLICA") || upperFinish.includes("LATEX")) {
        return 35.05;
    }
    // Check for PORCELANATO TÉCNICO first (before generic PORCELANATO)
    if (upperFinish.includes("PORCELANATO TÉCNICO") || upperFinish.includes("PORCELANATO TÉCNOCO")) {
        return 0;
    }
    if (upperFinish.includes("CERÂMICA") || upperFinish.includes("PORCELANATO")) {
        return 247.81;
    }
    if (upperFinish.includes("EPÓXI")) {
        return 66.21;
    }

    // Default return for unknown finish types
    return 0;
};

export const calculateRevenue = (item: DataItem): number => {
    const price = getPricePerSqm(item.ACABAMENTO);
    return item.AREA_CALCULADA * price;
};
