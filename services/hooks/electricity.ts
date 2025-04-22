// services/hooks/electricity.ts
import { useState, useCallback } from "react";
import ElectricityService from "../modules/electricity";
import {
  Disco,
  ValidateElectricityPayload,
  ValidateElectricityResponse,
  ElectricityPurchasePayload,
  ElectricityPurchaseResponse,
  ElectricityRequeryPayload,
  ElectricityRequeryResponse,
} from "../dtos/electricity";
import { IResponse } from "@/types/general";

interface UseDiscosResult {
  discos: Disco[] | null;
  loading: boolean;
  error: string | null;
  fetchDiscos: () => Promise<void>;
}

interface UseValidateMeterResult {
  validation: ValidateElectricityResponse | null;
  loading: boolean;
  error: string | null;
  validateMeter: (payload: ValidateElectricityPayload) => Promise<void>;
}

interface UsePurchaseElectricityResult {
  purchase: ElectricityPurchaseResponse | null;
  loading: boolean;
  error: string | null;
  purchaseElectricity: (payload: ElectricityPurchasePayload) => Promise<void>;
}

interface UseRequeryElectricityResult {
  requery: ElectricityRequeryResponse | null;
  loading: boolean;
  error: string | null;
  requeryElectricity: (payload: ElectricityRequeryPayload) => Promise<void>;
}

export const useDiscos = (
  electricityService: ElectricityService
): UseDiscosResult => {
  const [discos, setDiscos] = useState<Disco[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: IResponse<Disco[]> = await electricityService.getDiscos();
      if (response.status === "success") {
        setDiscos(response.data);
      } else {
        setError(response.msg || "Failed to fetch discos");
      }
    } catch (err) {
      setError("An error occurred while fetching discos");
    } finally {
      setLoading(false);
    }
  }, [electricityService]);

  return { discos, loading, error, fetchDiscos };
};

export const useValidateMeter = (
  electricityService: ElectricityService
): UseValidateMeterResult => {
  const [validation, setValidation] =
    useState<ValidateElectricityResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateMeter = useCallback(
    async (payload: ValidateElectricityPayload) => {
      setLoading(true);
      setError(null);
      try {
        const response: IResponse<ValidateElectricityResponse> =
          await electricityService.validateMeter(payload);
        if (response.status === "success") {
          setValidation(response.data);
        } else {
          setError(response.msg || "Failed to validate meter");
        }
      } catch (err) {
        setError("An error occurred while validating meter");
      } finally {
        setLoading(false);
      }
    },
    [electricityService]
  );

  return { validation, loading, error, validateMeter };
};

export const usePurchaseElectricity = (
  electricityService: ElectricityService
): UsePurchaseElectricityResult => {
  const [purchase, setPurchase] = useState<ElectricityPurchaseResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseElectricity = useCallback(
    async (payload: ElectricityPurchasePayload) => {
      setLoading(true);
      setError(null);
      try {
        const response: IResponse<ElectricityPurchaseResponse> =
          await electricityService.purchaseElectricity(payload);
        if (response.status === "success") {
          setPurchase(response.data);
        } else {
          setError(response.msg || "Failed to purchase electricity");
        }
      } catch (err) {
        setError("An error occurred while purchasing electricity");
      } finally {
        setLoading(false);
      }
    },
    [electricityService]
  );

  return { purchase, loading, error, purchaseElectricity };
};

export const useRequeryElectricity = (
  electricityService: ElectricityService
): UseRequeryElectricityResult => {
  const [requery, setRequery] = useState<ElectricityRequeryResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requeryElectricity = useCallback(
    async (payload: ElectricityRequeryPayload) => {
      setLoading(true);
      setError(null);
      try {
        const response: IResponse<ElectricityRequeryResponse> =
          await electricityService.requeryElectricity(payload);
        if (response.status === "success") {
          setRequery(response.data);
        } else {
          setError(response.message || "Failed to requery transaction");
        }
      } catch (err) {
        setError("An error occurred while requerying transaction");
      } finally {
        setLoading(false);
      }
    },
    [electricityService]
  );

  return { requery, loading, error, requeryElectricity };
};
