import { getItem, setItem, removeItem } from "./storage";
import { services } from "../services";
import { handleShowFlash } from "../components/FlashMessageComponent";

export interface TokenHealthStatus {
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  accessTokenValid: boolean;
  refreshTokenValid: boolean;
  lastRefreshAttempt?: Date;
  error?: string;
}

export const checkTokenHealth = async (): Promise<TokenHealthStatus> => {
  const status: TokenHealthStatus = {
    hasAccessToken: false,
    hasRefreshToken: false,
    accessTokenValid: false,
    refreshTokenValid: false,
  };

  try {
    const accessToken = await getItem("ACCESS_TOKEN", true);
    const refreshToken = await getItem("REFRESH_TOKEN", true);
    
    status.hasAccessToken = !!accessToken;
    status.hasRefreshToken = !!refreshToken;
    
    if (accessToken) {
      try {
        const userResponse = await services.authServiceToken.getUserDetails();
        status.accessTokenValid = true;
      } catch (error: any) {
        status.accessTokenValid = false;
        status.error = error.response?.data?.message || "Access token validation failed";
      }
    }

    if (refreshToken) {
      try {
        const refreshResponse = await services.authService.refreshToken({ refreshToken });
        status.refreshTokenValid = true;
        
        await Promise.all([
          setItem("ACCESS_TOKEN", refreshResponse.accessToken, true),
          setItem("REFRESH_TOKEN", refreshResponse.refreshToken, true),
        ]);
      } catch (error: any) {
        status.refreshTokenValid = false;
        status.error = error.response?.data?.message || "Refresh token validation failed";
      }
    }

    status.lastRefreshAttempt = new Date();
    return status;
  } catch (error) {
    status.error = error instanceof Error ? error.message : "Unknown error";
    return status;
  }
};

export const forceTokenRefresh = async (): Promise<boolean> => {
  try {
    const refreshToken = await getItem("REFRESH_TOKEN", true);
    
    if (!refreshToken) {
      handleShowFlash({
        message: "No refresh token available. Please log in again.",
        type: "danger",
      });
      return false;
    }

    const refreshResponse = await services.authService.refreshToken({ refreshToken });
    
    await Promise.all([
      setItem("ACCESS_TOKEN", refreshResponse.accessToken, true),
      setItem("REFRESH_TOKEN", refreshResponse.refreshToken, true),
    ]);
    
    handleShowFlash({
      message: "Tokens refreshed successfully",
      type: "success",
    });
    return true;
  } catch (error: any) {
    handleShowFlash({
      message: "Token refresh failed. Please log in again.",
      type: "danger",
    });
    return false;
  }
};

export const clearAllTokens = async (): Promise<void> => {
  try {
    console.log("🗑️ Clearing all tokens...");
    await Promise.all([
      removeItem("ACCESS_TOKEN", true),
      removeItem("REFRESH_TOKEN", true),
    ]);
    console.log("✅ All tokens cleared");
  } catch (error) {
    console.error("❌ Failed to clear tokens:", error);
  }
}; 