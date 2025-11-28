import { DataItem } from "@/types/data";

export const getPricePerSqm = (finish: string): number => {
    const upperFinish = finish.toUpperCase();

    if (upperFinish.includes("PINTURA ACRÍLICA") || upperFinish.includes("LATEX")) {
        return 35.05;
    }
    if (upperFinish.includes("CERÂMICA") || upperFinish.includes("PORCELANATO")) {
        return 247.81;
    }
    if (upperFinish.includes("EPÓXI")) {
        return 66.21;
    }
};

export const calculateRevenue = (item: DataItem): number => {
    const price = getPricePerSqm(item.ACABAMENTO);
    return item.AREA_CALCULADA * price;
};
