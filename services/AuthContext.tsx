import React, { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axios } from "./apiClient";
import { Alert, AppState, AppStateStatus } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import SWR from "../context/Swr";

// Define UserInfoType
interface UserInfoType {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  data: {
    id: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
  };
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const BACKGROUND_FETCH_TASK = "background-logout";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  await AsyncStorage.multiRemove(["userInfo", "access_token", "userDetails"]);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export const AuthContext = createContext<{
  isLoading: boolean;
  userInfo: UserInfoType | null;
  setUserInfo: (userInfo: UserInfoType | null) => void;
  onboarding: (
    email: string,
    password: string,
    countryCode: string,
    fullName: string,
    phoneNumber: string,
    referral: string
  ) => Promise<UserInfoType>;
  verifyEmail: (verificationCode: string) => Promise<any>;
  resendOtp: (id: string) => Promise<any>;
  login: (id: string, password: string) => Promise<UserInfoType>;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
  createPin: (pin: string) => Promise<any>;
  isAppReady: boolean;
  isAuthenticated: boolean;
  userDetails: any;
  fetchUserDetails: (token: string) => Promise<void>;
  refreshAccessToken: (
    refreshToken: string
  ) => Promise<{ accessToken: string }>;
  reauthenticate: (pin: string) => Promise<any>;
  setIsUserAuthenticated: (value: boolean) => Promise<void>;
}>({
  isLoading: false,
  userInfo: null,
  setUserInfo: () => {},
  onboarding: async () => ({} as UserInfoType),
  verifyEmail: async () => {},
  resendOtp: async () => {},
  login: async () => ({} as UserInfoType),
  logout: async () => {},
  isLoggedIn: () => false,
  createPin: async () => {},
  isAuthenticated: false,
  isAppReady: false,
  userDetails: null,
  fetchUserDetails: async () => {},
  refreshAccessToken: async () => ({} as { accessToken: string }),
  reauthenticate: async (pin: string) => {},
  setIsUserAuthenticated: async (value: boolean) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idleStartTime, setIdleStartTime] = useState<number | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem("userInfo");
        const storedAccessToken = await AsyncStorage.getItem("access_token");
        const storedUserDetails = await AsyncStorage.getItem("userDetails");
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
          setIsAuthenticated(true);

          if (storedAccessToken && storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
          } else {
            await fetchUserDetails(parsedUserInfo.data.accessToken);
          }
        }
      } catch (error) {
        console.error("Error reading user info from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
        setIsAppReady(true);
      }
    };

    checkLoginStatus();
  }, []);

  const onboarding = async (
    email: string,
    password: string,
    countryCode: string,
    fullName: string,
    phoneNumber: string,
    referral: string
  ): Promise<UserInfoType> => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/auth/onboarding`, {
        email,
        password,
        countryCode,
        fullName,
        phoneNumber,
        referral,
      });

      const userInfo: UserInfoType = res.data;
      setUserInfo(userInfo);

      await AsyncStorage.setItem("userId", userInfo.data.id);

      return userInfo;
    } catch (error) {
      console.error("Onboarding error:", error.response);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  async function setIsUserAuthenticated(value: boolean) {
    await fetchUserDetails(userInfo?.data.accessToken ?? "");
    setIsAuthenticated(value);
  }

  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/auth/verify-email`, { otp });
      return response.data;
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/auth/resend-otp`, { id });
      return response.data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (id: string, password: string): Promise<UserInfoType> => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/auth/login`, { id, password });
      const userInfo: UserInfoType = res.data;
      setUserInfo(userInfo);
      setIsAuthenticated(true);

      await AsyncStorage.multiSet([
        ["userInfo", JSON.stringify(userInfo)],
        ["access_token", userInfo.data.accessToken || ""],
      ]);

      await fetchUserDetails(userInfo.data.accessToken || "");

      return userInfo;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createPin = async (pin: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/auth/create-pin`, {
        securityPin: pin,
        transactionPin: pin,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create pin:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async (
    refreshToken: string
  ): Promise<{ accessToken: string }> => {
    try {
      const response = await axios.post(`/auth/refresh-token`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw error;
    }
  };

  const reauthenticate = async (pin: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/reauthenticate", { pin });
      return response.data;
    } catch (error) {
      console.error("Failed to reauthenticate:", error);
      throw error;
    }
  };

  const fetchUserDetails = async (token: any) => {
    try {
      const res = await axios.get(`/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(res.data.data);
      AsyncStorage.setItem("userDetails", JSON.stringify(res.data.data));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call the logout endpoint
      // await axios.post("/auth/logout");

      setUserInfo(null);
      setIsAuthenticated(false);
      setUserDetails(null);
      await AsyncStorage.multiRemove([
        "userInfo",
        "access_token",
        "userDetails",
      ]);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = () => {
    return (
      isAuthenticated &&
      userInfo !== null &&
      userInfo.access_token !== undefined &&
      userInfo.refresh_token !== undefined &&
      userInfo.expires_at > Date.now() / 1000
    );
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        nextAppState === "active" &&
        (appState === "inactive" || appState === "background")
      ) {
        const idleTime = await AsyncStorage.getItem("idleStartTime");
        const storedUserInfo = await AsyncStorage.getItem("userInfo");
        if (
          idleTime &&
          Date.now() - parseInt(idleTime) > 2 * 60 * 1000 &&
          storedUserInfo
        ) {
          setIdleStartTime(null);
          await AsyncStorage.removeItem("idleStartTime");
          // Consider implementing a re-authentication flow here
        }

        if (!storedUserInfo) {
          await logout();
        } else {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
          setIsAuthenticated(true);
          const storedUserDetails = await AsyncStorage.getItem("userDetails");
          if (storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
          } else {
            await fetchUserDetails(parsedUserInfo.data.accessToken);
          }
        }
      }

      if (
        (appState === "active" && nextAppState === "background") ||
        nextAppState === "inactive"
      ) {
        const currentTime = Date.now();
        setIdleStartTime(currentTime);
        await AsyncStorage.setItem("idleStartTime", currentTime.toString());
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const checkIfHasNewVersion = async () => {
    // try {
    //   const { data } = await axios.get("/settings/app-version");
    //   const updateData: { id: string; isRequired: boolean; version: string } = data.data;
    //   const appVersion = Constants.default.expoConfig?.version;
    //   if (appVersion && updateData?.version) {
    //     const appVersionNumber = parseFloat(appVersion.replace(/\./g, ""));
    //     const updateVersionNumber = parseFloat(updateData.version.replace(/\./g, ""));
    //     if (updateVersionNumber > appVersionNumber) {
    //       Alert.alert(
    //         "New Version Available",
    //         `There is a new version of the app available. Please update to the latest version to continue using the app.`,
    //         [
    //           {
    //             text: "Update",
    //             onPress: () => {
    //               Linking.openURL(""); // Add your app store URL here
    //             },
    //           },
    //           {
    //             text: "Cancel",
    //             onPress: () => {
    //               if (updateData.isRequired) {
    //                 checkIfHasNewVersion();
    //               }
    //             },
    //           },
    //         ]
    //       );
    //     }
    //   }
    // } catch (error) {
    //   console.error("Failed to check for new version:", error);
    // }
  };

  useEffect(() => {
    checkIfHasNewVersion();
  }, []);

  useEffect(() => {
    (async () => {
      await registerBackgroundFetchAsync();
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        setUserInfo,
        onboarding,
        verifyEmail,
        resendOtp,
        createPin,
        userDetails,
        fetchUserDetails,
        login,
        logout,
        isLoggedIn,
        isAppReady,
        isAuthenticated,
        refreshAccessToken,
        reauthenticate,
        setIsUserAuthenticated,
      }}
    >
      <SWR logOut={logout}>{children}</SWR>
    </AuthContext.Provider>
  );
};
