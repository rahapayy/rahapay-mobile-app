import { IResponse } from "../../types/general";

interface UserInfoType {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  data: {
    id: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
  };
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface IOnboardingDto {
  fullName: string;
}

export interface IRefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginDto {}

export interface IForgotPasswordOTPDto {}

export interface IVerifyEmailDto {
  email: string;
}

export interface User {}
