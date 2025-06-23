import React, { useEffect, useCallback, useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { getItem, setItem } from "./utils/storage";
import { VersionUpdateProvider } from "./context/VersionUpdateContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
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

  const navigationRef = useNavigationContainerRef();
  const [initialState, setInitialState] = React.useState();
  const [appIsReady, setAppIsReady] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [pendingOnboarding, setPendingOnboarding] = useState<null | { email: string; userId: string; step: string }>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Check navigation state
        const savedStateString = await getItem("NAVIGATION_STATE", false);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        if (state !== undefined) {
          setInitialState(state);
        }

        // Check onboarding status
        let onboarded = await getItem("ONBOARDED");
        if (onboarded === "1") {
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
          await setItem("ONBOARDED", "1");
        }

        // Check for pending onboarding state
        const onboardingStateString = await getItem("ONBOARDING_STATE");
        if (onboardingStateString) {
          try {
            const onboardingState = JSON.parse(onboardingStateString);
            console.log("Read ONBOARDING_STATE on app launch:", onboardingState);
            if (onboardingState.step === "verifyEmail" && onboardingState.email && onboardingState.userId) {
              setPendingOnboarding(onboardingState);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      } catch (error) {
        console.warn("Error during app preparation:", error);
        console.error(error);
        // Default to skipping onboarding on error
        setShowOnboarding(false);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && (fontsLoaded || fontError) && showOnboarding !== null) {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Error hiding splash screen:", error);
        console.error(error);
      }
    }
  }, [appIsReady, fontsLoaded, fontError, showOnboarding]);

  // Navigate to VerifyEmailScreen if pending onboarding state exists
  useEffect(() => {
    if (
      appIsReady &&
      pendingOnboarding &&
      navigationRef.current != null &&
      showOnboarding === false
    ) {
      console.log("Navigating to VerifyEmailScreen with:", pendingOnboarding);
      (navigationRef as any).navigate("VerifyEmailScreen", {
        email: pendingOnboarding.email,
        id: pendingOnboarding.userId,
      });
    }
  }, [appIsReady, pendingOnboarding, navigationRef, showOnboarding]);

  if (!appIsReady || (!fontsLoaded && !fontError) || showOnboarding === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <NotificationProvider>
            <LockProvider>
              <VersionUpdateProvider>
                <NavigationContainer
                  ref={navigationRef}
                  initialState={initialState}
                >
                  <StatusBar barStyle={"default"} />
                  <Router showOnboarding={showOnboarding} />
                  <FlashMessage
                    statusBarHeight={StatusBar.currentHeight || 0}
                    position="top"
                    MessageComponent={FlashMessageComponent}
                  />
                </NavigationContainer>
              </VersionUpdateProvider>
            </LockProvider>
          </NotificationProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
