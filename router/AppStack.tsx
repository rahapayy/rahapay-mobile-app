import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../navigation/Bottomtab/BottomTab";
import AirtimeScreen from "../screens/Services/AirtimeScreen";
import DataScreen from "../screens/Services/DataScreen";
import ElectricityScreen from "../screens/Services/ElectricityScreen";
import TransferToUser from "../screens/Services/TransferToUser";
import TvSubscriptionScreen from "../screens/Services/TvSubscriptionScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import TransactionSummaryScreen from "../screens/TransactionSummaryScreen";
import FundWalletScreen from "../screens/FundWalletScreen";
import NotificationScreen from "../screens/NotificationScreen";
import AgentAccountVerificationScreen from "../screens/Profile/AgentAccountVerificationScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import ChangePinScreen from "../screens/Profile/ChangePinScreen";
import EnableNotificationScreen from "../screens/Profile/EnableNotificationScreen";
import HelpAndSupportScreen from "../screens/Profile/HelpAndSupportScreen";
import PersonalInformationScreen from "../screens/Profile/PersonalInformationScreen";
import ReferralScreen from "../screens/Profile/ReferralScreen";

const Stack = createNativeStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
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
      <Stack.Screen
        name="TransactionHistoryScreen"
        component={TransactionHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionSummaryScreen"
        component={TransactionSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FundWalletScreen"
        component={FundWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AgentAccountVerificationScreen"
        component={AgentAccountVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePinScreen"
        component={ChangePinScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EnableNotificationScreen"
        component={EnableNotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpAndSupportScreen"
        component={HelpAndSupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReferralScreen"
        component={ReferralScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
