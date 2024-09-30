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
import React, { useContext, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ArrowRight2 } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import Dstv from "../../../assets/svg/dstv.svg";
import Gotv from "../../../assets/svg/gotv.svg";
import Startimes from "../../../assets/svg/startimes.svg";
import COLORS from "../../../constants/colors";
import useSWR from "swr";
import * as Animatable from "react-native-animatable";
import LoadingLogo from "../../../assets/svg/loadingLogo.svg";
import PlanSelectionModal from "../../../components/PlanSelectionModal";
import Button from "../../../components/Button";
import { useRoute } from "@react-navigation/native";
import { TextInput } from "react-native";
import ServiceSelectionModal from "../../../components/ServiceSelectionModal";
import { MediumText } from "../../../components/common/Text";

const TvSubscriptionScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string>("Dstv");
  const [selectedServiceIcon, setSelectedServiceIcon] = useState<JSX.Element>(
    <Dstv width={32} height={32} />
  );
  const [cardNumber, setCardNumber] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [serviceModalVisible, setServiceModalVisible] =
    useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    plan_id: string;
    plan_price: number;
    plan_name: string;
  } | null>(null);

  const { data, error, isLoading } = useSWR(`/cable/`);

  const handleServiceSelect = (service: string, icon: JSX.Element) => {
    setSelectedService(service);
    setSelectedServiceIcon(icon);
  };

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error loading data.</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.violet300} size={"large"} />
      </View>
    );
  }

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

  const filteredPlans = data
    ? data.filter(
        (plan: { cable_name: string }) =>
          plan.cable_name.toLowerCase() === selectedService?.toLowerCase()
      )
    : [];

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
                Cable TV Subscription
              </Text>
            </View>
          </View>

          <View className="justify-center px-4">
            <View className="bg-white shadow-md rounded-lg py-4 px-4">
              <Text style={styles.titleText} allowFontScaling={false}>
                Select a service you need
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
                    <View style={{ marginRight: SPACING }}>
                      {selectedServiceIcon}
                    </View>
                    <MediumText color="black">{selectedService}</MediumText>
                  </View>
                  <ArrowRight2 color={COLORS.black400} size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="py-4 justify-center px-4">
            <View className="bg-white shadow-md rounded-lg px-4 py-4 mb-2">
              <View className="mb-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Select a Plan
                </Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.planText} allowFontScaling={false}>
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
                  service: selectedService,
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
          plans={filteredPlans}
          onSelectPlan={handlePlanSelect}
        />
        <ServiceSelectionModal
          visible={serviceModalVisible}
          onClose={() => setServiceModalVisible(false)}
          onSelectService={handleServiceSelect}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TvSubscriptionScreen;

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
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  boxSelect: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING * 2,
    alignItems: "center",
    marginBottom: SPACING,
    flexBasis: "47%",
    margin: SPACING / 2,
  },
  selectedBox: {
    borderColor: COLORS.violet400,
    borderWidth: 1,
  },
  serviceText: {
    marginTop: SPACING,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
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
  planText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
});
