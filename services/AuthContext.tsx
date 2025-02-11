import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SWRConfig } from "swr";
import { axiosInstance } from "./apiClient";
import { UserInfoType } from "./dtos";
import { AuthServices } from "./modules";
import { getItem } from "@/utils/storage";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfoType | null;
  setUserInfo: (userInfo: UserInfoType | null) => void;
  isAppReady: boolean;
  userDetails: any;
  fetchUserDetails: (token: string) => Promise<void>;
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
  setUserInfo: () => {},
  isAppReady: false,
  userDetails: null,
  fetchUserDetails: async () => {},
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

  const authService = new AuthServices(axiosInstance);

  const checkAuth = async () => {
    try {
      const accessToken = await getItem("accessToken");
      console.log(accessToken);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Check the authentication state on component mount.
  useEffect(() => {
    checkAuth();
  }, []);

  const fetchUserDetails = async (token: string) => {
    try {
      const response = await axiosInstance.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      
      setUserDetails(response.data.data);
      await AsyncStorage.setItem(
        "userDetails",
        JSON.stringify(response.data.data)
      );
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        "userInfo",
        "accessToken",
        "userDetails",
      ]);
      setUserInfo(null);
      setIsAuthenticated(false);
      setUserDetails(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUserInfo = await getItem("userInfo");
        const storedUserDetails = await getItem("userDetails");

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
          setIsAuthenticated(true);

          if (storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
          } else if (parsedUserInfo.data.accessToken) {
            await fetchUserDetails(parsedUserInfo.data.accessToken);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
        setIsAppReady(true);
      }
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      userInfo,
      isAppReady,
      userDetails,
      setIsAuthenticated,
      setUserInfo,
      fetchUserDetails,
    }),
    []
  );

  return (
    <AuthContext.Provider value={value}>
      <SWR logOut={logout}>{children}</SWR>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
