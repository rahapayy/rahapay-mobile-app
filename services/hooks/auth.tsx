import { useMutation } from "@tanstack/react-query";
import { services } from "../../services";
import type { IErrorResponse, IResponse } from "../../types/general";
import {
  IForgotPasswordOTPDto,
  ILoginDto,
  ISignUpDto,
  IVerifyEmailDto,
} from "../dtos";
import { handleError } from "../handleError";

export const useSignup = () => {
  return useMutation<
    IResponse<{ success: boolean }>, // Success response
    IErrorResponse<{ message: string }>, // Error response
    ISignUpDto
  >({
    mutationFn: (payload) => services.authService.signUpWithOtp(payload),
    onSuccess: async (response) => {
      return response.data;
    },
    onError: (error: any) => {
      console.error(error ? error?.message : "Something went wrong");
    },
  });
};

export const useSignupWithToken = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    ISignUpDto
  >({
    mutationFn: (payload) => services.authService.signUpWithToken(payload),
    onSuccess: async (response) => {
      return response.data;
    },
    onError: (error: any) => {
      console.error(error ? error?.message : "Something went wrong");
    },
  });
};

export const useLogin = () => {
  return useMutation<
    IResponse<{ success: boolean }>,
    IErrorResponse<{ message: string }>,
    ILoginDto
  >({
    mutationFn: (payload) => services.authService.login(payload),
    onSuccess: async (response) => {
      return response.data;
    },
    onError: (error: any) => {
      console.error(error ? error?.message : "Something went wrong");
    },
  });
};


export const useForgotPasswordOtp = () => {
  return useMutation<
    IResponse<{ success: boolean }>, // Success response
    IErrorResponse<{ message: string }>, // Error response
    IForgotPasswordOTPDto // The data payload for the mutation
  >({
    mutationFn: (payload: IForgotPasswordOTPDto) =>
      services.authService.forgotPasswordOtp(payload),
    onSuccess: async (response) => {
      // Handle successful OTP verification and password reset
    },
    onError: (error: any) => {
      console.error(error ? error?.message : "An error occurred");
    },
  });
};
