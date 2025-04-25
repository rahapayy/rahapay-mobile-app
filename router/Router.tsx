import React, { useEffect, useState, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import { AppState, AppStateStatus } from "react-native";
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
  const [biometricFailed, setBiometricFailed] = useState<boolean>(false);

  useEffect(() => {
    console.log("State Update:", { isLockScreenRequired, biometricFailed, isAuthenticated });
  }, [isLockScreenRequired, biometricFailed, isAuthenticated]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => setIsOnline(state.isConnected ?? true));
    NetInfo.fetch().then((state) => setIsOnline(state.isConnected ?? true));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!isAuthenticated) {
          setIsLockScreenRequired(false);
          setBiometricFailed(false);
          await Promise.all([
            removeItem("WAS_TERMINATED"),
            removeItem("BACKGROUND_TIMESTAMP"),
            removeItem("IS_LOCKED"),
          ]);
        } else {
          const wasTerminated = await getItem("WAS_TERMINATED");
          const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
          const INACTIVITY_TIMEOUT = 30 * 1000;
          let shouldLock = true;

          if (wasTerminated === "true") {
            shouldLock = true;
            await removeItem("WAS_TERMINATED");
          } else if (backgroundTimestamp) {
            const backgroundDuration = Date.now() - parseInt(backgroundTimestamp, 10);
            shouldLock = backgroundDuration >= INACTIVITY_TIMEOUT;
            await removeItem("BACKGROUND_TIMESTAMP");
          }
          setIsLockScreenRequired(shouldLock);
        }
      } catch (error) {
        console.error("Initialize error:", error);
        setIsLockScreenRequired(true);
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
      if (appState === "active" && (nextAppState === "background" || nextAppState === "inactive")) {
        await setItem("BACKGROUND_TIMESTAMP", Date.now().toString());
      }
      if ((appState.match(/inactive|background/) || appState === "inactive") && nextAppState === "active") {
        const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
        if (backgroundTimestamp) {
          const backgroundDuration = Date.now() - parseInt(backgroundTimestamp, 10);
          const INACTIVITY_TIMEOUT = 30 * 1000;
          if (backgroundDuration >= INACTIVITY_TIMEOUT) {
            setIsLockScreenRequired(true);
          }
          await removeItem("BACKGROUND_TIMESTAMP");
        }
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [appState, isAuthenticated]);

  const handleBiometricSuccess = async () => {
    try {
      const accessToken = await getItem("ACCESS_TOKEN", true);
      if (accessToken) {
        const userResponse = await services.authServiceToken.getUserDetails();
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        setIsLockScreenRequired(false);
        setBiometricFailed(false);
        await Promise.all([
          setItem("IS_LOCKED", "false"),
          removeItem("BACKGROUND_TIMESTAMP"),
          removeItem("LOCK_TIMESTAMP"),
          removeItem("WAS_TERMINATED"),
        ]);
      } else {
        handleShowFlash({ message: "No access token. Use password.", type: "danger" });
        setIsLockScreenRequired(true);
        setBiometricFailed(true);
      }
    } catch (error) {
      console.error("Biometric success error:", error);
      handleShowFlash({ message: "Verification failed.", type: "danger" });
      setIsLockScreenRequired(true);
      setBiometricFailed(true);
    }
  };

  const handleBiometricFailure = () => {
    console.log("Biometric failed");
    setIsLockScreenRequired(true);
    setBiometricFailed(true);
    handleShowFlash({ message: "Biometric authentication failed.", type: "danger" });
  };

  const handlePasswordLogin = () => {
    console.log("Navigating to PasswordReauthScreen");
  };

  const handleSwitchAccount = async () => {
    await logOut();
    setIsLockScreenRequired(false);
    setBiometricFailed(false);
  };

  const handleRetry = () => {
    NetInfo.fetch().then((state) => setIsOnline(state.isConnected ?? true));
  };

  // Ensure LockScreen after biometric failure
  useEffect(() => {
    if (biometricFailed) {
      console.log("Biometric failed effect: Enforcing LockScreen");
      setIsLockScreenRequired(true); // Reinforce lock screen
    }
  }, [biometricFailed]);

  const navigationStack = useMemo(() => {
    const shouldRenderLockScreen = isAuthenticated && (isLockScreenRequired || biometricFailed);
    console.log("Navigation decision:", { shouldRenderLockScreen, isAuthenticated, isLockScreenRequired, biometricFailed });

    if (!isAuthenticated) {
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen name="AuthRoute" component={AuthRoute} options={{ headerShown: false }} />
        </RootStack.Navigator>
      );
    }
    if (shouldRenderLockScreen) {
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen name="LockStack" options={{ headerShown: false }}>
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
        </RootStack.Navigator>
      );
    }
    return (
      <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
        <RootStack.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
    );
  }, [isAuthenticated, isLockScreenRequired, biometricFailed, userInfo]);

  if (!isAppReady || !isLockStateReady) return null;
  if (!isOnline) return <OfflineScreen onRetry={handleRetry} />;
  return navigationStack;
};

export default Router;