import React, { useEffect, useState, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import { View, Image } from "react-native";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import { useAuth } from "../services/AuthContext";
import { RootStackParamList } from "../types/RootStackParams";
import { getItem } from "@/utils/storage";
import { navigationRef } from "@/router/navigationService";
import { handleShowFlash } from "@/components/FlashMessageComponent";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#5136C1",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/animation/logo.gif")}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
    </View>
  );
};

const Router = ({ showOnboarding }: { showOnboarding: boolean }) => {
  const {
    isAuthenticated,
    isAppReady,
    userInfo,
  } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [wasOnline, setWasOnline] = useState<boolean>(true); // Track previous state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      setIsOnline(connected);
      if (!connected && wasOnline) {
        handleShowFlash({
          message: "No internet connection. Some features may not work.",
          type: "danger",
        });
      }
      setWasOnline(connected);
    });
    NetInfo.fetch().then((state) => {
      const connected = state.isConnected ?? true;
      setIsOnline(connected);
      setWasOnline(connected);
    });
    return () => unsubscribe();
  }, [wasOnline]);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });
  };

  const navigationStack = useMemo(() => {
    if (isLoading || !isAppReady) {
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      );
    }
    if (isAuthenticated) {
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen
            name="AppStack"
            component={AppStack}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      );
    } else {
      return (
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen name="AuthRoute" options={{ headerShown: false }}>
            {(props) => (
              <AuthRoute {...props} showOnboarding={showOnboarding} />
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
      );
    }
  }, [isAuthenticated, isAppReady, isLoading, showOnboarding]);

  useEffect(() => {
    if (isAppReady) {
      setIsLoading(false);
    }
  }, [isAppReady]);

  // Security lock check: navigate to auth route if locked
  useEffect(() => {
    const checkSecurityLock = async () => {
      const lock = await getItem("SECURITY_LOCK");
      if (lock === "true" && navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: "AuthRoute" }],
        });
      }
    };
    if (isAppReady) {
      checkSecurityLock();
    }
  }, [isAuthenticated, isAppReady]);

  return (
    <>
      {navigationStack}
    </>
  );
};

export default Router;