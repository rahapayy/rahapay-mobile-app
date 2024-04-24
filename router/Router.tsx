import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import { ActivityIndicator, View } from "react-native";
import COLORS from "../config/colors";

const Stack = createNativeStackNavigator();

const Router = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Local state to simulate authentication

  useEffect(() => {
    // In your actual app, here you'd make the API call to verify if the user is authenticated.
    // For now, we'll simulate an app ready state without actual authentication API.

    // Simulate a loading time.
    setTimeout(() => {
      setIsAppReady(true);

      // Toggle this line to simulate an "authenticated" or "unauthenticated" state
      setIsAuthenticated(true); // Set to false if you want to see the AuthRoute
    }, 3000);
  }, []);

  if (!isAppReady) {
    // Loading indicator screen
    return (
      <View
        style={{
          backgroundColor: "#fff", 
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.violet600} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* This conditional will determine which stack to display based on `isAuthenticated` */}
        {/* {isAuthenticated ? (
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{ headerShown: false }}
          />
        ) : ( */}
          <Stack.Screen
            name="AuthRoute"
            component={AuthRoute}
            options={{ headerShown: false }}
          />
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;