// services/modules/airtime.ts
import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";

export interface IAirtimePurchasePayload {
  amount: number;
  networkType: string;
  phoneNumber: string;
}

interface AirtimeResponse {
  status: "success" | "failed";
  msg: string;
  amount: string;
}

class AirtimeService {
  constructor(private readonly baseService: AxiosInstance) {}

  async purchaseAirtime(
    payload: IAirtimePurchasePayload
  ): Promise<IResponse<AirtimeResponse>> {
    const response = await this.baseService.post("/top-up/airtime", payload);
    return response.data;
  }
}

export default AirtimeService;
