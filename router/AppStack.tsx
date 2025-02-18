import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../components/BottomTab";
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
import BettingScreen from "../screens/Services/Betting/BettingScreen";
import TransferScreen from "../screens/Services/TransferScreen";
import EducationScreen from "../screens/Services/Education/EducationScreen";
import CustomerCareScreen from "../screens/CustomerCareScreen";
import ReviewCableTvSummaryScreen from "../screens/ServiceReviewScreens/ReviewCableTvSummaryScreen";
import ReviewElectricitySummaryScreen from "../screens/ServiceReviewScreens/ReviewElectricitySummaryScreen";
import { RootStackParamList } from "../types/RootStackParams";
import EducationServiceType from "../screens/Services/Education/EducationServiceType";
import EducationDetailsScreen from "../screens/Services/Education/EducationDetailsScreen";
import ReviewEducationSummaryScreen from "../screens/ServiceReviewScreens/ReviewEducationSummaryScreem";
import EditTagScreen from "../screens/Profile/EditTagScreen";
import SelectPinChangeScreen from "../screens/Profile/SelectPinChangeScreen";
import BettingSuccess from "../screens/Services/Betting/BettingSuccess";
import CreateTagScreen from "../screens/Profile/CreateTagScreen";
import TicketScreen from "../screens/Services/TicketScreen";

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
        name="SelectPinChangeScreen"
        component={SelectPinChangeScreen}
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
        options={{ headerShown: false, presentation: "containedModal" }}
      />
      <Stack.Screen
        name="BettingScreen"
        component={BettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BettingSuccessScreen"
        component={BettingSuccess}
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
        name="ReviewCableTvSummaryScreen"
        component={ReviewCableTvSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewElectricitySummaryScreen"
        component={ReviewElectricitySummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EducationServiceType"
        component={EducationServiceType}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EducationDetailsScreen"
        component={EducationDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewEducationSummaryScreen"
        component={ReviewEducationSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTagScreen"
        component={EditTagScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTagScreen"
        component={CreateTagScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TicketScreen"
        component={TicketScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
