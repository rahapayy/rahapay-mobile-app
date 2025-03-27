import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../types/RootStackParams";
import BackButton from "@/components/common/ui/buttons/BackButton";
import { COLORS, SPACING } from "@/constants/ui";
import Backspace from "@/assets/svg/backspace.svg";
import LottieView from "lottie-react-native";
import { services } from "@/services";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { AxiosError } from "axios";
import { DataPurchasePayload } from "@/services/modules/data";

type TransactionPinScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "TransactionPinScreen"
>;

const TransactionPinScreen: React.FC<TransactionPinScreenProps> = ({
  route,
  navigation,
}) => {
  const { transactionType, params } = route.params;
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handlePinComplete = async (pin: string) => {
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
            transactionPin: pin,
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
            transactionPin: pin,
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
            transactionPin: pin,
          };
          response = await services.dataService.purchaseData(dataPayload);
          break;

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
            transactionPin: pin,
          };
          response = await services.electricityService.purchaseElectricity(
            electricityPayload
          );
          break;

        case "education":
          const educationParams = params as {
            exam: string;
            amount: string;
            serviceType: string;
            quantity: number;
            phoneNumber: string;
          };
          // Add education-specific logic here if applicable
          throw new Error("Education transaction not implemented"); // Placeholder
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
      console.error(`Error during ${transactionType} transaction:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let message = "An unexpected error occurred. Please try again.";
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data;
        message = errorData?.message || message;
        if (Array.isArray(message)) message = message[0];
        if (error.response.status === 401 || message?.includes("pin")) {
          message = "Invalid transaction PIN. Please try again.";
          setPin(""); // Reset PIN for retry
        } else if (error.response.status === 400) {
          message = "Bad request. Please check the transaction details.";
        } else if (error.response.status === 503) {
          message =
            "The server is currently unavailable. Please try again later.";
        }
      } else if (error.message?.includes("Network")) {
        message = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes("Timeout")) {
        message = "Request timed out. Please try again later.";
      }

      handleShowFlash({ message, type: "danger" });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleNumberPress = async (number: string) => {
    if (pin.length < 4 && !isLoading) {
      const newPin = pin + number;
      setPin(newPin);

      if (newPin.length === 4) {
        await handlePinComplete(newPin);
      }
    }
  };

  const renderPinDots = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[styles.pinDot, index < pin.length && styles.filledPinDot]}
        />
      ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <LottieView
            source={require("@/assets/animation/loader.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <BackButton navigation={navigation as any} />
        </View>
        <View style={styles.content}>
          <View style={styles.asterisksContainer}>
            <Text style={styles.asterisks}>* * * *</Text>
          </View>
          <Text style={styles.title}>Enter Transaction Pin</Text>
          <Text style={styles.subtitle}>
            Confirm transaction by entering 4-digit pin
          </Text>
          <View style={styles.pinDotsContainer}>{renderPinDots()}</View>
          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadButton}
                onPress={() => handleNumberPress(num.toString())}
                disabled={isLoading}
              >
                <Text style={styles.keypadButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress("0")}
              disabled={isLoading}
            >
              <Text style={styles.keypadButtonText}>0</Text>
            </TouchableOpacity>
            <View style={styles.bottomRowButtons}>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={handleDelete}
                disabled={isLoading}
              >
                <Backspace />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  asterisksContainer: {
    backgroundColor: "#F0F0FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  asterisks: {
    color: "#5D5FEF",
    fontSize: 16,
    letterSpacing: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Outfit-Medium",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    fontFamily: "Outfit-Regular",
  },
  pinDotsContainer: {
    flexDirection: "row",
    marginBottom: SPACING * 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  filledPinDot: {
    backgroundColor: COLORS.brand.primary,
  },
  keypad: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  keypadButton: {
    width: "33.33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadButtonText: {
    fontSize: 24,
    color: "#000",
    fontFamily: "Outfit-Regular",
  },
  bottomRowButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: SPACING * 3,
  },
  bottomButton: {
    padding: 10,
  },
});

export default TransactionPinScreen;
