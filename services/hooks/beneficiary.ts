// services/hooks/beneficiary.ts
import { useQuery } from "@tanstack/react-query";
import { services } from "@/services";
import { handleError } from "../handleError";
import { Beneficiary } from "../modules/beneficiary";

export const useBeneficiaries = (service: "airtime" | "data") => {
  return useQuery({
    queryKey: ["beneficiaries", service], // Unique key per service type
    queryFn: () => services.beneficiaryService.getBeneficiaries(service),
    onError: (error: unknown) => handleError(error),
    select: (data) => data.data, // Extract the beneficiaries array from IResponse
  });
};
