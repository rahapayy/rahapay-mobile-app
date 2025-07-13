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
import { DataPurchasePayload } from "@/services/modules/data";
import { Loading } from "@/components/common/ui/loading";

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
  const [isRequestingPinReset, setIsRequestingPinReset] = useState(false);

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleForgotPin = async () => {
    setIsRequestingPinReset(true);
    try {
      await services.userService.requestTransactionPinReset();
      handleShowFlash({ message: "OTP sent successfully!", type: "success" });
      navigation.navigate("VerifyOtp", { type: "transactionPin" });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "Failed to send OTP";
      handleShowFlash({ message: errorMessage, type: "danger" });
    } finally {
      setIsRequestingPinReset(false);
    }
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
            saveBeneficiary: boolean;
          };
          const cablePayload = {
            cableName: cableParams.service.toUpperCase(),
            planId: cableParams.planId,
            smartCardNo: cableParams.cardNumber,
            customerName: cableParams.customerName || "Unknown",
            saveBeneficiary: cableParams.saveBeneficiary,
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
          const electricityParams = params as unknown as {
            meterNumber: string;
            phoneNumber: string;
            amount: string;
            selectedService: string;
            meterType: "Prepaid" | "Postpaid";
            discoId: string;
            customerName: string;
            customerAddress: string;
            userId: string;
            saveBeneficiary?: boolean;
          };
          const electricityPayload = {
            meterNumber: electricityParams.meterNumber,
            phoneNumber: electricityParams.phoneNumber,
            amount: parseFloat(electricityParams.amount),
            discoId: electricityParams.discoId,
            meterType: electricityParams.meterType,
            customerName: electricityParams.customerName,
            customerAddress: electricityParams.customerAddress,
            userId: electricityParams.userId,
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
          throw new Error("Education transaction not implemented");
          break;

        default:
          throw new Error("Unknown transaction type");
      }

      const status = response.status === "success" ? "success" : "failed";
      navigation.navigate("TransactionStatusScreen", {
        status,
        transactionType,
        transactionDetails:
          transactionType === "electricity" &&
          response.data &&
          "token" in response.data
            ? {
                electricity_token: (
                  response.data as unknown as { token: string; units: string }
                ).token,
                electricity_units: (
                  response.data as unknown as { token: string; units: string }
                ).units,
              }
            : undefined,
      });
    } catch (error: any) {
      console.error(`Error during ${transactionType} transaction:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      handleShowFlash({
        type: "danger",
        message: errorMessage,
      });

      // Clear the pin input on error
      setPin("");
    } finally {
      setIsLoading(false);
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

  if (isRequestingPinReset) {
    return (
      <View className="bg-white p-4">
        <Loading size="large" color={COLORS.brand.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
          <TouchableOpacity
            style={styles.forgotPinButton}
            onPress={handleForgotPin}
            disabled={isLoading || isRequestingPinReset}
          >
            <Text style={styles.forgotPinText}>Forgot PIN?</Text>
          </TouchableOpacity>
          <View style={styles.keypad}>
            {/* First 3 rows: 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadButton}
                onPress={() => handleNumberPress(num.toString())}
                disabled={isLoading}
              >
                <View style={styles.keypadButtonCircle}>
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {/* Last row: empty, 0, backspace */}
            <View style={{ width: "33.33%" }} />
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress("0")}
              disabled={isLoading}
            >
              <View style={styles.keypadButtonCircle}>
                <Text style={styles.keypadButtonText}>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handleDelete}
              disabled={isLoading}
            >
              <View style={styles.keypadButtonCircle}>
                <Backspace />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isLoading && <Loading size="large" color={COLORS.brand.primary} />}
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
    marginBottom: SPACING * 4,
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
  forgotPinButton: {
    marginBottom: SPACING * 4,
  },
  forgotPinText: {
    color: COLORS.brand.primary,
    fontSize: 16,
    fontFamily: "Outfit-Regular",
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
  keypadButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  bottomRowButtons: {
    // width: "100%",
    // flexDirection: "row",
    // justifyContent: "flex-end",
    // paddingHorizontal: SPACING * 3,
  },
  bottomButton: {
    padding: 10,
  },
});

export default TransactionPinScreen;
