import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import { AppState, AppStateStatus } from "react-native"; // Correct import
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import { useAuth } from "../services/AuthContext";
import OfflineScreen from "@/screens/OfflineScreen";
import LockScreen from "@/screens/reauth/LockScreen";
import { RootStackParamList, LockStackParamList } from "../types/RootStackParams";
import PasswordReauthScreen from "@/screens/reauth/PasswordReauthScreen.tsx";
import { services } from "../services";
import { getItem, setItem, removeItem } from "../utils/storage";
import * as Sentry from "@sentry/react-native";
import { handleShowFlash } from "../components/FlashMessageComponent";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const LockStack = createNativeStackNavigator<LockStackParamList>();

const LockStackNavigator = ({
  onBiometricSuccess,
  onBiometricFailure,
  onPasswordLogin,
  onSwitchAccount,
  userInfo,
}: {
  onBiometricSuccess: () => void;
  onBiometricFailure: () => void;
  onPasswordLogin: () => void;
  onSwitchAccount: () => void;
  userInfo: { fullName?: string } | null;
}) => {
  return (
    <LockStack.Navigator screenOptions={{ gestureEnabled: false }}>
      <LockStack.Screen
        name="LockScreen"
        options={{ headerShown: false, presentation: "containedModal" }}
      >
        {(props) => (
          <LockScreen
            {...props}
            onBiometricSuccess={onBiometricSuccess}
            onBiometricFailure={onBiometricFailure}
            onPasswordLogin={onPasswordLogin}
            onSwitchAccount={onSwitchAccount}
            userInfo={userInfo}
          />
        )}
      </LockStack.Screen>
      <LockStack.Screen
        name="PasswordReauthScreen"
        component={PasswordReauthScreen}
        options={{ headerShown: false }}
      />
    </LockStack.Navigator>
  );
};

const Router = () => {
  const { isAuthenticated, isAppReady, setIsAuthenticated, setUserInfo, userInfo, logOut } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLockScreenRequired, setIsLockScreenRequired] = useState<boolean>(false);
  const [isLockStateReady, setIsLockStateReady] = useState<boolean>(false);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!isAuthenticated) {
          console.log("Not authenticated, no lock screen required");
          setIsLockScreenRequired(false);
          await Promise.all([
            removeItem("WAS_TERMINATED"),
            removeItem("BACKGROUND_TIMESTAMP"),
            removeItem("IS_LOCKED"),
          ]);
        } else {
          const wasTerminated = await getItem("WAS_TERMINATED");
          const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
          const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds
          let shouldLock = false;

          console.log("Initialization checks:", { wasTerminated, backgroundTimestamp });

          if (wasTerminated === "true") {
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
            }
            await removeItem("BACKGROUND_TIMESTAMP");
          } else {
            // If no termination or background timestamp, check if app was recently active
            console.log("No termination or timeout, but checking authentication state");
            shouldLock = true; // Default to locked for authenticated users until unlocked
          }

          setIsLockScreenRequired(shouldLock);
        }
      } catch (error) {
        console.error("Error initializing lock state:", error);
        Sentry.captureException(error);
        setIsLockScreenRequired(true); // Default to locked on error
      } finally {
        setIsLockStateReady(true);
      }
    };

    initialize();
  }, [isAuthenticated]);

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
        console.log("App going to background, setting timestamp:", currentTime);
        await setItem("BACKGROUND_TIMESTAMP", currentTime.toString());
      }

      if (
        (appState.match(/inactive|background/) || appState === "inactive") &&
        nextAppState === "active"
      ) {
        const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
        console.log("App returning to foreground, timestamp:", backgroundTimestamp);
        if (backgroundTimestamp) {
          const currentTime = Date.now();
          const backgroundDuration = currentTime - parseInt(backgroundTimestamp, 10);
          const INACTIVITY_TIMEOUT = 30 * 1000;
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

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, isAuthenticated]);

  const handleBiometricSuccess = async () => {
    try {
      const accessToken = await getItem("ACCESS_TOKEN", true);
      if (accessToken) {
        const userResponse = await services.authServiceToken.getUserDetails();
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        console.log("Biometric success, unlocking app");
        setIsLockScreenRequired(false);
        await Promise.all([
          setItem("IS_LOCKED", "false"),
          removeItem("BACKGROUND_TIMESTAMP"),
          removeItem("LOCK_TIMESTAMP"),
          removeItem("WAS_TERMINATED"),
        ]);
      } else {
        handleShowFlash({
          message: "No access token found. Please log in with password.",
          type: "danger",
        });
        setIsLockScreenRequired(true);
      }
    } catch (error) {
      console.error("Error verifying user after biometric success:", error);
      Sentry.captureException(error);
      handleShowFlash({
        message: "Failed to verify user. Please try again.",
        type: "danger",
      });
      setIsLockScreenRequired(true); // Keep locked on error
    }
  };

  const handleBiometricFailure = () => {
    console.log("Biometric failure, keeping lock screen");
    setIsLockScreenRequired(true);
  };

  const handlePasswordLogin = () => {
    // Navigation to PasswordReauthScreen is handled by LockStack
  };

  const handleSwitchAccount = async () => {
    await logOut();
    setIsLockScreenRequired(false);
  };

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });
  };

  console.log("Router state:", {
    isAppReady,
    isLockStateReady,
    isAuthenticated,
    isLockScreenRequired,
    isOnline,
  });

  if (!isAppReady || !isLockStateReady) {
    return null;
  }

  if (!isOnline) {
    return <OfflineScreen onRetry={handleRetry} />;
  }

  return (
    <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
      {isLockScreenRequired && isAuthenticated ? (
        <RootStack.Screen
          name="LockStack"
          options={{ headerShown: false }}
        >
          {(props) => (
            <LockStackNavigator
              {...props}
              onBiometricSuccess={handleBiometricSuccess}
              onBiometricFailure={handleBiometricFailure}
              onPasswordLogin={handlePasswordLogin}
              onSwitchAccount={handleSwitchAccount}
              userInfo={userInfo}
            />
          )}
        </RootStack.Screen>
      ) : isAuthenticated ? (
        <RootStack.Screen
          name="AppStack"
          component={AppStack}
          options={{ headerShown: false }}
        />
      ) : (
        <RootStack.Screen
          name="AuthRoute"
          component={AuthRoute}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
};

export default Router;