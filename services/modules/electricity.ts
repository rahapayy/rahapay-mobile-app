import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";
import {
  Disco,
  ValidateElectricityPayload,
  ValidateElectricityResponse,
  ElectricityPurchasePayload,
  ElectricityPurchaseResponse,
  ElectricityRequeryPayload,
  ElectricityRequeryResponse,
} from "../dtos/electricity";

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

  async requeryElectricity(
    payload: ElectricityRequeryPayload
  ): Promise<IResponse<ElectricityRequeryResponse>> {
    const response = await this.baseService.post(
      "/electricity/requery",
      payload
    );
    return response.data;
  }
}

export default ElectricityService;
