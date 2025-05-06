import React, { useEffect, useState, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import { AppState, AppStateStatus, View, Image } from "react-native";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import { useAuth } from "../services/AuthContext";
import OfflineScreen from "@/screens/OfflineScreen";
import LockStackNavigator from "@/screens/reauth/LockStackNavigator";
import { RootStackParamList } from "../types/RootStackParams";
import { services } from "../services";
import { getItem, setItem, removeItem } from "../utils/storage";
import * as Sentry from "@sentry/react-native";
import { handleShowFlash } from "../components/FlashMessageComponent";
import { UserInfo } from "../types/user";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#5136C1",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/animation/logo.gif")}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
    </View>
  );
};

// Utility function to clear lock states
const clearLockStates = async () => {
  try {
    await Promise.all([
      setItem("IS_LOCKED", "false"),
      removeItem("BACKGROUND_TIMESTAMP"),
      removeItem("LOCK_TIMESTAMP"),
      removeItem("WAS_TERMINATED"),
    ]);
    console.log("Lock states cleared successfully");
  } catch (error) {
    console.error("Error clearing lock states:", error);
    Sentry.captureException(error);
  }
};

const Router = ({ showOnboarding }: { showOnboarding: boolean }) => {
  const {
    isAuthenticated,
    isAppReady,
    setIsAuthenticated,
    setUserInfo,
    userInfo,
    logOut,
    isFreshLogin,
    setIsFreshLogin,
  } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLockScreenRequired, setIsLockScreenRequired] =
    useState<boolean>(false);
  const [isLockStateReady, setIsLockStateReady] = useState<boolean>(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const [biometricFailed, setBiometricFailed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log("State Update:", {
      isLockScreenRequired,
      biometricFailed,
      isAuthenticated,
      isFreshLogin,
      isAppReady,
      isLockStateReady,
    });
  }, [
    isLockScreenRequired,
    biometricFailed,
    isAuthenticated,
    isFreshLogin,
    isAppReady,
    isLockStateReady,
  ]);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  // Force bypass lock screen for fresh login
  useEffect(() => {
    if (isFreshLogin && isAuthenticated && isAppReady && !isLockStateReady) {
      console.log("Fresh login detected, bypassing lock screen");
      setIsLockScreenRequired(false);
      setBiometricFailed(false);
      clearLockStates();
    }
  }, [isFreshLogin, isAuthenticated, isAppReady, isLockStateReady]);

  // Initialize lock state
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("initialize start, isFreshLogin:", isFreshLogin);
        if (!isAuthenticated) {
          console.log("Not authenticated, clearing lock state");
          setIsLockScreenRequired(false);
          setBiometricFailed(false);
          await clearLockStates();
        } else {
          const wasTerminated = await getItem("WAS_TERMINATED");
          const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
          const INACTIVITY_TIMEOUT = 180 * 1000; // 3 min
          let shouldLock = false;

          console.log("Initialization checks:", {
            wasTerminated,
            backgroundTimestamp,
            isFreshLogin,
          });

          if (isFreshLogin) {
            console.log("Fresh login, no lock screen required");
            shouldLock = false;
            setIsFreshLogin(false); // Reset after bypass
          } else if (wasTerminated === "true") {
            console.log("App was terminated, requiring lock screen");
            shouldLock = true;
            await removeItem("WAS_TERMINATED");
          } else if (backgroundTimestamp) {
            const lastBackgroundTime = parseInt(backgroundTimestamp, 10);
            const currentTime = Date.now();
            const backgroundDuration = currentTime - lastBackgroundTime;
            console.log("Background duration:", backgroundDuration);
            if (backgroundDuration >= INACTIVITY_TIMEOUT) {
              console.log("Inactivity timeout exceeded, requiring lock screen");
              shouldLock = true;
            } else {
              console.log("Recent activity, no lock screen required");
              shouldLock = false;
            }
            await removeItem("BACKGROUND_TIMESTAMP");
          }

          console.log("Setting isLockScreenRequired:", shouldLock);
          setIsLockScreenRequired(shouldLock);
        }
      } catch (error) {
        console.error("Error initializing lock state:", error);
        Sentry.captureException(error);
        setIsLockScreenRequired(true); // Default to locked on error
      } finally {
        setIsLockStateReady(true);
        console.log("initialize complete, isLockStateReady:", true);
      }
    };

    if (isAppReady) {
      console.log("App ready, running initialization");
      initialize();
    }
  }, [isAuthenticated, isAppReady, isFreshLogin]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (!isAuthenticated) {
        setAppState(nextAppState);
        return;
      }

      if (
        appState === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        const currentTime = Date.now();
        console.log(
          "App going to background, setting timestamps:",
          currentTime
        );
        try {
          await Promise.all([
            setItem("BACKGROUND_TIMESTAMP", currentTime.toString()),
            setItem("WAS_TERMINATED", "true"),
          ]);
        } catch (error) {
          console.error("Error setting background timestamps:", error);
          Sentry.captureException(error);
        }
      }

      if (
        (appState.match(/inactive|background/) || appState === "inactive") &&
        nextAppState === "active"
      ) {
        const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
        console.log(
          "App returning to foreground, timestamp:",
          backgroundTimestamp
        );
        if (backgroundTimestamp) {
          const currentTime = Date.now();
          const backgroundDuration =
            currentTime - parseInt(backgroundTimestamp, 10);
          const INACTIVITY_TIMEOUT = 180 * 1000;
          console.log("Background duration on return:", backgroundDuration);
          if (backgroundDuration >= INACTIVITY_TIMEOUT) {
            console.log("Inactivity timeout exceeded, requiring lock screen");
            setIsLockScreenRequired(true);
          } else {
            console.log("No timeout, no lock screen required");
            setIsLockScreenRequired(false);
          }
          await removeItem("BACKGROUND_TIMESTAMP");
        }
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [appState, isAuthenticated]);

  // Handle biometric success
  const handleBiometricSuccess = async () => {
    try {
      const accessToken = await getItem("ACCESS_TOKEN", true);
      if (accessToken) {
        const userResponse = await services.authServiceToken.getUserDetails();
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        console.log("Biometric success, unlocking app");
        setIsLockScreenRequired(false);
        setBiometricFailed(false);
        await clearLockStates();
      } else {
        console.log("No access token, keeping lock screen");
        handleShowFlash({
          message: "No access token found. Please log in with password.",
          type: "danger",
        });
        setIsLockScreenRequired(true);
        setBiometricFailed(true);
      }
    } catch (error) {
      console.error("Error verifying user after biometric success:", error);
      Sentry.captureException(error);
      handleShowFlash({
        message: "Failed to verify user. Please try again.",
        type: "danger",
      });
      setIsLockScreenRequired(true);
      setBiometricFailed(true);
    }
  };

  // Handle biometric failure
  const handleBiometricFailure = () => {
    console.log("Biometric failure, enforcing lock screen");
    setIsLockScreenRequired(true);
    setBiometricFailed(true);
    handleShowFlash({
      message:
        "Biometric authentication failed. Please try again or use password.",
      type: "danger",
    });
  };

  // Handle password success
  const handlePasswordSuccess = async () => {
    console.log("Password success, unlocking app");
    setIsLockScreenRequired(false);
    setBiometricFailed(false);
    await clearLockStates();
    console.log("Password success state:", {
      isLockScreenRequired: false,
      biometricFailed: false,
      isAuthenticated,
    });
  };

  // Handle account switch (logout)
  const handleSwitchAccount = async () => {
    console.log("Switching account, logging out");
    await logOut();
    setIsLockScreenRequired(false);
    setBiometricFailed(false);
    await clearLockStates();
  };

  // Handle network retry
  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });
  };

  // Check biometric preference
  useEffect(() => {
    const checkBiometricPreference = async () => {
      const biometricEnabled = await getItem("BIOMETRIC_ENABLED");
      setIsBiometricEnabled(biometricEnabled === "true");
    };
    checkBiometricPreference();
  }, []);

  // Navigation stack
  const navigationStack = useMemo(() => {
    console.log("Navigation decision:", {
      isLockScreenRequired,
      isAuthenticated,
      biometricFailed,
      isAppReady,
      isLockStateReady,
      isFreshLogin,
      isLoading,
      isBiometricEnabled,
    });

    if (isLoading || !isAppReady || !isLockStateReady) {
      console.log("App not ready, showing loading screen");
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      );
    }

    if (!isOnline) {
      console.log("Offline, rendering OfflineScreen");
      return <OfflineScreen onRetry={handleRetry} />;
    }

    if (
      isAuthenticated &&
      (isLockScreenRequired || biometricFailed) &&
      isBiometricEnabled
    ) {
      console.log("Rendering LockStack");
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen name="LockStack" options={{ headerShown: false }}>
            {(props) => (
              <LockStackNavigator
                {...props}
                onBiometricSuccess={handleBiometricSuccess}
                onBiometricFailure={handleBiometricFailure}
                onPasswordSuccess={handlePasswordSuccess}
                onSwitchAccount={handleSwitchAccount}
                userInfo={userInfo}
              />
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
      );
    } else if (isAuthenticated) {
      console.log("Rendering AppStack");
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen
            name="AppStack"
            component={AppStack}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      );
    } else {
      console.log("Rendering AuthRoute");
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen name="AuthRoute" options={{ headerShown: false }}>
            {(props) => (
              <AuthRoute {...props} showOnboarding={showOnboarding} />
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
      );
    }
  }, [
    isAuthenticated,
    isLockScreenRequired,
    biometricFailed,
    isAppReady,
    isLockStateReady,
    isOnline,
    userInfo,
    showOnboarding,
    isLoading,
    isBiometricEnabled,
  ]);

  // Set loading state based on app readiness
  useEffect(() => {
    if (isAppReady && isLockStateReady) {
      setIsLoading(false);
    }
  }, [isAppReady, isLockStateReady]);

  return navigationStack;
};

export default Router;
