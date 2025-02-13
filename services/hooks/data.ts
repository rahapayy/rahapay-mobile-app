// services/hooks/data.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { services } from "@/services";
import { handleError } from "../handleError";
import { DataPurchasePayload } from "../modules/data";

export const useDataPurchase = () => {
  return useMutation({
    mutationFn: (payload: DataPurchasePayload) =>
      services.dataService.purchaseData(payload),
    onError: (error) => handleError(error),
  });
};

export const useDataPlans = (networkType: string) => {
  return useQuery({
    queryKey: ["dataPlans", networkType],
    queryFn: () => services.dataService.getDataPlans(networkType),
    enabled: !!networkType,
  });
};
