import { useMutation, useQueryClient } from "@tanstack/react-query";
import { services } from "@/services";
import { handleError } from "../handleError";
import { IUpdateProfilePayload } from "../dtos/user";
import { useAuth } from "../AuthContext";

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();
  const { setUserInfo } = useAuth();

  return useMutation({
    mutationFn: (payload: { userName: string }) =>
      services.userService.updateUsername(payload),
    onSuccess: async (response) => {
      // Update the user info in the auth context
      const userResponse = await services.authServiceToken.getUserDetails();
      setUserInfo(userResponse.data);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUserInfo } = useAuth();

  return useMutation({
    mutationFn: (payload: {
      fullName: string;
      phoneNumber: string;
      email: string;
    }) => services.userService.updateProfile(payload),
    onSuccess: async (response) => {
      // Update the user info in the auth context
      const userResponse = await services.authServiceToken.getUserDetails();
      setUserInfo(userResponse.data);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => handleError(error),
  });
};
