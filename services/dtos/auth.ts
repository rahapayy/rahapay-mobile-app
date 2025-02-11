// import { IResponse } from "../../../types/general";

export interface UserInfoType {
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
  email: string;
  password: string;
  countryCode: string;
  fullName: string;
  phoneNumber: string;
  referral: string;
}

export interface IRefreshTokenDto {
  refreshToken: string;
}

export interface IRefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginDto {
  id: string;
  password: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IVerifyResetDto {
  otp: string;
}

export interface IVerifyEmailDto {
  otp: string;
  email: string;
}

export interface IResetPasswordDto {
  resetToken: string;
  password: string;
}

export interface ICreatePinDto {
  securityPin: string;
  transactionPin: string;
}

export interface IReAuthenticateDto {
  pin: string;
}
