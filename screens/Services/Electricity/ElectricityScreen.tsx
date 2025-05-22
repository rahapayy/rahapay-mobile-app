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
  Image,
  FlatList,
  Switch,
} from "react-native";
import React, { useEffect, useCallback, useRef, useState } from "react";
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
import { useDiscos, useValidateMeter } from "@/services/hooks/electricity";
import { services } from "@/services";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import PhoneNumberInput from "@/components/common/ui/forms/PhoneNumberInput";
import { useAuth } from "@/services/AuthContext";
import { Beneficiary } from "@/services/modules/beneficiary";
import { Skeleton } from "@rneui/base";
import useWallet from "../../../hooks/use-wallet"; // Added for balance
import BackButton from "@/components/common/ui/buttons/BackButton";

const ElectricityScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { balance, refreshBalance } = useWallet(); // Added
  const {
    discos,
    loading: discosLoading,
    error: discosError,
    fetchDiscos,
  } = useDiscos(services.electricityService);
  const {
    validation,
    loading: validating,
    error: validationError,
    validateMeter,
  } = useValidateMeter(services.electricityService);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [discoId, setDiscoId] = useState<string | null>(null);
  const [meterNumber, setMeterNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    userInfo?.phoneNumber?.replace(/^\+234/, "") || ""
  );
  const [amount, setAmount] = useState<string>("");
  const [meterType, setMeterType] = useState<"Prepaid" | "Postpaid">("Prepaid");
  const [serviceModalVisible, setServiceModalVisible] =
    useState<boolean>(false);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [saveBeneficiary, setSaveBeneficiary] = useState(true); // Added
  const prevMeterNumberRef = useRef<string>("");

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsBeneficiariesLoading(true);
      try {
        const response = await services.beneficiaryService.getBeneficiaries(
          "electricity"
        );
        setBeneficiaries(response.data?.beneficiaries || []);
      } catch (error) {
        console.error("Failed to fetch electricity beneficiaries:", error);
        setBeneficiaries([]);
      } finally {
        setIsBeneficiariesLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    fetchDiscos();
  }, [fetchDiscos]);

  useEffect(() => {
    if (discosError) {
      handleShowFlash({ message: discosError, type: "danger" });
    }
  }, [discosError]);

  useEffect(() => {
    if (userInfo?.phoneNumber) {
      setPhoneNumber(userInfo.phoneNumber.replace(/^\+234/, "") || "");
    }
  }, [userInfo]);

  useEffect(() => {
    if (discos && discos.length > 0 && !selectedService && !discoId) {
      const defaultDisco =
        discos.find((disco) => disco.id === "jos-electric") || discos[0];
      if (defaultDisco) {
        setSelectedService(defaultDisco.name);
        setDiscoId(defaultDisco.id);
      }
    }
  }, [discos, selectedService, discoId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshBalance(); // Refresh balance on screen focus
    });
    return unsubscribe;
  }, [navigation, refreshBalance]);

  const debouncedValidateMeter = useCallback(() => {
    if (
      meterNumber &&
      discoId &&
      !validating &&
      meterNumber.length >= 11 &&
      meterNumber !== prevMeterNumberRef.current
    ) {
      validateMeter({ meterNumber, meterId: discoId, meterType });
      prevMeterNumberRef.current = meterNumber;
    }
  }, [meterNumber, discoId, meterType, validating, validateMeter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedValidateMeter();
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedValidateMeter]);

  const handleServiceSelect = (service: string, id: string) => {
    setSelectedService(service);
    setDiscoId(id);
    setMeterNumber("");
    setPhoneNumber(userInfo?.phoneNumber?.replace(/^\+234/, "") || "");
    setAmount("");
    setServiceModalVisible(false);
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setMeterNumber(beneficiary.number);
    if (beneficiary.networkType) {
      const selectedDisco = discos.find(
        (disco) => disco.id === beneficiary.networkType.toLowerCase()
      );
      if (selectedDisco) {
        setSelectedService(selectedDisco.name);
        setDiscoId(selectedDisco.id);
      }
    }
    setPhoneNumber(userInfo?.phoneNumber?.replace(/^\+234/, "") || "");
  };

  const validateAmountInput = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setAmount(text);
    }
  };

  const validatePhoneNumber = (text: string) => {
    if (/^\d*$/.test(text)) {
      setPhoneNumber(text);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const navigateToReview = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount > balance) {
      handleShowFlash({
        message: "Insufficient balance. Please fund your wallet.",
        type: "danger",
      });
      return;
    }
    navigation.navigate("ReviewSummaryScreen", {
      transactionType: "electricity",
      meterNumber,
      phoneNumber,
      amount,
      selectedService: selectedService!,
      meterType,
      discoId: discoId!,
      customerName: validation?.name || "",
      customerAddress: validation?.address || "",
      userId: userInfo?._id || "",
      saveBeneficiary, // Added
    });
  };

  const handleProceed = () => {
    if (canNavigate) {
      navigateToReview();
    }
  };

  const canNavigate =
    validation &&
    amount &&
    !isNaN(parseFloat(amount)) &&
    parseFloat(amount) >= (validation?.minAmount || 1000) &&
    parseFloat(amount) <= (validation?.maxAmount || 100000) &&
    phoneNumber.length === 11 &&
    selectedService &&
    !validating &&
    !discosLoading;

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

  const getDiscoIcon = (discoId: string | null) => {
    if (!discoId) return null;
    switch (discoId) {
      case "abuja-electric":
        return require("@/assets/images/electricity/abuja.jpeg");
      case "aba-electric":
        return require("@/assets/images/electricity/aba.png");
      case "benin-electric":
        return require("@/assets/images/electricity/benin.jpeg");
      case "eko-electric":
        return require("@/assets/images/electricity/eko.png");
      case "enugu-electric":
        return require("@/assets/images/electricity/enugu.png");
      case "ibadan-electric":
        return require("@/assets/images/electricity/ibadan.jpeg");
      case "ikeja-electric":
        return require("@/assets/images/electricity/ikeja.png");
      case "jos-electric":
        return require("@/assets/images/electricity/jos.jpeg");
      case "kaduna-electric":
        return require("@/assets/images/electricity/kaduna.png");
      case "kano-electric":
        return require("@/assets/images/electricity/kano.jpeg");
      case "yola-electric":
        return require("@/assets/images/electricity/yola.png");
      case "portharcourt-electric":
        return null;
      default:
        return null;
    }
  };

  const renderBeneficiarySkeleton = () => (
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
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View className="justify-center items-center">
            <View style={styles.header}>
              <BackButton navigation={navigation} />
              <RegularText color="black" size="large" marginLeft={10}>
                Electricity
              </RegularText>
            </View>
          </View>

          <View className="justify-center px-4">
            <View className="">
              <RegularText color="black" marginBottom={8}>
                Saved Beneficiaries
              </RegularText>
              {isBeneficiariesLoading ? (
                renderBeneficiarySkeleton()
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
                        {beneficiary.networkType
                          ? `| ${beneficiary.networkType}`
                          : ""}
                      </RegularText>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View
                  className="bg-[#EEEBF9] p-2.5 rounded-2xl mr-2 justify-center items-center"
                  style={{ alignSelf: "flex-start" }}
                >
                  <RegularText color="mediumGrey" className="mb-4" size="small">
                    No beneficiaries found.
                  </RegularText>
                </View>
              )}
            </View>

            <View
              className="bg-white shadow-md rounded-lg py-4 px-4 mt-4"
              style={shadowStyle}
            >
              <RegularText color="black" size="small">
                Select an electricity provider
              </RegularText>
              <TouchableOpacity onPress={() => setServiceModalVisible(true)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: SPACING,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {getDiscoIcon(discoId) ? (
                      <Image
                        source={getDiscoIcon(discoId)}
                        style={styles.discoIcon}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.placeholderIcon} />
                    )}
                    <MediumText color="black" size="medium">
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
                meterType === "Prepaid" && styles.selectedMeterTypeButton,
              ]}
              onPress={() => setMeterType("Prepaid")}
            >
              <MediumText
                size="small"
                color={meterType === "Prepaid" ? "primary" : "black"}
              >
                Prepaid
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.meterTypeButton,
                meterType === "Postpaid" && styles.selectedMeterTypeButton,
              ]}
              onPress={() => setMeterType("Postpaid")}
            >
              <MediumText
                size="small"
                color={meterType === "Postpaid" ? "primary" : "black"}
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
                  onChangeText={setMeterNumber}
                  keyboardType="numeric"
                />
                {validating ? (
                  <View className="flex-row items-center mt-2">
                    <ActivityIndicator size="small" color={COLORS.violet400} />
                    <RegularText color="mediumGrey" marginLeft={5} size="small">
                      Verifying meter details
                    </RegularText>
                  </View>
                ) : validation ? (
                  <View className="mt-2">
                    <View className="flex-row items-center">
                      <TickCircle
                        size={20}
                        variant="Bold"
                        color={COLORS.green300}
                      />
                      <BoldText color="green" marginLeft={3} size="small">
                        {validation.name}
                      </BoldText>
                    </View>
                  </View>
                ) : validationError ? (
                  <RegularText color="error" marginTop={5} size="small">
                    {validationError}
                  </RegularText>
                ) : null}
              </View>
              <View className="mb-4">
                <Label text="Phone Number" marked={false} />
                <PhoneNumberInput
                  value={phoneNumber}
                  onChangeText={validatePhoneNumber}
                  countryCode={"+234"}
                  contactIcon={false}
                />
              </View>
              <View className="mb-4">
                <View className="flex-row justify-between items-center">
                  <Label text="Amount" marked={false} />
                  <RegularText color="black" marginBottom={10} size="small">
                    Balance: ₦
                    {balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </RegularText>
                </View>
                <BasicInput
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={validateAmountInput}
                  keyboardType="numeric"
                />
                {validation && (
                  <RegularText color="mediumGrey" marginTop={5} size="small">
                    Min: ₦{validation.minAmount} | Max: ₦{validation.maxAmount}
                  </RegularText>
                )}
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
          services={
            discos?.map((disco) => ({ name: disco.name, id: disco.id })) || []
          }
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 2,
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
    marginBottom: SPACING,
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
  discoIcon: {
    width: 45,
    height: 45,
    marginRight: SPACING,
    borderRadius: 25,
  },
  placeholderIcon: {
    width: 45,
    height: 45,
    marginRight: SPACING,
    backgroundColor: COLORS.grey200,
    borderRadius: 25,
  },
});

export default ElectricityScreen;
