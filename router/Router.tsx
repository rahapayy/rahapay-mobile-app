import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppStack from "./AppStack";
import AuthRoute from "./AuthRouter";
import { ActivityIndicator, View } from "react-native";
import COLORS from "../config/colors";
import { AuthContext } from "../context/AuthContext";
import SplashScreen from "../components/SplashScreen"; 

const Stack = createNativeStackNavigator();

const Router = () => {
  const { isAuthenticated, isAppReady } = useContext(AuthContext);

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
