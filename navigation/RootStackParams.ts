export type RootStackParamList = {
  HomeScreen: undefined;
  AirtimeScreen: undefined;
  DataScreen: undefined;
  ElectricityScreen: undefined;
  TransferToUserScreen: undefined;
  TvSubscriptionScreen: undefined;
  TransactionHistoryScreen: undefined;
  TransactionSummaryScreen: undefined;
  FundWalletScreen: undefined;
  NotificationScreen: undefined;
  AgentAccountVerificationScreen: undefined;
  ChangePasswordScreen: undefined;
  ChangePinScreen: undefined;
  EnableNotificationScreen: undefined;
  HelpAndSupportScreen: undefined;
  PersonalInformationScreen: undefined;
  ReferralScreen: undefined;
  ReviewDataSummaryScreen: undefined;
  ReviewAirtimeSummaryScreen: {
    selectedOperator: string;
    phoneNumber: string;
    amount: number;
  };
  TransactionStatusScreen: { status: "successful" | "failed" };
  BettingScreen: undefined;
  TransferScreen: undefined;
  EducationScreen: undefined;
  CustomerCareScreen: undefined;
  CableServiceDetailsScreen: undefined;
  CardDetailsScreen: undefined;
  ReviewCableTvSummaryScreen: undefined;
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
