import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import FlashMessageComponent from "./components/FlashMessageComponent";
import FlashMessage from "react-native-flash-message";
import { NotificationProvider } from "./context/NotificationContext";
import Router from "./router/Router";
import { AuthProvider } from "./services/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
// import { LockProvider } from "./context/LockContext"; // Import LockProvider
import "./global.css";
import { LockProvider } from "./context/LockContext";

const queryClient = new QueryClient();

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Black": require("./assets/fonts/Outfit-Black.ttf"),
    "Outfit-Bold": require("./assets/fonts/Outfit-Bold.ttf"),
    "Outfit-ExtraBold": require("./assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-ExtraLight": require("./assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-Light": require("./assets/fonts/Outfit-Light.ttf"),
    "Outfit-Medium": require("./assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Regular": require("./assets/fonts/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("./assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Thin": require("./assets/fonts/Outfit-Thin.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <LockProvider>
                <NavigationContainer>
                  <StatusBar barStyle={"default"} />
                  <Router />
                  <FlashMessage
                    statusBarHeight={StatusBar.currentHeight || 0}
                    position="top"
                    MessageComponent={FlashMessageComponent}
                  />
                </NavigationContainer>
              </LockProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}