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
  isFreshLogin: boolean;
  setIsFreshLogin: React.Dispatch<React.SetStateAction<boolean>>;
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
  isFreshLogin: false,
  setIsFreshLogin: () => {},
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
  const [isFreshLogin, setIsFreshLogin] = useState(false);

  const checkAuth = async () => {
    try {
      console.log("checkAuth start, isFreshLogin:", isFreshLogin);
      const accessToken = await getItem("ACCESS_TOKEN", true);
      const refreshToken = await getItem("REFRESH_TOKEN", true);

      console.log("Checking auth state:", {
        accessToken: accessToken ? "Present" : "Not present",
        refreshToken: refreshToken ? "Present" : "Not present",
        isFreshLogin,
      });

      if (accessToken) {
        const userResponse = await services.authServiceToken.getUserDetails();
        setUserInfo(userResponse.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setIsFreshLogin(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      Sentry.captureException(error);
      setIsAuthenticated(false);
      setIsFreshLogin(false);
    } finally {
      setIsAppReady(true);
      setIsLoading(false);
      console.log("checkAuth complete, isAppReady:", true, "isFreshLogin:", isFreshLogin);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logOut = useCallback(async () => {
    try {
      await Promise.all([
        removeItem("ACCESS_TOKEN", true),
        removeItem("REFRESH_TOKEN", true),
        removeItem("IS_LOCKED", true),
        removeItem("WAS_TERMINATED"),
        removeItem("BACKGROUND_TIMESTAMP"),
      ]);
      mutate(() => true, undefined, false);
      console.log("SWR cache cleared on logout");
      setIsAuthenticated(false);
      setUserInfo(null);
      setIsFreshLogin(false);
    } catch (error) {
      console.error("Logout error:", error);
      Sentry.captureException(error);
    }
  }, []);

  useEffect(() => {
    setLogoutCallback(logOut);
    return () => {
      setLogoutCallback(() => Promise.resolve());
    };
  }, [logOut]);

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      isAuthenticated,
      setIsAuthenticated,
      userInfo,
      setUserInfo,
      isAppReady,
      logOut,
      isFreshLogin,
      setIsFreshLogin,
    }),
    [isLoading, isAuthenticated, userInfo, isAppReady, logOut, isFreshLogin]
  );

  return (
    <AuthContext.Provider value={value}>
      <SWR logOut={logOut}>{children}</SWR>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};