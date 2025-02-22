// services/modules/electricity.ts
import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";

export interface Disco {
  id: string;
  name: string;
}

export interface ValidateElectricityPayload {
  meterNumber: string;
  meterId: string;
  meterType: "PREPAID" | "POSTPAID";
}

export interface ValidateElectricityResponse {
  name: string;
  status: "success" | "failed";
  msg: string;
}

export interface ElectricityPurchasePayload {
  meterNumber: string;
  amount: number;
  discoId: string;
}

export interface ElectricityPurchaseResponse {
  status: "success" | "failed";
  msg: string;
  amount: number;
  [key: string]: any; // Allow for additional fields
}

class ElectricityService {
  constructor(private readonly baseService: AxiosInstance) {}

  async getDiscos(): Promise<IResponse<Disco[]>> {
    const response = await this.baseService.get("/electricity/discos");
    return response.data;
  }

  async validateMeter(
    payload: ValidateElectricityPayload
  ): Promise<IResponse<ValidateElectricityResponse>> {
    const response = await this.baseService.post(
      "/electricity/validate",
      payload
    );
    return response.data;
  }

  async purchaseElectricity(
    payload: ElectricityPurchasePayload
  ): Promise<IResponse<ElectricityPurchaseResponse>> {
    const response = await this.baseService.post("/electricity", payload);
    return response.data;
  }
}

export default ElectricityService;
