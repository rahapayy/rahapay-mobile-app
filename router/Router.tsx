import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import LoadingIndicator from "../components/LoadingIndicator";
import { useAuth } from "../services/AuthContext";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

const Router = () => {
  const { isAuthenticated, isAppReady } = useAuth();
  const [appLoaded, setAppLoaded] = useState(false);

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

    prepareApp();
  }, [isAppReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appLoaded]);

  if (!appLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
    </View>
  );
};

export default Router;
