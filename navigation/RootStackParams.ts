export type RootStackParamList = {
  HomeScreen: undefined;
  AirtimeScreen: undefined;
  DataScreen: undefined;
  ElectricityScreen: undefined;
  TransferToUserScreen: undefined;
  TvSubscriptionScreen: undefined;
  TransactionHistoryScreen: undefined;
  TransactionSummaryScreen: {
    transaction: {
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
    phoneNumber: string;
  };
  ReviewAirtimeSummaryScreen: {
    selectedOperator: string;
    phoneNumber: string;
    amount: number;
  };
  TransactionStatusScreen: {
    status: "pending" | "failed" | "successful";
  };
  BettingScreen: undefined;
  TransferScreen: undefined;
  EducationScreen: undefined;
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
  MeterTypeScreen: {
    disco: string;
    planId: string;
    meterType: string;
  };
  ElectricityDetailsScreen: {
    disco: string;
    planId: string;
    meterType: string;
  };
  ReviewElectricitySummaryScreen: {
    disco: string;
    planId: string;
    meterType: string;
    meterNumber: string;
    amount: string;
    phoneNumber: string;
  };
  Onboarding: undefined;
  WelcomeScreen: undefined;
  ServicesScreen: undefined;
  WalletScreen: undefined;
  CardScreen: undefined;
  ProfileScreen: undefined;
};
