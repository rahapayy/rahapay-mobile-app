import { ReactNode } from "react";

export type RootStackParamList = {
  HomeScreen: undefined;
  AirtimeScreen: undefined;
  DataScreen: undefined;
  ElectricityScreen: undefined;
  BettingScreen: undefined;
  BettingSuccessScreen: undefined;
  TransferScreen: undefined;
  EducationScreen: undefined;
  TransferToUserScreen: undefined;
  TvSubscriptionScreen: undefined;
  TransactionHistoryScreen: undefined;
  TransactionSummaryScreen: {
    transaction: {
      network: string;
      phone_number: string;
      transid: ReactNode;
      metadata: any;
      purpose: string;
      amount: number;
      created_at: number;
      status: string;
      tranxType: string;
      referenceId: string;
    };
  };
  FundWalletScreen: undefined;
  NotificationScreen: undefined;
  AgentAccountVerificationScreen: undefined;
  ChangePasswordScreen: undefined;
  ChangePinScreen: undefined;
  SelectPinChangeScreen: undefined;
  EnableNotificationScreen: undefined;
  HelpAndSupportScreen: undefined;
  PersonalInformationScreen: undefined;
  ReferralScreen: undefined;
  ReviewDataSummaryScreen: {
    selectedOperator: string;
    selectedPlan: {
      plan: string;
      days: string;
      plan_id: string;
      amount: number;
    };
    saveBeneficiary: boolean;
    phoneNumber: string;
  };
  ReviewAirtimeSummaryScreen: {
    selectedOperator: string;
    phoneNumber: string;
    amount: number;
    saveBeneficiary: boolean;
  };
  TransactionStatusScreen: {
    status: "pending" | "failed" | "success";
  };
  CustomerCareScreen: undefined;
  CableServiceDetailsScreen: undefined;
  CardDetailsScreen: undefined;
  ReviewCableTvSummaryScreen: {
    service: string;
    planId: string;
    planPrice: number;
    cardNumber: string;
    planName: string;
  };
  EducationServiceType: {
    exam: string;
    plan_id: string;
    amount: string;
  };
  EducationDetailsScreen: {
    exam: string;
    plan_id: string;
    serviceType: string;
    amount: string;
  };
  ReviewElectricitySummaryScreen: {
    disco: string;
    planId: string;
    planName: string;
    meterType: string;
    meterNumber: string;
    amount: string;
    phoneNumber: string;
  };
  ReviewEducationSummaryScreen: {
    exam: string;
    plan_id: string;
    amount: string;
    serviceType: string;
    phoneNumber: string;
    quantity: number;
  };
  Onboarding: undefined;
  WelcomeScreen: undefined;
  ServicesScreen: undefined;
  WalletScreen: undefined;
  CardScreen: undefined;
  ProfileScreen: undefined;
  EditTagScreen: undefined;
  CreateTagScreen: undefined;
  CreateAccountScreen: undefined;
  VerifyEmailScreen: undefined;
  ExistingUserScreen: undefined;
  ForgotPasswordScreen: undefined;
  CreateNewPasswordScreen: { resetToken: string };
  VerifyOtpScreen: undefined;
  ResetPasswordScreen: undefined;
  LoginScreen: undefined;
  CreatePinScreen: undefined;
  SuccessfulScreen: undefined;
  EnterCodeScreen: undefined;
  CreateTransactionPinScreen: undefined;
  TicketScreen: undefined;
};
