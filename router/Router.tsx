import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import LoadingIndicator from "../components/LoadingIndicator";
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
        options={{ headerShown: false }}
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
  const { isLocked } = useLock(); // Use the LockContext to get isLocked
  const [appLoaded, setAppLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (isAppReady) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading time
          setAppLoaded(true);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    prepareApp();
    return () => unsubscribe();
  }, [isAppReady]);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? false);
    });
  };

  if (!appLoaded || isOnline === null) {
    return <LoadingIndicator />;
  }

  if (!isOnline) {
    return <OfflineScreen onRetry={handleRetry} />;
  }

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
