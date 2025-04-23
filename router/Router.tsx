import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import * as SplashScreen from "expo-splash-screen";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import { useAuth } from "../services/AuthContext";
import OfflineScreen from "@/screens/OfflineScreen";
import LockScreen from "@/screens/reauth/LockScreen";
import {
  RootStackParamList,
  LockStackParamList,
} from "../types/RootStackParams";
import { useLock } from "../context/LockContext";
import PasswordReauthScreen from "@/screens/reauth/PasswordReauthScreen.tsx";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const LockStack = createNativeStackNavigator<LockStackParamList>();

const LockStackNavigator = () => {
  return (
    <LockStack.Navigator>
      <LockStack.Screen
        name="LockScreen"
        component={LockScreen}
        options={{ headerShown: false, presentation: "containedModal" }}
      />
      <LockStack.Screen
        name="PasswordReauthScreen"
        component={PasswordReauthScreen}
        options={{ headerShown: false }}
      />
    </LockStack.Navigator>
  );
};

const Router = () => {
  const { isAuthenticated, isAppReady } = useAuth();
  const { isLocked, isLockStateReady, setIsLocked } = useLock();
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAppReady && isLockStateReady && isOnline !== null) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Error in hideAsync:", error);
      });
    }
  }, [isAppReady, isLockStateReady, isOnline]);

  // Reset lock state when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLocked(false);
    }
  }, [isAuthenticated, setIsLocked]);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? false);
    });
  };

  if (!isAppReady || !isLockStateReady || isOnline === null) {
    console.log(
      "Waiting for readiness - isAppReady:",
      isAppReady,
      "isLockStateReady:",
      isLockStateReady,
      "isOnline:",
      isOnline
    );
    return null;
  }

  if (!isOnline) {
    console.log("Offline detected");
    return <OfflineScreen onRetry={handleRetry} />;
  }

  console.log(
    "Rendering Router - isAuthenticated:",
    isAuthenticated,
    "isLocked:",
    isLocked
  );
  console.log(
    "Navigation decision:",
    isLocked && isAuthenticated
      ? "LockStack"
      : isAuthenticated
      ? "AppStack"
      : "AuthRoute"
  );

  return (
    <RootStack.Navigator>
      {isLocked && isAuthenticated ? (
        <RootStack.Screen
          name="LockStack"
          component={LockStackNavigator}
          options={{ headerShown: false }}
        />
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
