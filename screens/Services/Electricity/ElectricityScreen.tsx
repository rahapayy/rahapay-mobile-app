import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ArrowRight2, TickCircle } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import Button from "../../../components/common/ui/buttons/Button";
import ServiceSelectionModal from "../../../components/modals/Electricity/ServiceSelectionModal";
import {
  MediumText,
  RegularText,
  BoldText,
} from "../../../components/common/Text";
import BasicInput from "@/components/common/ui/forms/BasicInput";
import Label from "@/components/common/ui/forms/Label";
import { services } from "@/services";
import { handleShowFlash } from "@/components/FlashMessageComponent";

const ElectricityScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [meterNumber, setMeterNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [serviceModalVisible, setServiceModalVisible] =
    useState<boolean>(false);
  const [meterType, setMeterType] = useState<"PREPAID" | "POSTPAID">("PREPAID");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null); // New state for persistent error

  const handleServiceSelect = (service: string, id: string) => {
    setSelectedService(service);
    setId(id);
    setMeterNumber("");
    setCustomerName("");
    setIsValidated(false);
    setValidationError(null);
  };

  const validateAmountInput = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setAmount(text);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (meterNumber && id && !isValidating) {
      const timer = setTimeout(() => {
        handleValidateMeter();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [meterNumber, id, meterType]);

  const handleValidateMeter = async () => {
    setIsValidating(true);
    setValidationError(null); // Clear previous error before validating
    try {
      const response = await services.electricityService.validateMeter({
        meterNumber,
        meterId: id!,
        meterType,
      });
      setCustomerName(response.data.name || "Unknown");
      setIsValidated(true);
    } catch (error: any) {
      setCustomerName("");
      setIsValidated(false);
      const errorMsg =
        error.response?.data?.msg || "Failed to validate meter number.";
      setValidationError(errorMsg); // Set persistent error message
      handleShowFlash({
        message: errorMsg,
        type: "danger",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const navigateToReview = () => {
    navigation.navigate("ReviewElectricitySummaryScreen", {
      meterNumber,
      amount: parseFloat(amount),
      selectedService,
      meterType,
      id,
      customerName,
    });
  };

  const handleProceed = () => {
    if (canNavigate) {
      navigateToReview();
    }
  };

  const canNavigate =
    isValidated &&
    amount &&
    !isNaN(parseFloat(amount)) &&
    parseFloat(amount) > 0 &&
    selectedService &&
    !isValidating;

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View className="justify-center items-center">
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.leftIcon}
              >
                <ArrowLeft color={"#000"} size={24} />
              </TouchableOpacity>
              <Text style={[styles.headerText]} allowFontScaling={false}>
                Electricity
              </Text>
            </View>
          </View>

          <View className="justify-center px-4">
            <View
              className="bg-white shadow-md rounded-lg py-4 px-4"
              style={shadowStyle}
            >
              <Text style={styles.titleText} allowFontScaling={false}>
                Select an electricity provider
              </Text>

              <TouchableOpacity onPress={() => setServiceModalVisible(true)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MediumText color="black">
                      {selectedService || "Select a provider"}
                    </MediumText>
                  </View>
                  <ArrowRight2 color={COLORS.black400} size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center px-4 mt-4">
            <TouchableOpacity
              style={[
                styles.meterTypeButton,
                meterType === "PREPAID" && styles.selectedMeterTypeButton,
              ]}
              onPress={() => {
                setMeterType("PREPAID");
                setCustomerName("");
                setIsValidated(false);
                setValidationError(null);
              }}
            >
              <MediumText color={meterType === "PREPAID" ? "primary" : "black"}>
                Prepaid
              </MediumText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.meterTypeButton,
                meterType === "POSTPAID" && styles.selectedMeterTypeButton,
              ]}
              onPress={() => {
                setMeterType("POSTPAID");
                setCustomerName("");
                setIsValidated(false);
                setValidationError(null);
              }}
            >
              <MediumText
                color={meterType === "POSTPAID" ? "primary" : "black"}
              >
                Postpaid
              </MediumText>
            </TouchableOpacity>
          </View>

          <View className="py-4 justify-center px-4">
            <View
              className="bg-white shadow-md rounded-lg px-4 py-4 mb-2"
              style={shadowStyle}
            >
              <View className="mb-4">
                <Label text="Meter Number" marked={false} />
                <BasicInput
                  placeholder="Enter your meter number"
                  value={meterNumber}
                  onChangeText={(text) => {
                    setMeterNumber(text);
                    setCustomerName("");
                    setIsValidated(false);
                    setValidationError(null);
                  }}
                  keyboardType="numeric"
                />
                {isValidating ? (
                  <View className="flex-row items-center mt-2">
                    <ActivityIndicator size="small" color={COLORS.violet400} />
                    <RegularText color="mediumGrey" marginLeft={5} size="small">
                      Verifying meter details
                    </RegularText>
                  </View>
                ) : customerName ? (
                  <View className="flex-row items-center mt-2">
                    <TickCircle
                      size={20}
                      variant="Bold"
                      color={COLORS.green300}
                    />
                    <BoldText color="green" marginLeft={3} size="small">
                      {customerName}
                    </BoldText>
                  </View>
                ) : validationError ? (
                  <RegularText color="error" marginTop={5} size="small">
                    {validationError}
                  </RegularText>
                ) : null}
              </View>
              <View className="mb-4">
                <Label text="Amount" marked={false} />
                <BasicInput
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={validateAmountInput}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Button
              style={[
                styles.proceedButton,
                !canNavigate && styles.disabledButton,
              ]}
              title="Confirm & Proceed"
              textColor="#fff"
              disabled={!canNavigate}
              onPress={handleProceed}
            />
          </View>
        </ScrollView>

        <ServiceSelectionModal
          visible={serviceModalVisible}
          onClose={() => setServiceModalVisible(false)}
          onSelectService={handleServiceSelect}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ElectricityScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING * 2,
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
  meterTypeButton: {
    backgroundColor: "white",
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 8,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING,
  },
  selectedMeterTypeButton: {
    borderWidth: 1,
    borderColor: COLORS.violet400,
    backgroundColor: COLORS.violet100,
  },
});
