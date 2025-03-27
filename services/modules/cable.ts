// services/modules/cable.ts
import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";

export interface CablePlan {
  planId: string;
  planName: string;
  price: number;
  cableName: string;
  transactionPin: string;
}

export interface CablePurchasePayload {
  cableName: string;
  planId: string;
  customerName?: string; // Optional as per your payload example
  smartCardNo: string;
}

export interface CablePurchaseResponse {
  status: "success" | "failed";
  msg: string;
  amount: string;
  [key: string]: any; // Allow for additional fields in response
}

export interface ValidateCablePayload {
  smartCardNo: string;
  cableName: string;
}

export interface ValidateCableResponse {
  customerName: string;
  status: "success" | "failed";
  msg: string;
}

class CableService {
  constructor(private readonly baseService: AxiosInstance) {}

  async getCablePlans(cableName: string): Promise<IResponse<CablePlan[]>> {
    const response = await this.baseService.get(
      `/cable/plans?cableName=${encodeURIComponent(cableName)}`
    );
    return response.data;
  }

  async purchaseCable(
    payload: CablePurchasePayload
  ): Promise<IResponse<CablePurchaseResponse>> {
    const response = await this.baseService.post("/cable", payload);
    return response.data;
  }

  async validateCableIuc(
    payload: ValidateCablePayload
  ): Promise<IResponse<ValidateCableResponse>> {
    const response = await this.baseService.post("/cable/validate", payload);
    return response.data;
  }
}

export default CableService;
