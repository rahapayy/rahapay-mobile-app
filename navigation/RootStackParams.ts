export type RootStackParamList = {
  HomeScreen: undefined;
  AirtimeScreen: undefined;
  DataScreen: undefined;
  ElectricityScreen: undefined;
  BettingScreen: undefined;
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
  };
  Onboarding: undefined;
  WelcomeScreen: undefined;
  ServicesScreen: undefined;
  WalletScreen: undefined;
  CardScreen: undefined;
  ProfileScreen: undefined;
  EditTagScreen: undefined;
};
