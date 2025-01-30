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
} from "../dtos";

class AuthServices {
  private readonly baseService: AxiosInstance;

  constructor(baseService: AxiosInstance) {
    this.baseService = baseService;
  }

  onboarding = async (payload: IOnboardingDto) => {
    return this.baseService.post("/auth/onboarding", payload);
  };

  verifyEmail = async (payload: IVerifyEmailDto) => {
    return this.baseService.post("/auth/verify-email", payload);
  };

  resendOtp = async (email: string) => {
    return this.baseService.post("/auth/resend-otp", { email });
  };

  login = async (payload: ILoginDto) => {
    return this.baseService.post("/auth/login", payload);
  };

  forgotPassword = async (payload: IForgotPasswordDto) => {
    return this.baseService.post("/auth/forgot-password", payload);
  };

  verifyResetOtp = async (payload: IVerifyEmailDto) => {
    return this.baseService.post("/auth/verify/reset-otp", payload);
  };

  resetPassword = async (payload: IResetPasswordDto) => {
    return this.baseService.post("/auth/reset-password", payload);
  };

  createPin = async (payload: ICreatePinDto) => {
    return this.baseService.post("/auth/create-pin", payload);
  };

  reAuthenticate = async (payload: IReAuthenticateDto) => {
    return this.baseService.post("/auth/re-authenticate", payload);
  };

  refreshToken = async (payload: IRefreshTokenDto) => {
    const response = await this.baseService.post("/auth/refresh-token", payload);
    return response.data as IRefreshTokenResponseDto;
  };
}

export default AuthServices;
