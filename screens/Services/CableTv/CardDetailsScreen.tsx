import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/native";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../../components/Button";
import COLORS from "../../../constants/colors";
import PlanSelectionModal from "../../../components/modals/CableTv/PlanSelectionModal";

const CardDetailsScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const route = useRoute();
  const { service, planId, planPrice, planName, plans } = route.params as {
    service: string;
    planId: string;
    planPrice: number;
    planName: string;
    plans: { plan_id: string; plan_price: number; plan_name: string }[];
  };

  const [cardNumber, setCardNumber] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false); // State for modal visibility
  const [selectedPlan, setSelectedPlan] = useState<{
    plan_id: string;
    plan_price: number;
    plan_name: string;
  } | null>(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isCardNumberValid = cardNumber.length === 10;

  const handlePlanSelect = (plan: {
    plan_id: string;
    plan_price: number;
    plan_name: string;
  }) => {
    setSelectedPlan(plan);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView className="flex-1">
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Provide Card Details
            </Text>
          </View>

          <View className="py-4 justify-center p-4">
            <View className="bg-white rounded-lg p-4 mb-2">
              <View className="mb-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Select a Plan
                </Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={() => setModalVisible(true)}
                >
                  <Text>
                    {selectedPlan ? selectedPlan.plan_name : "Select a plan"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mb-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Smartcard Number
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    !isCardNumberValid && cardNumber.length > 0
                      ? styles.invalidInput
                      : null,
                  ]}
                  placeholder="Enter your card number"
                  allowFontScaling={false}
                  placeholderTextColor={"#00000080"}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={10}
                />
                {!isCardNumberValid && cardNumber.length > 0 && (
                  <Text style={styles.errorText} allowFontScaling={false}>
                    Smartcard number must be exactly 10 digits
                  </Text>
                )}
              </View>
              <View className="mb-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Amount
                </Text>
                <View style={styles.textInput}>
                  <Text style={styles.price} allowFontScaling={false}>{`₦${
                    selectedPlan ? selectedPlan.plan_price : 0
                  }`}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.changePlan} allowFontScaling={false}>
                Change Plan
              </Text>
            </TouchableOpacity>

            <Button
              style={[
                styles.proceedButton,
                (!isCardNumberValid || !selectedPlan) && styles.disabledButton,
              ]}
              title={"Proceed"}
              textColor="#fff"
              disabled={!isCardNumberValid || !selectedPlan}
              onPress={() =>
                navigation.navigate("ReviewCableTvSummaryScreen", {
                  service,
                  planId: selectedPlan?.plan_id,
                  planPrice: selectedPlan?.plan_price,
                  cardNumber,
                  planName: selectedPlan?.plan_name,
                })
              }
            />
          </View>
        </ScrollView>

        <PlanSelectionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          plans={plans}
          onSelectPlan={handlePlanSelect}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CardDetailsScreen;

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
  textInput: {
    backgroundColor: "#EBEBEB",
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: SPACING * 1.5,
    width: "100%",
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  changePlan: {
    fontFamily: "Outfit-Medium",
    color: COLORS.violet400,
    fontSize: RFValue(10),
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
  invalidInput: {
    borderColor: COLORS.red300,
  },
  errorText: {
    color: COLORS.red300,
    fontSize: RFValue(10),
    marginTop: 5,
  },
  price: {
    fontFamily: "Outfit-Medium",
  },
});
