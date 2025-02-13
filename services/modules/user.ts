import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";
import { IUpdateProfilePayload } from "../dtos";

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
}

export default UserServices;
