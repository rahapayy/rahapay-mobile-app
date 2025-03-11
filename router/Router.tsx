import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import LoadingIndicator from "../components/LoadingIndicator";
import { useAuth } from "../services/AuthContext";
// import * as SplashScreen from "expo-splash-screen";
import OfflineScreen from "@/screens/OfflineScreen";

const Stack = createNativeStackNavigator();

const Router = () => {
  const { isAuthenticated, isAppReady } = useAuth();
  const [appLoaded, setAppLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null); // Track internet status

  // Check app readiness and initial connectivity
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

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    prepareApp();

    // Cleanup subscription
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
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="AuthRoute"
            component={AuthRoute}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    //         <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
    // </View>
  );
};

export default Router;
