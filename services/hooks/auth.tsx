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
    { success: boolean },
    IErrorResponse<{ message: string }>,
    IOnboardingDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.onboarding(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useLogin = () => {
  return useMutation<
    UserInfoType,
    IErrorResponse<{ message: string }>,
    ILoginDto
  >({
    mutationFn: async (payload: ILoginDto) => {
      const response = await services.authService.login(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useForgotPassword = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    IForgotPasswordDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.forgotPassword(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useVerifyEmail = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    IVerifyEmailDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.verifyEmail(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useResetPassword = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    IResetPasswordDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.resetPassword(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useCreatePin = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    ICreatePinDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.createPin(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useResendOTP = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    { email: string }
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.resendOtp(payload.email);
      return response.data;
    },
    onError: handleError,
  });
};

export const useVerifyResetOtp = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    IVerifyEmailDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.verifyResetOtp(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useReAuthenticate = () => {
  return useMutation<
    { success: boolean },
    IErrorResponse<{ message: string }>,
    IReAuthenticateDto
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.reauthenticate(payload);
      return response.data;
    },
    onError: handleError,
  });
};

export const useRefreshToken = () => {
  return useMutation<
    IRefreshTokenResponseDto,
    IErrorResponse<{ message: string }>,
    { refreshToken: string }
  >({
    mutationFn: async (payload) => {
      const response = await services.authService.refreshToken(payload);
      return response;
    },
    onError: handleError,
  });
};
