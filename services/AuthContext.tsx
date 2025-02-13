import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { SWRConfig } from "swr";
import { axiosInstance } from "./apiClient";
import { UserInfoType } from "./dtos";
import { getItem, removeItem } from "@/utils/storage";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfoType | null;
  setUserInfo: (userInfo: UserInfoType | null) => void;
  isAppReady: boolean;
  logOut: () => void;
}

interface SWRProps {
  children: React.ReactNode;
  logOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode; // ReactNode allows for any renderable content
};

export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userInfo: null,
  logOut: () => {},
  setUserInfo: () => {},
  isAppReady: false,
});

const SWR: React.FC<SWRProps> = ({ children, logOut }) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          try {
            const response = await axiosInstance.get(url);
            return response.data;
          } catch (error: any) {
            if (error.response?.status === 401) {
              await logOut();
            }
            throw error;
          }
        },
        provider: () => new Map(),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWR;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  const checkAuth = async () => {
    try {
      const accessToken = await getItem("ACCESS_TOKEN", true);
      console.log("Access token: " + accessToken);

      setIsAuthenticated(!!accessToken);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Check the authentication state on component mount.
  useEffect(() => {
    checkAuth();
  }, []);

  const logOut = async () => {
    // Perform logout logic
    removeItem("ACCESS_TOKEN", true);
    removeItem("REFRESH_TOKEN", true);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      userInfo,
      isAppReady,
      logOut,
      userDetails,
      setIsAuthenticated,
      setUserInfo,
    }),
    []
  );

  return (
    <AuthContext.Provider value={value}>
      <SWR logOut={logOut}>{children}</SWR>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
