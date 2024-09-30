import {
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
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ArrowRight2 } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import Button from "../../../components/Button";
import { TextInput } from "react-native";
import ServiceSelectionModal from "../../../components/modals/Electricity/ServiceSelectionModal";
import { MediumText } from "../../../components/common/Text";

const ElectricityScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{
    plan_id: string;
    plan_price: number;
    plan_name: string;
  } | null>(null);
  const [meterNumber, setMeterNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [serviceModalVisible, setServiceModalVisible] =
    useState<boolean>(false);
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");

  const handleServiceSelect = (service: string, planId: string) => {
    setSelectedService(service);
    setSelectedPlan({ plan_id: planId, plan_price: 0, plan_name: service });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const validateAmountInput = (text: string) => {
    // Regular expression to ensure input is a valid number (positive, with optional decimal)
    if (/^\d*\.?\d*$/.test(text)) {
      setAmount(text);
    }
  };

  const isFormValid =
    meterNumber &&
    amount &&
    !isNaN(parseFloat(amount)) && // Ensure amount is a valid number
    parseFloat(amount) > 0 && // Ensure amount is a positive number
    selectedPlan;

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
            <View className="bg-white shadow-md rounded-lg py-4 px-4">
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
                meterType === "prepaid" && styles.selectedMeterTypeButton,
              ]}
              onPress={() => setMeterType("prepaid")}
            >
              <MediumText color={meterType === "prepaid" ? "primary" : "black"}>
                Prepaid
              </MediumText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.meterTypeButton,
                meterType === "postpaid" && styles.selectedMeterTypeButton,
              ]}
              onPress={() => setMeterType("postpaid")}
            >
              <MediumText
                color={meterType === "postpaid" ? "primary" : "black"}
              >
                Postpaid
              </MediumText>
            </TouchableOpacity>
          </View>

          <View className="py-4 justify-center px-4">
            <View className="bg-white shadow-md rounded-lg px-4 py-4 mb-2">
              <View className="mb-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Meter Number
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your meter number"
                  allowFontScaling={false}
                  placeholderTextColor={"#00000080"}
                  value={meterNumber}
                  onChangeText={setMeterNumber}
                  keyboardType="numeric"
                />
              </View>
              <View className="mb-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Amount
                </Text>
                <TextInput
                 style={styles.textInput}
                 placeholder="Enter amount"
                 allowFontScaling={false}
                 placeholderTextColor={"#00000080"}
                 value={amount}
                 onChangeText={validateAmountInput}
                 keyboardType="numeric"
                />
              </View>
            </View>

            <Button
              style={[
                styles.proceedButton,
                !isFormValid && styles.disabledButton,
              ]}
              title={"Proceed"}
              textColor="#fff"
              disabled={!isFormValid}
              onPress={() => {
                const numericAmount = parseFloat(amount);
                console.log("Meter Number:", meterNumber);
                console.log("Amount:", numericAmount);
                console.log("Selected Service:", selectedService);
                console.log("Meter Type:", meterType);
                console.log("Plan ID:", selectedPlan?.plan_id);
                console.log("Plan Name:", selectedPlan?.plan_name);

                if (isFormValid) {
                  navigation.navigate("ReviewElectricitySummaryScreen", {
                    meterNumber,
                    amount: numericAmount,
                    selectedService,
                    meterType,
                    planId: selectedPlan?.plan_id,
                    planName: selectedPlan?.plan_name,
                  });
                } else {
                  console.log("Form is invalid.");
                }
              }}
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
  textInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: SPACING * 1.5,
    width: "100%",
    fontFamily: "Outfit-Regular",
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
  planText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
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
