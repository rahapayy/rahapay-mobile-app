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
import HelpAndSupportScreen from "../screens/Profile/help/HelpAndSupportScreen";
import PersonalInformationScreen from "../screens/Profile/PersonalInformationScreen";
import ReferralScreen from "../screens/Profile/ReferralScreen";
import TransactionStatusScreen from "../screens/TransactionStatusScreen";
import BettingScreen from "../screens/Services/Betting/BettingScreen";
import TransferScreen from "../screens/Services/TransferScreen";
import EducationScreen from "../screens/Services/Education/EducationScreen";
import CustomerCareScreen from "../screens/CustomerCareScreen";
import { AppStackParamList } from "../types/RootStackParams";
import EducationServiceType from "../screens/Services/Education/EducationServiceType";
import EducationDetailsScreen from "../screens/Services/Education/EducationDetailsScreen";
import EditTagScreen from "../screens/Profile/EditTagScreen";
import SelectPinChangeScreen from "../screens/Profile/SelectPinChangeScreen";
import BettingSuccess from "../screens/Services/Betting/BettingSuccess";
import CreateTagScreen from "../screens/Profile/CreateTagScreen";
import TicketScreen from "../screens/Services/TicketScreen";
import NotificationDetailScreen from "@/screens/notification/NotificationDetailScreen";
import TransferDisputeScreen from "@/screens/Profile/help/TransferDisputeScreen";
import ReportNewIssueScreen from "@/screens/Profile/help/ReportNewIssueScreen";
import SelectQuestionTypeScreen from "@/screens/Profile/help/SelectQuestionTypeScreen";
import DisputeSubmissionScreen from "@/screens/Profile/help/DisputeSubmissionScreen";
import ReviewSummaryScreen from "@/screens/ServiceReviewScreens";
import TransactionPinScreen from "@/screens/ServiceReviewScreens/TransactionPinScreen";
import VerifyOtpScreen from "@/screens/Profile/VerifyOtpScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
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
        name="ReviewSummaryScreen"
        component={ReviewSummaryScreen}
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
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransferDispute"
        component={TransferDisputeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportNewIssue"
        component={ReportNewIssueScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectQuestionType"
        component={SelectQuestionTypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DisputeSubmission"
        component={DisputeSubmissionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionPinScreen"
        component={TransactionPinScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
