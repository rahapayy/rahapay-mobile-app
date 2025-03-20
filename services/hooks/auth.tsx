import { useMutation } from "@tanstack/react-query";
import { services } from "@/services";
import type { IErrorResponse, IResponse } from "../../types/general";
import {
  IOnboardingDto,
  ILoginDto,
  IForgotPasswordDto,
  IVerifyEmailDto,
  IResetPasswordDto,
  ICreatePinDto,
  IReAuthenticateDto,
  IRefreshTokenDto,
  IRefreshTokenResponseDto,
} from "../dtos";
import { UserInfoType } from "@/services/dtos/user";
import { handleError } from "../handleError";

export const useOnboarding = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    IOnboardingDto
  >({
    mutationFn: (payload) => services.authService.onboarding(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useLogin = () => {
  return useMutation<
    IResponse<UserInfoType>,
    IErrorResponse<{ message: string }>,
    ILoginDto
  >({
    mutationFn: (payload: ILoginDto) => services.authService.login(payload),
    onSuccess: async (response: IResponse<UserInfoType>) => response.data,
    onError: handleError,
  });
};

export const useForgotPassword = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    IForgotPasswordDto
  >({
    mutationFn: (payload) => services.authService.forgotPassword(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useVerifyEmail = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    IVerifyEmailDto
  >({
    mutationFn: (payload) => services.authService.verifyEmail(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useResetPassword = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    IResetPasswordDto
  >({
    mutationFn: (payload) => services.authService.resetPassword(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useCreatePin = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    ICreatePinDto
  >({
    mutationFn: (payload) => services.authService.createPin(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useResendOTP = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    { email: string } // assuming payload only contains email for resending otp
  >({
    mutationFn: (payload) => services.authService.resendOtp(payload.email),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useVerifyResetOtp = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    IVerifyEmailDto // assuming IVerifyEmailDto and IForgotPasswordOTPDto have the same structure
  >({
    mutationFn: (payload) => services.authService.verifyResetOtp(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useReAuthenticate = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    IReAuthenticateDto
  >({
    mutationFn: (payload) => services.authService.reauthenticate(payload),
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};

export const useRefreshToken = () => {
  return useMutation<
    IResponse<IRefreshTokenResponseDto>,
    IErrorResponse<{ message: string }>,
    IRefreshTokenDto
  >({
    mutationFn: async (payload: IRefreshTokenDto) => {
      // Call the refreshToken service method
      const response = await services.authService.refreshToken(payload);
      console.log("Server response:", response);
      // Wrap the response in the IResponse format if the service doesn't already
      return {
        data: response, // Assuming response is IRefreshTokenResponseDto
        message: "Token refreshed successfully",
        success: true,
      } as IResponse<IRefreshTokenResponseDto>;
    },
    onSuccess: async (response) => response.data,
    onError: handleError,
  });
};
