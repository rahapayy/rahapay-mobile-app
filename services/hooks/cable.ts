// services/hooks/cable.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { services } from "@/services";
import { handleError } from "../handleError";
import {
  CablePurchasePayload,
  ValidateCablePayload,
} from "../modules/cable";

export const useCablePlans = (cableName: string) => {
  return useQuery({
    queryKey: ["cablePlans", cableName],
    queryFn: () => services.cableService.getCablePlans(cableName),
    onError: (error: unknown) => handleError(error),
    select: (data) => data.data, // Extract the plans array from IResponse
  });
};

export const usePurchaseCable = () => {
  return useMutation({
    mutationFn: (payload: CablePurchasePayload) =>
      services.cableService.purchaseCable(payload),
    onError: (error) => handleError(error),
  });
};

export const useValidateCableIuc = () => {
  return useMutation({
    mutationFn: (payload: ValidateCablePayload) =>
      services.cableService.validateCableIuc(payload),
    onError: (error) => handleError(error),
  });
};