import React, { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axios } from "../utils/api";
import { Alert, AppState, AppStateStatus, Linking } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import SWR from "./Swr";
import * as Constants from "expo-constants";

// Define UserInfoType
interface UserInfoType {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  data: {
    id: string; // The ID returned in the response
    user?: any;
    token?: string;
  };
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const BACKGROUND_FETCH_TASK = "background-logout";

export const AuthContext = createContext<{
  isLoading: boolean;
  userInfo: UserInfoType | null;
  setUserInfo: (userInfo: any) => void;
  onboarding: (
    email: string,
    password: string,
    countryCode: string,
    fullName: string,
    phoneNumber: string,
    referral: string
  ) => void;
  verifyEmail: (verificationCode: string) => void;
  resendOtp: (id: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  createPin: (pin: string) => void;
  isAppReady: boolean;
  isAuthenticated: boolean;
  userDetails: any;
  fetchUserDetails: (token: any) => Promise<void>;
  showPinScreen: boolean;
  setShowPinScreen: (show: boolean) => void;
  refreshAccessToken: (pinOrPassword?: {
    pin?: string;
    password?: string;
  }) => Promise<void>;
}>({
  isLoading: false,
  userInfo: null,
  setUserInfo: (userInfo: any) => {},
  onboarding: () => {},
  verifyEmail: () => {},
  resendOtp: () => {},
  login: () => {},
  logout: () => {},
  isLoggedIn: () => false,
  createPin: () => {},
  isAuthenticated: false,
  isAppReady: false,
  userDetails: null,
  fetchUserDetails: async () => {},
  showPinScreen: false,
  setShowPinScreen: () => {},
  refreshAccessToken: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idleStartTime, setIdleStartTime] = useState<number | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPinScreen, setShowPinScreen] = useState(false);
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
  ) => {
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
  
      // Define and store the userInfo correctly from the response
      const userInfo = res.data; // Assuming `res.data` is the correct response structure
      console.log({ userInfo });
      
      // Set the userInfo state
      setUserInfo(userInfo);
  
      // Store user info in AsyncStorage
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
  
      // You may also store the user id in AsyncStorage if needed
      const userId = userInfo.data.id;
      await AsyncStorage.setItem("userId", userId);
  
      setIsLoading(false);
      return userInfo;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };
  
  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/auth/verify-email`, { otp });
      return response.data;
    } catch (error) {
      throw error; // Re-throw the error to handle it in the component
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async ({ id }: { id: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/auth/resend-otp`, { id });
      return response.data;
    } catch (error) {
      throw error; // Re-throw the error to handle it in the component
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (id: any, password: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/auth/login`, { id, password });
      let userInfo = res.data;
      setUserInfo(userInfo);
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      AsyncStorage.setItem("access_token", userInfo.data.accessToken);
      setIsAuthenticated(true);

      // Fetch user details
      await fetchUserDetails(userInfo.data.accessToken);

      return userInfo;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createPin = async (pin: string) => {
    setIsLoading(true);
    try {
      // Get the access token from userInfo
      const accessToken = userInfo?.data?.access_token;

      // Make the POST request to create the pin
      const response = await axios.post(
        `/auth/create-pin`,
        { securityPin: pin },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Return the response data
      return response.data;
    } catch (error) {
      console.error("Failed to create pin:", error);
      Alert.alert("Error", "Failed to create pin. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (token: any) => {
    try {
      const res = await axios.get(`/user/dashboard/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(res.data.data);
      AsyncStorage.setItem("userDetails", JSON.stringify(res.data.data));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const authLogout = React.useCallback(() => {
    setIsLoading(false);
    setIsAuthenticated(false);
    AsyncStorage.removeItem("access_token");
    AsyncStorage.removeItem("userDetails"); // Clear userDetails on logout
  }, []);

  const logout = () => {
    setIsLoading(false);
    setUserInfo(null);
    setIsAuthenticated(false);
    setUserDetails(null); // Clear userDetails on logout
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("access_token");
    AsyncStorage.removeItem("userDetails");
  };

  const isLoggedIn = React.useMemo(() => {
    return (
      isAuthenticated &&
      userInfo &&
      userInfo.access_token &&
      userInfo.refresh_token &&
      userInfo.expires_at > Date.now() / 1000
    );
  }, [userInfo]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        nextAppState === "active" &&
        (appState === "inactive" || appState === "background")
      ) {
        const idleTime =
          Number((await AsyncStorage.getItem("idleStartTime")) || 0) ||
          idleStartTime;
        const storedUserInfo = await AsyncStorage.getItem("userInfo");
        if (
          idleTime &&
          Date.now() - idleTime > 2 * 60 * 1000 &&
          storedUserInfo
        ) {
          setIdleStartTime(null);
          AsyncStorage.removeItem("idleStartTime");
          setShowPinScreen(true);
          // navigation.navigate("WelcomeBackScreen");
        }

        if (!storedUserInfo) {
          authLogout();
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
        setIdleStartTime(Date.now());
        AsyncStorage.setItem("idleStartTime", Date.now().toString());
      }

      setAppState(nextAppState);
    };

    const unsubscribe = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      unsubscribe.remove();
    };
  }, [appState, idleStartTime]);

  const checkIfHasNewVersion = React.useCallback(async () => {
    try {
      const { data } = await axios.get("/settings/app-version");
      const updateData: { id: string; isRequired: boolean; version: string } =
        data.data;
      const appVersion = Constants.default.expoConfig?.version;
      if (appVersion && updateData?.version) {
        const appVersionNumber = parseFloat(appVersion.replace(/\./g, ""));
        const updateVersionNumber = parseFloat(
          updateData.version.replace(/\./g, "")
        );
        if (updateVersionNumber > appVersionNumber) {
          // console.log("has new version");
          Alert.alert(
            "New Version Available",
            `There is a new version of the app available. Please update to the latest version to continue using the app.`,
            [
              {
                text: "Update",
                onPress: () => {
                  Linking.openURL("");
                },
              },
              {
                text: "Cancel",
                onPress: () => {
                  if (updateData.isRequired) {
                    checkIfHasNewVersion();
                  }
                },
              },
            ]
          );
        }
      }
    } catch (error: any) {
      // console.log({ ...error });
    }
  }, []);

  useEffect(() => {
    checkIfHasNewVersion();
  }, []);

  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] =
    React.useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  React.useEffect(() => {
    (async () => {
      await registerBackgroundFetchAsync();
    })();
  }, []);

  const refreshAccessToken = useCallback(
    async (pinOrPassword?: { pin?: string | number; password?: string }) => {
      try {
        setIsLoading(true);

        // Convert pin to string if it's a number
        const payload = pinOrPassword
          ? {
              ...pinOrPassword,
              pin: pinOrPassword.pin ? pinOrPassword.pin.toString() : undefined,
            }
          : undefined;

        // Log the request payload for debugging
        console.log("Re-authentication request payload:", payload);

        const response = await axios.post("/auth/re-authenticate", payload);

        // Log the successful response for debugging
        console.log("Re-authentication response:", response.data);

        const newUserInfo = {
          ...userInfo,
          access_token: response.data.access_token,
          expires_at: Date.now() / 1000 + response.data.expires_in,
        };
        setUserInfo(newUserInfo);
        await AsyncStorage.setItem("userInfo", JSON.stringify(newUserInfo));
        await AsyncStorage.setItem("access_token", newUserInfo.access_token);
        setIsAuthenticated(true);
        setShowPinScreen(false);
      } catch (error: any) {
        console.error("Re-authentication failed:", error);

        // Log more details about the error
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        let errorMessage = "Failed to re-authenticate. Please try again.";

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }

        Alert.alert("Authentication Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [userInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        setUserInfo,
        onboarding,
        verifyEmail,
        resendOtp: (id: string) => resendOtp({ id }),
        createPin,
        userDetails,
        fetchUserDetails,
        login,
        logout,
        isLoggedIn,
        isAppReady,
        isAuthenticated,
        showPinScreen,
        setShowPinScreen,
        refreshAccessToken,
      }}
    >
      <SWR logOut={authLogout}>{children}</SWR>
    </AuthContext.Provider>
  );
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  AsyncStorage.removeItem("userInfo");
  AsyncStorage.removeItem("access_token");
  AsyncStorage.removeItem("userDetails");
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
