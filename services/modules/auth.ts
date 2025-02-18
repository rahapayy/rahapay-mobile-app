import { AxiosInstance } from "axios";
import {
  IOnboardingDto,
  IVerifyEmailDto,
  ILoginDto,
  IForgotPasswordDto,
  IResetPasswordDto,
  ICreatePinDto,
  IReAuthenticateDto,
  IRefreshTokenDto,
  IRefreshTokenResponseDto,
  IVerifyResetDto,
} from "@/services/dtos";
import { UserInfoType } from "@/services/dtos/user";
import { IResponse } from "@/types/general";

class AuthServices {
  constructor(private readonly baseService: AxiosInstance) {}

  async onboarding(
    payload: IOnboardingDto
  ): Promise<IResponse<{ success: boolean; data: UserInfoType }>> {
    const response = await this.baseService.post("/auth/onboarding", payload);
    return response.data;
  }

  async login(payload: ILoginDto): Promise<IResponse<UserInfoType>> {
    const response = await this.baseService.post("/auth/login", payload);
    return response.data;
  }

  async verifyEmail(payload: IVerifyEmailDto) {
    const response = await this.baseService.post("/auth/verify-email", payload);
    return response.data;
  }

  async resendOtp(id: string) {
    const response = await this.baseService.post("/auth/resend-otp", { id });
    return response.data;
  }

  async forgotPassword(payload: IForgotPasswordDto) {
    const response = await this.baseService.post(
      "/auth/forgot-password",
      payload
    );
    return response.data;
  }

  async verifyResetOtp(payload: IVerifyResetDto) {
    const response = await this.baseService.post(
      "/auth/verify/reset-otp",
      payload
    );
    return response.data;
  }

  async resetPassword(payload: IResetPasswordDto) {
    const response = await this.baseService.patch(
      "/auth/reset-password",
      payload
    );
    return response.data;
  }

  async createPin(payload: ICreatePinDto) {
    const response = await this.baseService.post("/auth/create-pin", payload);
    return response.data;
  }

  async reauthenticate(payload: IReAuthenticateDto) {
    const response = await this.baseService.post(
      "/auth/re-authenticate",
      payload
    );
    return response.data;
  }

  async refreshToken(
    payload: IRefreshTokenDto
  ): Promise<IRefreshTokenResponseDto> {
    const response = await this.baseService.post(
      "/auth/refresh-token",
      payload
    );
    return response.data;
  }

  async getUserDetails(): Promise<IResponse<UserInfoType>> {
    const response = await this.baseService.get("/user/me");
    return response.data;
  }

  async logout() {
    const response = await this.baseService.post("/auth/logout");
    return response.data;
  }
}

export default AuthServices;
