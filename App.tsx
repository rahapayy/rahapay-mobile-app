import React, { useEffect, useCallback } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import FlashMessageComponent from "./components/FlashMessageComponent";
import FlashMessage from "react-native-flash-message";
import { NotificationProvider } from "./context/NotificationContext";
import Router from "./router/Router";
import { AuthProvider } from "./services/AuthContext";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import "./global.css";
import { LockProvider } from "./context/LockContext";
import * as Sentry from "@sentry/react-native";
import { getItem } from "./utils/storage";

// Initialize Sentry
Sentry.init({
  dsn: "https://b6d56a13d87e9557b6e7b3c7b14ee515@o4508189082648576.ingest.de.sentry.io/4509181912678480",
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

const queryClient = new QueryClient();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function App() {
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

  const navigationRef = useNavigationContainerRef();
  const [initialState, setInitialState] = React.useState();
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load navigation state
        const savedStateString = await getItem("NAVIGATION_STATE", false);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;
        if (state !== undefined) {
          setInitialState(state);
        }
      } catch (error) {
        console.warn("Error during app preparation:", error);
        Sentry.captureException(error);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && (fontsLoaded || fontError)) {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Error hiding splash screen:", error);
        Sentry.captureException(error);
      }
    }
  }, [appIsReady, fontsLoaded, fontError]);

  if (!appIsReady || (!fontsLoaded && !fontError)) {
    return null; // Keep native splash screen visible
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <LockProvider>
              <NavigationContainer
                ref={navigationRef}
                initialState={initialState}
              >
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
    </AuthProvider>
  );
});