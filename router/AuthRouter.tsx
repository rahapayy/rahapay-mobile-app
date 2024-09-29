import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getItem, setItem } from "../utils/ayncStorage";
import LoadingIndicator from "../components/LoadingIndicator";
import WelcomeScreen from "../screens/WelcomeScreen";
import Onboarding from "../components/onboarding/Onboarding";
import CreateAccountScreen from "../screens/Auth/CreateAccount/CreateAccountScreen";
import VerifyEmailScreen from "../screens/Auth/CreateAccount/VerifyEmailScreen";
import ResetPasswordScreen from "../screens/Auth/ForgotPassword/ResetPasswordScreen";
import EnterCodeScreen from "../screens/Auth/ForgotPassword/EnterCodeScreen";
import CreateNewPasswordScreen from "../screens/Auth/ForgotPassword/CreateNewPasswordScreen";
import LoginScreen from "../screens/Auth/Login/LoginScreen";
import SuccessfulScreen from "../screens/Auth/CreateAccount/SuccessfulScreen";
import CreateTransactionPinScreen from "../screens/Auth/CreateAccount/CreatePinScreen";
import ExistingUserScreen from "../screens/Auth/Login/ExistingUserScreen";
import { RootStackParamList } from "../types/RootStackParams";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthRoute = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem("onboarded");
    if (onboarded == "1") {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
      await setItem("onboarded", "1");
    }
  };

  if (showOnboarding === null) {
    return <LoadingIndicator />;
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
        name="CreatePinScreen"
        component={CreateTransactionPinScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SuccessfulScreen"
        component={SuccessfulScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExistingUserScreen"
        component={ExistingUserScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthRoute;
