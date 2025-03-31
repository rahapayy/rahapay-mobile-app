import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
  Switch,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TickCircle } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Dstv from "../../../assets/svg/dstv.svg";
import Gotv from "../../../assets/svg/gotv.svg";
import Startimes from "../../../assets/svg/startimes.svg";
import Button from "../../../components/common/ui/buttons/Button";
import BackButton from "@/components/common/ui/buttons/BackButton";
import { RegularText } from "@/components/common/Text";
import Label from "@/components/common/ui/forms/Label";
import BasicInput from "@/components/common/ui/forms/BasicInput";
import { services } from "@/services";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import { Beneficiary } from "@/services/modules/beneficiary";
import { Skeleton } from "@rneui/base";
import PlanSelectionModal from "../../../components/modals/CableTv/PlanSelectionModal";

// Define the navigation stack parameters
type RootStackParamList = {
  TvSubscriptionScreen: undefined;
  ReviewSummaryScreen: {
    transactionType: string;
    service: string;
    planId: string;
    price: number;
    cardNumber: string;
    planName: string;
    customerName: string;
    saveBeneficiary: boolean;
  };
};

interface TvSubscriptionScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "TvSubscriptionScreen">;
}

const TvSubscriptionScreen: React.FC<TvSubscriptionScreenProps> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string>("DSTV");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
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
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(true);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);

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

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsBeneficiariesLoading(true);
      try {
        const response = await services.beneficiaryService.getBeneficiaries("cable");
        setBeneficiaries(response.data?.beneficiaries || []);
      } catch (error) {
        console.error("Failed to fetch cable beneficiaries:", error);
        setBeneficiaries([]);
      } finally {
        setIsBeneficiariesLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsPlansLoading(true);
      try {
        const response = await services.cableService.getCablePlans(selectedService);
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

  const handleServiceSelect = (service: string) => {
    setSelectedService(service.toUpperCase());
    setSelectedPlan(null);
    setCardNumber("");
    setCustomerName("");
    setIsValidated(false);
  };

  const handlePlanSelect = (plan: { planId: string; price: number; planName: string }) => {
    setSelectedPlan(plan);
    setModalVisible(false);
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
        message: error.response?.data?.msg || "Failed to validate smartcard number.",
        type: "danger",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedPlan || !cardNumber) return;

    if (!isValidated) {
      await handleValidateIuc();
      return;
    }

    navigation.navigate("ReviewSummaryScreen", {
      transactionType: "cableTv",
      service: selectedService,
      planId: selectedPlan.planId,
      price: selectedPlan.price,
      cardNumber,
      planName: selectedPlan.planName,
      customerName,
      saveBeneficiary,
    });
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setCardNumber(beneficiary.number);
    if (beneficiary.networkType) {
      const normalizedNetworkType = beneficiary.networkType.toLowerCase();
      const networkMap: { [key: string]: string } = {
        dstv: "DSTV",
        gotv: "GOTV",
        startime: "STARTIMES",
      };
      const selectedNetwork = networkMap[normalizedNetworkType];
      if (selectedNetwork) {
        setSelectedService(selectedNetwork);
      }
    }
  };

  const renderServiceSkeleton = () => (
    <View className="flex-row p-2 bg-white rounded-xl items-center justify-between mb-4" style={[shadowStyle]}>
      {[1, 2, 3].map((_, index) => (
        <Skeleton
          key={index}
          width={60}
          height={60}
          style={{
            backgroundColor: COLORS.grey100,
            marginHorizontal: SPACING,
            borderRadius: 10,
          }}
          skeletonStyle={{ backgroundColor: COLORS.grey50 }}
          animation="wave"
        />
      ))}
    </View>
  );

  const renderServiceProviders = () => (
    <View className="flex-row p-2 bg-white rounded-xl items-center justify-between mb-4" style={[shadowStyle]}>
      <TouchableOpacity
        onPress={() => handleServiceSelect("DSTV")}
        style={[
          styles.serviceBox,
          selectedService === "DSTV" && styles.selectedOperator,
        ]}
      >
        <View style={styles.serviceIconContainer}>
          <Dstv width={32} height={32} />
        </View>
        {selectedService === "DSTV" && (
          <TickCircle
            size={18}
            variant="Bold"
            color={COLORS.violet400}
            style={styles.tickIcon}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleServiceSelect("GOTV")}
        style={[
          styles.serviceBox,
          selectedService === "GOTV" && styles.selectedOperator,
        ]}
      >
        <View style={styles.serviceIconContainer}>
          <Gotv width={32} height={32} />
        </View>
        {selectedService === "GOTV" && (
          <TickCircle
            size={18}
            variant="Bold"
            color={COLORS.violet400}
            style={styles.tickIcon}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleServiceSelect("STARTIMES")}
        style={[
          styles.serviceBox,
          selectedService === "STARTIMES" && styles.selectedOperator,
        ]}
      >
        <View style={styles.serviceIconContainer}>
          <Startimes width={32} height={32} />
        </View>
        {selectedService === "STARTIMES" && (
          <TickCircle
            size={18}
            variant="Bold"
            color={COLORS.violet400}
            style={styles.tickIcon}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  // Enable the button as soon as all required fields are filled, before validation
  const canProceed = selectedService !== null && cardNumber !== "" && selectedPlan !== null;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <View style={styles.header}>
            <BackButton navigation={navigation} />
            <RegularText color="black" size="large" marginLeft={10}>
              Cable TV Subscription
            </RegularText>
          </View>

          <View>
            <RegularText color="black" marginBottom={8} allowFontScaling={false}>
              Saved Beneficiaries
            </RegularText>
            {isBeneficiariesLoading ? (
              <View className="flex-row mb-2 gap-1">
                <Skeleton
                  width={100}
                  height={25}
                  style={{ backgroundColor: COLORS.grey100, borderRadius: 10 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                  animation="wave"
                />
                <Skeleton
                  width={100}
                  height={25}
                  style={{ backgroundColor: COLORS.grey100, borderRadius: 10 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                  animation="wave"
                />
              </View>
            ) : beneficiaries.length > 0 ? (
              <FlatList
                data={beneficiaries}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item: beneficiary, index }) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-[#EEEBF9] p-2.5 rounded-2xl mr-2"
                    onPress={() => handleBeneficiarySelect(beneficiary)}
                  >
                    <RegularText color="black" size="small">
                      {beneficiary.number}{" "}
                      {beneficiary.networkType ? `| ${beneficiary.networkType}` : ""}
                    </RegularText>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <RegularText color="mediumGrey" className="mb-4">
                No saved beneficiaries found.
              </RegularText>
            )}
          </View>

          <View className="mt-3">
            <Label text="Select Service Provider" marked={false} />
            {isPlansLoading ? renderServiceSkeleton() : renderServiceProviders()}

            <Label text="Smartcard Number" marked={false} />
            <BasicInput
              placeholder="Enter your smartcard number"
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
                <TickCircle size={20} variant="Bold" color={COLORS.green300} />
                <RegularText color="green" marginLeft={3} size="small">
                  {customerName}
                </RegularText>
              </View>
            ) : null}

            <View className="mt-4">
              <Label text="Select Plan" marked={false} />
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setModalVisible(true)}
              >
                <RegularText color={selectedPlan ? "black" : "mediumGrey"} size="small">
                  {selectedPlan ? selectedPlan.planName : "Select a plan"}
                </RegularText>
              </TouchableOpacity>
            </View>

            <View className="mt-4">
              <Label text="Amount" marked={false} />
              <View style={styles.inputContainer}>
                <RegularText color="black">
                  ₦{selectedPlan ? selectedPlan.price : 0}
                </RegularText>
              </View>
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mt-2">
              <RegularText color="black" marginRight={6}>
                Save as beneficiary
              </RegularText>
              <Switch
                value={saveBeneficiary}
                onValueChange={setSaveBeneficiary}
                trackColor={{ false: COLORS.grey100, true: COLORS.violet200 }}
                thumbColor={saveBeneficiary ? COLORS.violet400 : COLORS.white}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
          </View>

          <Button
            title={isValidating ? "Validating..." : "Proceed"}
            style={{
              backgroundColor: canProceed ? COLORS.violet400 : COLORS.violet200,
              marginTop: SPACING * 2,
            }}
            onPress={handleProceed}
            disabled={!canProceed || isValidating} // Disable during validation to prevent multiple clicks
            textColor="#fff"
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
  );
};

export default TvSubscriptionScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING * 3,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
    marginLeft: SPACING,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 10,
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? SPACING * 1.5 : SPACING * 1.5,
  },
  input: {
    flex: 1,
    borderWidth: 0,
  },
  serviceBox: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: SPACING,
    borderRadius: 10,
    backgroundColor: COLORS.grey100,
  },
  serviceIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOperator: {
    borderWidth: 1,
    borderColor: COLORS.violet400,
  },
  tickIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});