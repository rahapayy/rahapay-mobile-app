import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppState, StatusBar } from "react-native";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import FlashMessageComponent from "./components/FlashMessageComponent";
import FlashMessage from "react-native-flash-message";
import { NotificationProvider } from "./context/NotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Router from "./router/Router";
import { AuthProvider } from "./services/AuthContext";

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

  // Store the app state
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Load persisted state when the app starts
    loadPersistedState();

    return () => {
      subscription.remove();
    };
  }, []);

  // Function to handle when the app goes to background or comes to foreground
  const handleAppStateChange = async (nextAppState: string) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      // Restore app state when coming to the foreground
      loadPersistedState();
    } else if (nextAppState === "background") {
      // Save current app state when going to the background
      await persistAppState();
    }
    setAppState(
      nextAppState as
        | "active"
        | "background"
        | "inactive"
        | "unknown"
        | "extension"
    );
  };

  // Function to save the current state
  const persistAppState = async () => {
    try {
      const stateToPersist = {
        /* add important state variables here */
      };
      await AsyncStorage.setItem("appState", JSON.stringify(stateToPersist));
      console.log("App state persisted!");
    } catch (error) {
      console.log("Error saving state to AsyncStorage: ", error);
    }
  };

  // Function to load the persisted state
  const loadPersistedState = async () => {
    try {
      const savedState = await AsyncStorage.getItem("appState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Restore your state from parsedState
        console.log("Restored app state:", parsedState);
      }
    } catch (error) {
      console.log("Error loading state from AsyncStorage: ", error);
    }
  };

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
            {/* <NotificationProvider> */}
            <StatusBar barStyle={"default"} />
            <Router />
            <FlashMessage
              statusBarHeight={StatusBar.currentHeight || 0}
              position="top"
              MessageComponent={FlashMessageComponent}
            />
            {/* </NotificationProvider> */}
          </QueryClientProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}
