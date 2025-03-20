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
import { axiosInstance, services } from "./apiClient";
import { UserInfoType } from "./dtos";
import { getItem, removeItem } from "@/utils/storage";
import { mutate } from "swr"; // Import mutate to clear cache

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
        if (error.response?.status === 401) {
          await logOut(); // Log out on 401
          throw new Error("Unauthorized"); // Re-throw to let SWR handle the error
        }
        throw error;
      }
    },
    [logOut]
  );

  return (
    <SWRConfig
      value={{
        fetcher,
        provider: () => new Map(), // Creates a new cache instance per render
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
      console.log("Access token: " + accessToken);

      if (accessToken) {
        const userResponse = await services.authServiceToken.getUserDetails();
        setUserInfo(userResponse.data);
      }

      setIsAuthenticated(!!accessToken);
    } catch (error) {
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
      // Clear tokens from storage
      await removeItem("ACCESS_TOKEN", true);
      await removeItem("REFRESH_TOKEN", true);
      await removeItem("IS_LOCKED", true);

      // Clear SWR cache
      mutate(() => true, undefined, false); // Clears all SWR cache
      console.log("SWR cache cleared on logout");

      // Reset authentication state
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

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
