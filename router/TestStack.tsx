import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../navigation/Bottomtab/BottomTab";
import ServicesScreen from "../screens/ServicesScreen";
import WalletScreen from "../screens/WalletScreen";
import CardsScreen from "../screens/CardsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AirtimeScreen from "../screens/Services/AirtimeScreen";
import DataScreen from "../screens/Services/DataScreen";
import ElectricityScreen from "../screens/Services/ElectricityScreen";
import TransferToUser from "../screens/Services/TransferToUser";
import TvSubscriptionScreen from "../screens/Services/TvSubscriptionScreen";
import Onboarding from "../components/onboarding/Onboarding";
import WelcomeScreen from "../screens/WelcomeScreen";
import CreateAccountScreen from "../screens/Auth/CreateAccount/CreateAccountScreen";
import VerifyEmailScreen from "../screens/Auth/CreateAccount/VerifyEmailScreen";
import ResetPasswordScreen from "../screens/Auth/ForgotPassword/ResetPasswordScreen";
import EnterCodeScreen from "../screens/Auth/ForgotPassword/EnterCodeScreen";
import CreateNewPasswordScreen from "../screens/Auth/ForgotPassword/CreateNewPasswordScreen";
import LoginScreen from "../screens/Auth/Login/LoginScreen";
import CreateTransactionPinScreen from "../screens/Auth/CreateAccount/CreatePinScreen";
import ConfirmPinScreen from "../screens/Auth/CreateAccount/ConfirmPinScreen";
import SuccessfulScreen from "../screens/Auth/CreateAccount/SuccessfulScreen";

const Stack = createNativeStackNavigator();

const TestStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
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
        <Stack.Screen
          name="HomeScreen"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ServicesScreen"
          component={ServicesScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="WalletScreen"
          component={WalletScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CardsScreen"
          component={CardsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AirtimeScreen"
          component={AirtimeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DataScreen"
          component={DataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ElectricityScreen"
          component={ElectricityScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransferToUserScreen"
          component={TransferToUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TvSubscriptionScreen"
          component={TvSubscriptionScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestStack;
