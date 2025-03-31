import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";
import { IUpdateUserCredentials, IUpdateProfilePayload } from "../dtos/user";
import { IResetTransactionPinVerifyDto } from "../dtos";

class UserServices {
  constructor(private readonly baseService: AxiosInstance) {}

  async suggestUsername(
    numberOfSuggestions: number
  ): Promise<IResponse<{ suggestedUserNames: string[] }>> {
    const response = await this.baseService.get(
      `/user/suggest-username?numberOfSuggestions=${numberOfSuggestions}`
    );
    return response.data;
  }

  async updateUsername(payload: {
    userName: string;
  }): Promise<IResponse<void>> {
    const response = await this.baseService.patch("/user/username", payload);
    return response.data;
  }

  async updateProfile(
    payload: IUpdateProfilePayload
  ): Promise<IResponse<void>> {
    const response = await this.baseService.patch(
      "/user/update/profile",
      payload
    );
    return response.data;
  }

  async updateCredentials(
    payload: IUpdateUserCredentials
  ): Promise<IResponse<void>> {
    const response = await this.baseService.patch(
      "/user/update/credentials",
      payload
    );
    return response.data;
  }

  async requestTransactionPinReset(): Promise<IResponse<{ success: boolean }>> {
    const response = await this.baseService.post(
      "/auth/reset-transaction-pin/request"
    );
    return response.data;
  }

  async verifyTransactionPinReset(
    payload: IResetTransactionPinVerifyDto
  ): Promise<IResponse<{ success: boolean }>> {
    const response = await this.baseService.post(
      "/auth/reset-transaction-pin/verify",
      payload
    );
    return response.data;
  }
}

export default UserServices;
