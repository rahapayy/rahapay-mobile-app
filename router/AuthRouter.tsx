import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import Onboarding from "../components/onboarding/Onboarding";
import CreateAccountScreen from "../screens/Auth/CreateAccount/CreateAccountScreen";
import VerifyEmailScreen from "../screens/Auth/CreateAccount/VerifyEmailScreen";
import ResetPasswordScreen from "../screens/Auth/ForgotPassword/ResetPasswordScreen";
import EnterCodeScreen from "../screens/Auth/ForgotPassword/EnterCodeScreen";
import CreateNewPasswordScreen from "../screens/Auth/ForgotPassword/CreateNewPasswordScreen";
import LoginScreen from "../screens/Auth/Login/LoginScreen";
import SuccessfulScreen from "../screens/Auth/CreateAccount/SuccessfulScreen";
import CreateTransactionPinScreen from "../screens/Auth/CreateAccount/CreateTransactionPinScreen";
import ExistingUserScreen from "../screens/Auth/Login/ExistingUserScreen";
import { AuthStackParamList } from "../types/RootStackParams";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthRoute = ({ showOnboarding }: { showOnboarding: boolean }) => {
  const [initialRoute, setInitialRoute] = useState<keyof AuthStackParamList | undefined>(undefined);
  const [initialParams, setInitialParams] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingState = async () => {
      try {
        const onboardingStateString = await AsyncStorage.getItem("ONBOARDING_STATE");
        if (onboardingStateString) {
          const onboardingState = JSON.parse(onboardingStateString);
          if (
            onboardingState.step === "verifyEmail" &&
            onboardingState.email &&
            onboardingState.userId
          ) {
            setInitialRoute("VerifyEmailScreen");
            setInitialParams({ email: onboardingState.email, id: onboardingState.userId });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
      setInitialRoute("LoginScreen");
      setInitialParams(undefined);
      setLoading(false);
    };
    checkOnboardingState();
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
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
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmailScreen"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
        initialParams={initialRoute === "VerifyEmailScreen" ? initialParams : undefined}
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
        name="SuccessfulScreen"
        component={SuccessfulScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExistingUserScreen"
        component={ExistingUserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTransactionPinScreen"
        component={CreateTransactionPinScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthRoute;