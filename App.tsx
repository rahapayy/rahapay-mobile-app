import React, { useEffect } from "react";
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
import "./global.css";
import { LockProvider } from "./context/LockContext";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://b6d56a13d87e9557b6e7b3c7b14ee515@o4508189082648576.ingest.de.sentry.io/4509181912678480",
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

const queryClient = new QueryClient();

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

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

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (error) {
        console.warn("Error in preventAutoHideAsync:", error);
      }
    };
    prepare();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
});