// import { IResponse } from "../../../types/general";

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

export interface IResetTransactionPinRequestDto {
  // No payload needed based on your description
}

export interface IResetTransactionPinVerifyDto {
  otp: string;
  newPin: string;
}
