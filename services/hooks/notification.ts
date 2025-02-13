import { useMutation } from "@tanstack/react-query";
import { services } from "@/services";
import { handleError } from "../handleError";

export const useDeviceToken = () => {
  return useMutation({
    mutationFn: (token: string) => services.notificationService.sendDeviceToken(token),
    onError: (error) => handleError(error),
  });
};
