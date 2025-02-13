import { AxiosInstance } from "axios";
import { IResponse } from "@/types/general";

class DeviceToken {
  constructor(private readonly baseService: AxiosInstance) {}

  async sendDeviceToken(token: string): Promise<IResponse<void>> {
    const response = await this.baseService.patch(
      "/notification/device-token",
      {
        deviceToken: token,
      }
    );
    return response.data;
  }
}

export default DeviceToken;
