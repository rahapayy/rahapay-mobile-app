import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import Airtel from "../../assets/svg/airtelbig.svg";
import Mtn from "../../assets/svg/mtnbig.svg";
import Eti from "../../assets/svg/9mobilebig.svg";
import Glo from "../../assets/svg/globig.svg";
import Dstv from "../../assets/svg/dstv.svg";
import Gotv from "../../assets/svg/gotv.svg";
import Startimes from "../../assets/svg/startimes.svg";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "../../components/SwipeButton";
import { AppStackParamList } from "../../types/RootStackParams";
import { services } from "@/services";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { AxiosError } from "axios";
import { DataPurchasePayload } from "@/services/modules/data";

type ReviewSummaryScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "ReviewSummaryScreen"
>;

const ReviewSummaryScreen: React.FC<ReviewSummaryScreenProps> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { transactionType, ...params } = route.params;

  const { title, icon } = getTransactionDetails(transactionType, params);
  const summaryItems = getSummaryItems(transactionType, params);

  const handleSwipeConfirm = async (reset: () => void) => {
    setIsLoading(true);
    try {
      let response;
      switch (transactionType) {
        case "airtime":
          const airtimeParams = params as {
            selectedOperator: string;
            phoneNumber: string;
            amount: number;
            saveBeneficiary?: boolean;
          };
          const airtimePayload = {
            amount: airtimeParams.amount,
            networkType: airtimeParams.selectedOperator.toLowerCase(),
            phoneNumber: airtimeParams.phoneNumber,
            saveBeneficiary: airtimeParams.saveBeneficiary || false,
          };
          response = await services.airtimeService.purchaseAirtime(
            airtimePayload
          );
          break;

        case "cableTv":
          const cableParams = params as {
            service: string;
            planId: string;
            price: number;
            cardNumber: string;
            customerName: string;
          };
          const cablePayload = {
            cableName: cableParams.service.toUpperCase(),
            planId: cableParams.planId,
            smartCardNo: cableParams.cardNumber,
            customerName: cableParams.customerName || "Unknown",
          };
          response = await services.cableService.purchaseCable(cablePayload);
          break;

        case "data":
          const dataParams = params as {
            selectedOperator: string;
            selectedPlan: { plan_id: string; amount: number };
            phoneNumber: string;
            saveBeneficiary?: boolean;
          };
          const dataPayload: DataPurchasePayload = {
            planId: dataParams.selectedPlan.plan_id,
            networkType: dataParams.selectedOperator.toLowerCase(),
            phoneNumber: dataParams.phoneNumber,
            saveBeneficiary: dataParams.saveBeneficiary || false,
          };
          response = await services.dataService.purchaseData(dataPayload);
          break;

        // case "education":
        //   const educationParams = params as { plan_id: string; quantity: number };
        //   response = await services.apiClient.post("/exam/", {
        //     examId: educationParams.plan_id,
        //     quantity: educationParams.quantity,
        //   });
        //   break;

        case "electricity":
          const electricityParams = params as {
            meterNumber: string;
            amount: string;
            id: string;
            saveBeneficiary?: boolean;
          };
          const electricityPayload = {
            meterNumber: electricityParams.meterNumber,
            amount: parseFloat(electricityParams.amount),
            discoId: electricityParams.id,
            saveBeneficiary: electricityParams.saveBeneficiary || false,
          };
          response = await services.electricityService.purchaseElectricity(
            electricityPayload
          );
          break;

        default:
          throw new Error("Unknown transaction type");
      }

      const status =
        response.status === "success" || response.data?.success
          ? "success"
          : "failed";
      navigation.navigate("TransactionStatusScreen", { status });
    } catch (error: any) {
      handleError(error, transactionType);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText} allowFontScaling={false}>
            Review Summary
          </Text>
        </View>

        <View style={styles.imageContainer}>
          {icon}
          <Text style={styles.itemText} allowFontScaling={false}>
            {title}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.container}>
            <Text style={styles.headText} allowFontScaling={false}>
              Transaction Summary
            </Text>
            {summaryItems.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  {item.label}
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {item.value}
                </Text>
              </View>
            ))}
            <View style={styles.row}>
              <Text style={styles.titleText} allowFontScaling={false}>
                Status
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.completedText} allowFontScaling={false}>
                  Pending
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.swipeButtonContainer}>
            <SwipeButton onConfirm={handleSwipeConfirm} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function getTransactionDetails(
  type: string,
  params: any
): { title: string; icon: React.ReactNode | null } {
  switch (type) {
    case "airtime":
      const airtimeParams = params as { selectedOperator: string };
      return {
        title: `${airtimeParams.selectedOperator.toUpperCase()} Airtime`,
        icon: (
          <>
            {airtimeParams.selectedOperator === "Airtel" && (
              <Airtel width={100} height={100} />
            )}
            {airtimeParams.selectedOperator === "Mtn" && (
              <Mtn width={100} height={100} />
            )}
            {airtimeParams.selectedOperator === "9Mobile" && (
              <Eti width={100} height={100} />
            )}
            {airtimeParams.selectedOperator === "Glo" && (
              <Glo width={100} height={100} />
            )}
          </>
        ),
      };
    case "cableTv":
      const cableParams = params as { service: string };
      return {
        title: `${cableParams.service.toUpperCase()} Subscription`,
        icon: (
          <>
            {cableParams.service.toLowerCase() === "dstv" && (
              <Dstv width={100} height={100} />
            )}
            {cableParams.service.toLowerCase() === "gotv" && (
              <Gotv width={100} height={100} />
            )}
            {cableParams.service.toLowerCase() === "startime" && (
              <Startimes width={100} height={100} />
            )}
          </>
        ),
      };
    case "data":
      const dataParams = params as { selectedOperator: string };
      return {
        title: `${dataParams.selectedOperator.toUpperCase()} Data Bundle`,
        icon: (
          <>
            {dataParams.selectedOperator === "Airtel" && (
              <Airtel width={100} height={100} />
            )}
            {dataParams.selectedOperator === "Mtn" && (
              <Mtn width={100} height={100} />
            )}
            {dataParams.selectedOperator === "9Mobile" && (
              <Eti width={100} height={100} />
            )}
            {dataParams.selectedOperator === "Glo" && (
              <Glo width={100} height={100} />
            )}
          </>
        ),
      };
    case "education":
      const educationParams = params as { exam: string };
      return { title: educationParams.exam, icon: null };
    case "electricity":
      const electricityParams = params as {
        selectedService: string;
        meterType: string;
      };
      return {
        title: `${electricityParams.selectedService} Bill (${electricityParams.meterType})`,
        icon: null,
      };
    default:
      return { title: "UNKNOWN TRANSACTION", icon: null };
  }
}

function getSummaryItems(
  type: string,
  params: any
): { label: string; value: string }[] {
  const date = new Date().toLocaleString();
  switch (type) {
    case "airtime":
      const airtimeParams = params as { amount: number; phoneNumber: string };
      return [
        { label: "Amount", value: `₦ ${airtimeParams.amount}` },
        { label: "Recipient", value: airtimeParams.phoneNumber },
        { label: "Date", value: date },
      ];
    case "cableTv":
      const cableParams = params as {
        price: number;
        customerName: string;
        planName: string;
        cardNumber: string;
      };
      return [
        { label: "Amount", value: `₦${cableParams.price}` },
        { label: "Account Name", value: cableParams.customerName },
        { label: "Package", value: cableParams.planName },
        { label: "Smartcard Number", value: cableParams.cardNumber },
        { label: "Date", value: date },
      ];
    case "data":
      const dataParams = params as {
        selectedPlan: { amount: number; plan: string; days: string };
        phoneNumber: string;
      };
      return [
        { label: "Amount", value: `₦ ${dataParams.selectedPlan.amount}` },
        {
          label: "Package",
          value: `${dataParams.selectedPlan.plan} - ${dataParams.selectedPlan.days}`,
        },
        { label: "Recipient", value: dataParams.phoneNumber },
        { label: "Date", value: date },
      ];
    case "education":
      const educationParams = params as {
        amount: string;
        serviceType: string;
        quantity: number;
        phoneNumber: string;
      };
      return [
        { label: "Amount", value: educationParams.amount },
        { label: "Service", value: educationParams.serviceType },
        { label: "Quantity", value: educationParams.quantity.toString() },
        { label: "Phone Number", value: educationParams.phoneNumber },
        { label: "Date", value: date },
      ];
    case "electricity":
      const electricityParams = params as {
        amount: string;
        meterNumber: string;
        customerName: string;
        selectedService: string;
        meterType: string;
      };
      return [
        { label: "Amount", value: `₦${electricityParams.amount}` },
        { label: "Meter Number", value: electricityParams.meterNumber },
        { label: "Account Name", value: electricityParams.customerName },
        { label: "Disco", value: electricityParams.selectedService },
        { label: "Meter Type", value: electricityParams.meterType },
        { label: "Date", value: date },
      ];
    default:
      return [{ label: "Error", value: "Unknown transaction type" }];
  }
}

function handleError(error: any, type: string) {
  let message = "An unexpected error occurred. Please try again.";
  if (error instanceof AxiosError && error.response) {
    message = error.response.data?.message || message;
    if (Array.isArray(message)) message = message[0];
  } else if (error.message?.includes("Network")) {
    message = "Network error. Please check your connection and try again.";
  } else if (error.message?.includes("Timeout")) {
    message = "Request timed out. Please try again later.";
  } else if (error.response?.status === 503) {
    message = "The server is currently unavailable. Please try again later.";
  } else if (error.response?.status === 400) {
    message = "Bad request. Please check the input values.";
  }
  handleShowFlash({ message, type: "danger" });
}

export default ReviewSummaryScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: { marginRight: SPACING },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  itemText: {
    fontSize: FONT_SIZE.small,
    fontFamily: "Outfit-Medium",
    paddingVertical: SPACING * 2,
  },
  content: { padding: 16 },
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING,
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING,
  },
  row: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  descriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: "#9BA1A8",
  },
  statusContainer: {
    padding: 8,
    backgroundColor: "#FFEFC3",
    borderRadius: 16,
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#FFCC3D",
  },
  swipeButtonContainer: {
    marginTop: SPACING * 5,
  },
});
