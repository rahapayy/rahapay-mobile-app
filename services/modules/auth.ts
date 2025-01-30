import { AxiosInstance } from "axios";
import {
  IForgotPasswordOTPDto,
  ILoginDto,
  IRefreshTokenDto,
  IRefreshTokenResponseDto,
  ISignUpDto,
} from "../dtos";

class AuthServices {
  private readonly baseService: AxiosInstance;

  constructor(baseService: AxiosInstance) {
    this.baseService = baseService;
  }

  signUpWithOtp = async (payload: ISignUpDto) => {
    const response = await this.baseService.post("/auth/signup-otp", payload);
    return response;
  };

  signUpWithToken = async (payload: ISignUpDto) => {
    const response = await this.baseService.post("/auth/signup-token", payload);
    return response;
  };

  // Login and session management
  login = async (payload: ILoginDto) => {
    const response = await this.baseService.post("/auth/login", payload);
    return response;
  };

  // Password management
  forgotPasswordOtp = async (payload: IForgotPasswordOTPDto) => {
    const response = await this.baseService.post(
      "/auth/forgot-password-otp",
      payload
    );
    return response;
  };

  refreshToken = async (payload: IRefreshTokenDto) => {
    const response = await this.baseService.post("/auth/refresh", payload);
    console.log(this.refreshToken);
    return response.data as IRefreshTokenResponseDto;
  };
}

export default AuthServices;
