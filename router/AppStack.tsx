import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../navigation/Bottomtab/BottomTab";
import AirtimeScreen from "../screens/Services/AirtimeScreen";
import DataScreen from "../screens/Services/DataScreen";
import ElectricityScreen from "../screens/Services/Electricity/ElectricityScreen";
import TransferToUser from "../screens/Services/TransferToUser";
import TvSubscriptionScreen from "../screens/Services/CableTv/TvSubscriptionScreen";
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
import TransactionStatusScreen from "../screens/TransactionStatusScreen";
import ReviewAirtimeSummaryScreen from "../screens/ServiceReviewScreens/ReviewAirtimeSummaryScreen";
import ReviewDataSummaryScreen from "../screens/ServiceReviewScreens/ReviewDataSummaryScreen";
import BettingScreen from "../screens/Services/BettingScreen";
import TransferScreen from "../screens/Services/TransferScreen";
import EducationScreen from "../screens/Services/Education/EducationScreen";
import CustomerCareScreen from "../screens/CustomerCareScreen";
import ServiceDetailsScreen from "../screens/Services/CableTv/CableServiceDetailsScreen";
import CardDetailsScreen from "../screens/Services/CableTv/CardDetailsScreen";
import ReviewCableTvSummaryScreen from "../screens/ServiceReviewScreens/ReviewCableTvSummaryScreen";
import MeterTypeScreen from "../screens/Services/Electricity/MeterTypeScreen";
import ElectricityDetailsScreen from "../screens/Services/Electricity/ElectricityDetailsScreen";
import ReviewElectricitySummaryScreen from "../screens/ServiceReviewScreens/ReviewElectricitySummaryScreen";
import { RootStackParamList } from "../navigation/RootStackParams";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Screen
        name="ReviewDataSummaryScreen"
        component={ReviewDataSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewAirtimeSummaryScreen"
        component={ReviewAirtimeSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionStatusScreen"
        component={TransactionStatusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BettingScreen"
        component={BettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransferScreen"
        component={TransferScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EducationScreen"
        component={EducationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomerCareScreen"
        component={CustomerCareScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CableServiceDetailsScreen"
        component={ServiceDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CardDetailsScreen"
        component={CardDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewCableTvSummaryScreen"
        component={ReviewCableTvSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MeterTypeScreen"
        component={MeterTypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ElectricityDetailsScreen"
        component={ElectricityDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewElectricitySummaryScreen"
        component={ReviewElectricitySummaryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
