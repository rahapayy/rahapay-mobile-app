import { ReactNode } from "react";
import * as Notifications from "expo-notifications";

// Define a discriminated union for all possible review summary params
type ReviewSummaryParams =
  | {
      transactionType: "airtime";
      selectedOperator: string;
      phoneNumber: string;
      amount: number;
      saveBeneficiary?: boolean;
    }
  | {
      transactionType: "cableTv";
      service: string;
      planId: string;
      price: number;
      cardNumber: string;
      planName: string;
      customerName: string;
    }
  | {
      transactionType: "data";
      selectedOperator: string;
      selectedPlan: {
        plan: string;
        days: string;
        plan_id: string;
        amount: number;
      };
      saveBeneficiary?: boolean;
      phoneNumber: string;
    }
  | {
      transactionType: "education";
      exam: string;
      plan_id: string;
      amount: string;
      serviceType: string;
      phoneNumber: string;
      quantity: number;
    }
  | {
      transactionType: "electricity";
      disco: string;
      id: string;
      customerName: string;
      selectedService: string;
      planName: string;
      meterType: "PREPAID" | "POSTPAID";
      meterNumber: string;
      amount: string;
      phoneNumber: string;
      saveBeneficiary?: boolean;
    };

// App Stack (Main application screens)
export type AppStackParamList = {
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
      purpose: string;
      amount: number;
      created_at: number | string;
      status: string;
      tranxType: string;
      referenceId: string;
      metadata?: {
        networkType?: string; // For AIRTIME_PURCHASE, DATA_PURCHASE (e.g., "MTN", "Airtel")
        phoneNumber?: string; // For AIRTIME_PURCHASE, DATA_PURCHASE, ELECTRICITY_PURCHASE
        cableName?: string; // For CABLE_SUBSCRIPTION (e.g., "DSTV", "GOTV")
        smartCardNo?: string; // For CABLE_SUBSCRIPTION
        planName?: string; // For DATA_PURCHASE, CABLE_SUBSCRIPTION
        sender?: string; // For WALLET_TRANSFER
        recipient?: string; // For WALLET_TRANSFER
        discoId?: string; // For ELECTRICITY_PURCHASE (e.g., "eko-electric")
        discoName?: string; // For ELECTRICITY_PURCHASE (e.g., "Eko (EKEDC)")
        electricity?: string; // Temporary fallback for discoName (e.g., "Jos (JED)")
        meterNumber?: string; // For ELECTRICITY_PURCHASE
        meterType?: "Prepaid" | "Postpaid"; // For ELECTRICITY_PURCHASE
        electricity_token?: string; // For ELECTRICITY_PURCHASE (Prepaid only)
        electricity_units?: string; // For ELECTRICITY_PURCHASE (Prepaid only)
        customerName?: string; // For ELECTRICITY_PURCHASE
        customerAddress?: string; // For ELECTRICITY_PURCHASE
        saveBeneficiary?: boolean;
      };
    };
  };
  VerifyOtp: undefined;
  FundWalletScreen: undefined;
  NotificationScreen: undefined;
  AgentAccountVerificationScreen: undefined;
  ChangePasswordScreen: undefined;
  ChangePinScreen: { type: "transactionPin"; otp: string };
  SelectPinChangeScreen: undefined;
  EnableNotificationScreen: undefined;
  HelpAndSupportScreen: undefined;
  TransferDispute: undefined;
  ReportNewIssue: undefined;
  SelectQuestionType: { businessType: string };
  DisputeSubmission: { businessType: string; questionType: string };
  PersonalInformationScreen: undefined;
  ReferralScreen: undefined;
  ReviewSummaryScreen: ReviewSummaryParams;
  TransactionStatusScreen: {
    status: "pending" | "failed" | "success" | "successful";
    transactionType?: string;
    transactionDetails?: {
      electricity_token?: string;
      electricity_units?: string;
    };
    errorMessage?: string;
  };
  CustomerCareScreen: undefined;
  CableServiceDetailsScreen: undefined;
  CardDetailsScreen: undefined;
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
  ServicesScreen: undefined;
  WalletScreen: undefined;
  CardScreen: undefined;
  ProfileScreen: undefined;
  EditTagScreen: undefined;
  CreateTagScreen: undefined;
  TicketScreen: undefined;
  ExistingUserScreen: undefined;
  NotificationDetail: {
    notification: Notifications.Notification;
  };
  TransactionPinScreen: {
    transactionType:
      | "electricity"
      | "data"
      | "airtime"
      | "cableTv"
      | "education";
    params:
      | {
          selectedOperator: string;
          phoneNumber: string;
          amount: number;
          saveBeneficiary?: boolean;
        } // Airtime
      | {
          service: string;
          planId: string;
          price: number;
          cardNumber: string;
          planName: string;
          customerName: string;
          saveBeneficiary?: boolean;
        } // Cable TV
      | {
          selectedOperator: string;
          selectedPlan: { plan_id: string; amount: number };
          phoneNumber: string;
          saveBeneficiary?: boolean;
        } // Data
      | {
          meterNumber: string;
          amount: string;
          id: string;
          saveBeneficiary?: boolean;
        } // Electricity
      | {
          exam: string;
          amount: string;
          serviceType: string;
          quantity: number;
          phoneNumber: string;
        }; // Education
  };
};

// Auth Stack (Authentication-related screens)
export type AuthStackParamList = {
  Onboarding: undefined;
  WelcomeScreen: undefined;
  CreateAccountScreen: undefined;
  VerifyEmailScreen: { email: string; id: string };
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
};

// Lock Stack (Lock screen-related screens)
export type LockStackParamList = {
  LockScreen: undefined;
  PasswordReauthScreen: { onPasswordSuccess: () => void };
};

// Root Stack (Top-level navigation)
export type RootStackParamList = {
  AppStack: undefined;
  AuthRoute: { showOnboarding: boolean };
  LockStack: undefined;
  LoadingScreen: undefined;
};

// Combined Route Stack (for convenience, if needed)
export type RouteStackParamList = AppStackParamList & AuthStackParamList;
