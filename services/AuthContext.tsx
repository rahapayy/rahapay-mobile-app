import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { SWRConfig } from "swr";
import { axiosInstance, services, setLogoutCallback } from "./apiClient";
import { UserInfoType } from "./dtos";
import { getItem, removeItem } from "@/utils/storage";
import { mutate } from "swr";
import * as Sentry from "@sentry/react-native";

interface AuthContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfoType | null;
  setUserInfo: (userInfo: UserInfoType | null) => void;
  isAppReady: boolean;
  logOut: () => Promise<void>;
}

interface SWRProps {
  children: React.ReactNode;
  logOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  setIsLoading: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userInfo: null,
  logOut: async () => {},
  setUserInfo: () => {},
  isAppReady: false,
});

const SWR: React.FC<SWRProps> = ({ children, logOut }) => {
  const fetcher = useCallback(
    async (url: string) => {
      try {
        const response = await axiosInstance.get(url);
        return response.data;
      } catch (error: any) {
        if (error.message === "Session expired. Please log in again.") {
          await logOut();
          throw new Error("Session expired. Please log in again.");
        }
        if (error.response?.status === 401) {
          throw new Error("Unauthorized");
        }
        Sentry.captureException(error);
        throw error;
      }
    },
    [logOut]
  );

  return (
    <SWRConfig
      value={{
        fetcher,
        provider: () => new Map(),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  const checkAuth = async () => {
    try {
      const accessToken = await getItem("ACCESS_TOKEN", true);
      const refreshToken = await getItem("REFRESH_TOKEN", true);

      console.log("Checking auth state:", {
        accessToken: accessToken ? "Present" : "Not present",
        refreshToken: refreshToken ? "Present" : "Not present",
      });

      if (accessToken) {
        const userResponse = await services.authServiceToken.getUserDetails();
        setUserInfo(userResponse.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      Sentry.captureException(error);
      setIsAuthenticated(false);
    } finally {
      setIsAppReady(true);
      setIsLoading(false);
    }
  };

  // Check authentication state on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const logOut = useCallback(async () => {
    try {
      await Promise.all([
        removeItem("ACCESS_TOKEN", true),
        removeItem("REFRESH_TOKEN", true),
        removeItem("IS_LOCKED", true),
      ]);

      // Clear SWR cache
      mutate(() => true, undefined, false);
      console.log("SWR cache cleared on logout");

      // Reset authentication state
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Logout error:", error);
      Sentry.captureException(error);
    }
  }, []);

  // Pass logout callback to apiClient
  useEffect(() => {
    setLogoutCallback(logOut);
    return () => {
      setLogoutCallback(() => Promise.resolve()); // Cleanup on unmount
    };
  }, [logOut]);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      userInfo,
      isAppReady,
      logOut,
      setIsAuthenticated,
      setUserInfo,
      setIsLoading,
    }),
    [isLoading, isAuthenticated, userInfo, isAppReady, logOut]
  );

  return (
    <AuthContext.Provider value={value}>
      <SWR logOut={logOut}>{children}</SWR>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
