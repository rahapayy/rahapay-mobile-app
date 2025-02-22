// services/modules/beneficiary.ts
import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";

export interface Beneficiary {
  id: string;
  number: string;
  networkType?: string;
  service: string;
}

class BeneficiaryService {
  constructor(private readonly baseService: AxiosInstance) {}

  async getBeneficiaries(
    service: "airtime" | "data"
  ): Promise<IResponse<Beneficiary[]>> {
    const response = await this.baseService.get(
      `/beneficiary/me?service=${service}`
    );
    return response.data;
  }
}

export default BeneficiaryService;
