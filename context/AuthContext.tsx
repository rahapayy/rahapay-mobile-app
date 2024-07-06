import React, { createContext, useEffect, useState } from "react";
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
    user: any;
    token: string;
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
    phoneNumber: string
  ) => void;
  verifyEmail: (verificationCode: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  isAppReady: boolean;
  isAuthenticated: boolean;
}>({
  isLoading: false,
  userInfo: null,
  setUserInfo: (userInfo: any) => {},
  onboarding: () => {},
  verifyEmail: () => {},
  login: () => {},
  logout: () => {},
  isLoggedIn: () => false,
  isAuthenticated: false,
  isAppReady: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | any>(null);
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
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
          setIsAuthenticated(true);
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
    phoneNumber: string
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/auth/onboarding`, {
        email,
        password,
        countryCode,
        fullName,
        phoneNumber,
      });
      let userInfo = res.data;
      setUserInfo(userInfo);
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (verificationCode: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/auth/verify-email`, {
        verificationCode,
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const login = async (id: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/auth/login`, {
        id,
        password,
      });
      let userInfo = res.data;
      setUserInfo(userInfo);
      setIsAuthenticated(true);
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      AsyncStorage.setItem("access_token", userInfo.data.accessToken);
      return userInfo;
    } catch (error: any) {
      throw new Error("Incorrect email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const authLogout = React.useCallback(() => {
    setIsLoading(false);
    setIsAuthenticated(false);
    AsyncStorage.removeItem("access_token");
  }, []);

  const logout = () => {
    setIsLoading(false);
    setUserInfo(null);
    setIsAuthenticated(false);
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("access_token");
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
        if (idleTime && Date.now() - idleTime > 2 * 60 * 1000) {
          setIdleStartTime(null);
          AsyncStorage.removeItem("idleStartTime");
          authLogout();
        }

        const storedUserInfo = await AsyncStorage.getItem("userInfo");
        if (!storedUserInfo) {
          authLogout();
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
          console.log("has new version");
          Alert.alert(
            "New Version Available",
            `There is a new version of the app available. Please update to the latest version to continue using the app.`,
            [
              {
                text: "Update",
                onPress: () => {
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.shaydee11.billslink"
                  );
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
      console.log({ ...error });
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

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        setUserInfo,
        onboarding,
        verifyEmail,
        login,
        logout,
        isLoggedIn,
        isAppReady,
        isAuthenticated,
      }}
    >
      <SWR logOut={authLogout}>{children}</SWR>
    </AuthContext.Provider>
  );
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  AsyncStorage.removeItem("userInfo");
  AsyncStorage.removeItem("access_token");
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
