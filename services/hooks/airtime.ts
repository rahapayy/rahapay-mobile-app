// services/hooks/airtime.ts
import { useMutation } from "@tanstack/react-query";
import { services } from "@/services";
import { handleError } from "../handleError";
import { IAirtimePurchasePayload } from "../modules/airtime";

export const useAirtimePurchase = () => {
  return useMutation({
    mutationFn: (payload: IAirtimePurchasePayload) => 
      services.airtimeService.purchaseAirtime(payload),
    onError: (error) => handleError(error),
  });
};