import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getItem } from "../utils/ayncStorage";
import { ActivityIndicator, View } from "react-native";
import COLORS from "../config/colors";
import WelcomeScreen from "../screens/WelcomeScreen";
import Onboarding from "../components/onboarding/Onboarding";
import CreateAccountScreen from "../screens/Auth/CreateAccount/CreateAccountScreen";
import VerifyEmailScreen from "../screens/Auth/CreateAccount/VerifyEmailScreen";
import ResetPasswordScreen from "../screens/Auth/ForgotPassword/ResetPasswordScreen";
import EnterCodeScreen from "../screens/Auth/ForgotPassword/EnterCodeScreen";
import CreateNewPasswordScreen from "../screens/Auth/ForgotPassword/CreateNewPasswordScreen";
import LoginScreen from "../screens/Auth/Login/LoginScreen";
import CreateTransactionPinScreen from "../screens/Auth/CreateAccount/CreateTransactionPinScreen";
import ConfirmPinScreen from "../screens/Auth/CreateAccount/ConfirmPinScreen";
import SuccessfulScreen from "../screens/Auth/CreateAccount/SuccessfulScreen";
import CreateTagScreen from "../screens/Auth/CreateAccount/CreateTagScreen";

const Stack = createNativeStackNavigator();

const AuthRoute = () => {
  const [showOnboarding, setShowOnboarding] = useState<any>(null);
  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem("onboarded");
    if (onboarded == "1") {
      return setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  };

  if (showOnboarding === null) {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.violet600} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {showOnboarding && (
        <>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ headerShown: false }}
          />
        </>
      )}
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmailScreen"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTagScreen"
        component={CreateTagScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EnterCodeScreen"
        component={EnterCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateNewPasswordScreen"
        component={CreateNewPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTransactionPinScreen"
        component={CreateTransactionPinScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmPinScreen"
        component={ConfirmPinScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SuccessfulScreen"
        component={SuccessfulScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthRoute;
