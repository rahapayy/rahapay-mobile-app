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
import Dstv from "../../../assets/svg/dstv.svg";
import Gotv from "../../../assets/svg/gotv.svg";
import Startimes from "../../../assets/svg/startimes.svg";
import COLORS from "../../../constants/colors";
import PlanSelectionModal from "../../../components/modals/CableTv/PlanSelectionModal";
import Button from "../../../components/common/ui/buttons/Button";
import ServiceSelectionModal from "../../../components/modals/CableTv/ServiceSelectionModal";
import {
  BoldText,
  MediumText,
  RegularText,
} from "../../../components/common/Text";
import { services } from "@/services";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import Label from "@/components/common/ui/forms/Label";
import BasicInput from "@/components/common/ui/forms/BasicInput";

const TvSubscriptionScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string>("DSTV");
  const [selectedServiceIcon, setSelectedServiceIcon] = useState<JSX.Element>(
    <Dstv width={32} height={32} />
  );
  const [cardNumber, setCardNumber] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [serviceModalVisible, setServiceModalVisible] =
    useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    planId: string;
    price: number;
    planName: string;
  } | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [plans, setPlans] = useState<any[]>([]);
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsPlansLoading(true);
      try {
        const response = await services.cableService.getCablePlans(
          selectedService
        );
        setPlans(response.data || []);
      } catch (error) {
        console.error("Error fetching cable plans:", error);
        handleShowFlash({
          message: "Failed to load cable plans. Please try again.",
          type: "danger",
        });
      } finally {
        setIsPlansLoading(false);
      }
    };

    fetchPlans();
  }, [selectedService]);

  const handleServiceSelect = (service: string, icon: JSX.Element) => {
    setSelectedService(service.toUpperCase());
    setSelectedServiceIcon(icon);
    setSelectedPlan(null);
    setCardNumber("");
    setCustomerName("");
    setIsValidated(false);
  };

  const handlePlanSelect = (plan: {
    planId: string;
    price: number;
    planName: string;
  }) => {
    setSelectedPlan(plan);
  };

  const handleValidateIuc = async () => {
    setIsValidating(true);
    try {
      const response = await services.cableService.validateCableIuc({
        smartCardNo: cardNumber,
        cableName: selectedService,
      });
      setCustomerName(response.data.customerName || "Unknown");
      setIsValidated(true);
      return true;
    } catch (error: any) {
      setCustomerName("");
      setIsValidated(false);
      handleShowFlash({
        message:
          error.response?.data?.msg || "Failed to validate smartcard number.",
        type: "danger",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedPlan) return;

    // If not validated yet, validate first
    if (!isValidated) {
      await handleValidateIuc();
      return;
    }

    // If already validated, proceed to next screen
    navigation.navigate("ReviewCableTvSummaryScreen", {
      service: selectedService,
      planId: selectedPlan.planId,
      price: selectedPlan.price,
      cardNumber,
      planName: selectedPlan.planName,
      customerName,
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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

  const canProceed = selectedPlan !== null;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <View
              className="bg-white rounded-lg py-4 px-4"
              style={[shadowStyle]}
            >
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
            <View
              className="bg-white rounded-lg px-4 py-4 mb-2"
              style={[shadowStyle]}
            >
              <View className="mb-4">
                <Label marked={false} text="Select a Plan" />
                <TouchableOpacity
                  className="p-3 flex-row items-center border border-[#DFDFDF] rounded-lg"
                  onPress={() => setModalVisible(true)}
                >
                  <RegularText color="mediumGrey" size="small">
                    {selectedPlan ? selectedPlan.planName : "Select a plan"}
                  </RegularText>
                </TouchableOpacity>
              </View>
              <View className="mb-4">
                <Label text="Smartcard Number" marked={false} />
                <BasicInput
                  placeholder="Enter your card number"
                  value={cardNumber}
                  onChangeText={(text) => {
                    setCardNumber(text);
                    setCustomerName("");
                    setIsValidated(false);
                  }}
                  keyboardType="numeric"
                />
                {isValidating ? (
                  <View className="flex-row items-center mt-2">
                    <ActivityIndicator size="small" color={COLORS.violet400} />
                    <RegularText color="mediumGrey" marginLeft={5} size="small">
                      Verifying account details
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
                ) : null}
              </View>
              <View className="mb-4">
                <Label text="Amount" marked={false} />
                <View className="p-3 flex-row items-center border border-[#DFDFDF] rounded-lg">
                  <MediumText color="black">
                    ₦{selectedPlan ? selectedPlan.price : 0}
                  </MediumText>
                </View>
              </View>
            </View>

            <Button
              style={[
                styles.proceedButton,
                !canProceed && styles.disabledButton,
              ]}
              title={isValidating ? "Validating..." : "Proceed"}
              textColor="#fff"
              disabled={!canProceed}
              onPress={handleProceed}
            />
          </View>
        </ScrollView>
        <PlanSelectionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          plans={plans}
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
  proceedButton: {
    marginTop: SPACING * 4,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
  price: {
    fontFamily: "Outfit-Medium",
  },
});
