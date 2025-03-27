// services/modules/data.ts
import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";

export interface DataPurchasePayload {
  planId: string;
  networkType: string;
  phoneNumber: string;
  saveBeneficiary: boolean;
  transactionPin: string;
}

export interface DataPurchaseResponse {
  status: "success" | "failed";
  msg: string;
  amount: string;
}

export interface DataPlan {
  plan_id: string;
  network: string;
  plan_name: string;
  plan_type: string;
  validity: string;
  amount: string;
  basePrice: string;
}

class DataService {
  constructor(private readonly baseService: AxiosInstance) {}

  async purchaseData(
    payload: DataPurchasePayload
  ): Promise<IResponse<DataPurchaseResponse>> {
    const response = await this.baseService.post("/top-up/data", payload);
    return response.data;
  }

  async getDataPlans(networkType: string): Promise<DataPlan[]> {
    try {
      const response = await this.baseService.get(
        `/top-up/get-plan?networkType=${encodeURIComponent(networkType)}`
      );

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data plans");
    }
  }
}

export default DataService;
