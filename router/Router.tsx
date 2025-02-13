import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import LoadingIndicator from "../components/LoadingIndicator";
import { useAuth } from "../services/AuthContext";

const Stack = createNativeStackNavigator();

const Router = () => {
  const { isAuthenticated, isAppReady } = useAuth();

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]); // Debugging log to check state changes

  if (!isAppReady) {
    return <LoadingIndicator />;
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
  );
};

export default Router;
