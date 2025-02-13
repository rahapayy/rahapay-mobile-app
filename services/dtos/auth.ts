// import { IResponse } from "../../../types/general";

export interface UserInfoType {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
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
  accessToken: string;
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
