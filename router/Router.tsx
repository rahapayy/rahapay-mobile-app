import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
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
    <LockStack.Navigator screenOptions={{ gestureEnabled: false }}>
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
  const [isOnline, setIsOnline] = useState<boolean>(true);

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
    if (!isAuthenticated) {
      setIsLocked(false);
    }
  }, [isAuthenticated, setIsLocked]);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });
  };

  if (!isAppReady || !isLockStateReady) {
    return null;
  }

  if (!isOnline) {
    return <OfflineScreen onRetry={handleRetry} />;
  }

  return (
    <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
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
