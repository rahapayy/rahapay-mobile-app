import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Switch,
  FlatList,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TickCircle } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Airtel from "../../assets/svg/air.svg";
import Mtn from "../../assets/svg/mtn.svg";
import Eti from "../../assets/svg/eti.svg";
import Glo from "../../assets/svg/glo.svg";
import Button from "../../components/common/ui/buttons/Button";
import BackButton from "@/components/common/ui/buttons/BackButton";
import ComingSoon from "../../assets/svg/Coming Soon.svg";
import { RegularText } from "@/components/common/Text";
import Label from "@/components/common/ui/forms/Label";
import CurrencyInput from "@/components/common/ui/forms/CurrencyInput";
import PhoneNumberInput from "@/components/common/ui/forms/PhoneNumberInput";
import { services } from "@/services";
import { Beneficiary } from "@/services/modules/beneficiary";
import { Skeleton } from "@rneui/base";
import * as Contacts from "expo-contacts";

interface AirtimeScreenProps {
  navigation: NativeStackNavigationProp<
    {
      ReviewSummaryScreen: {
        transactionType: string;
        selectedOperator: string;
        phoneNumber: string;
        amount: number;
        saveBeneficiary: boolean;
      };
    },
    "ReviewSummaryScreen"
  >;
}

const AirtimeScreen: React.FC<AirtimeScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<"Local" | "International">(
    "Local"
  );
  const [amount, setAmount] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(true);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);

  const amounts = [100, 200, 500, 1000, 2000, 3000, 5000];

  const isButtonDisabled = !selectedOperator || !phoneNumber || !amount;

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
        const response = await services.beneficiaryService.getBeneficiaries(
          "airtime"
        );
        setBeneficiaries(response.data?.beneficiaries || []);
      } catch (error) {
        console.error("Failed to fetch airtime beneficiaries:", error);
        setBeneficiaries([]);
      } finally {
        setIsBeneficiariesLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleProceed = () => {
    const sanitizedAmount = parseFloat(amount);

    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive amount.");
      return;
    }

    if (sanitizedAmount < 100) {
      setAmountError(true);
      return;
    } else {
      setAmountError(false);
    }

    navigation.navigate("ReviewSummaryScreen", {
      transactionType: "airtime",
      selectedOperator,
      phoneNumber,
      amount: sanitizedAmount,
      saveBeneficiary,
    });
  };

  type OperatorType = "Airtel" | "Mtn" | "9Mobile" | "Glo";

  const prefixes: { [key in OperatorType]: string[] } = {
    Airtel: ["0802", "0808", "0708", "0812", "0902", "0907", "0901", "0904"],
    Mtn: [
      "0803",
      "0806",
      "0703",
      "0706",
      "0810",
      "0813",
      "0814",
      "0816",
      "0903",
      "0906",
      "0916",
      "0913",
    ],
    "9Mobile": ["0809", "0817", "0818", "0909", "0908"],
    Glo: ["0805", "0807", "0705", "0811", "0815", "0905"],
  };

  const detectOperator = (number: string) => {
    for (let operator in prefixes) {
      if (
        prefixes[operator as OperatorType].some((prefix) =>
          number.startsWith(prefix)
        )
      ) {
        setSelectedOperator(operator);
        return;
      }
    }
    setSelectedOperator("");
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setPhoneNumber(beneficiary.number);
    if (beneficiary.networkType) {
      const normalizedNetworkType = beneficiary.networkType.toLowerCase();
      const networkMap: { [key: string]: OperatorType } = {
        mtn: "Mtn",
        airtel: "Airtel",
        "9mobile": "9Mobile",
        glo: "Glo",
      };
      const selectedNetwork = networkMap[normalizedNetworkType];
      if (selectedNetwork) {
        setSelectedOperator(selectedNetwork);
      } else {
        detectOperator(beneficiary.number);
      }
    } else {
      detectOperator(beneficiary.number);
    }
  };

  const handleContactPress = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to contacts to use this feature."
      );
      return;
    }

    const contact = await Contacts.presentContactPickerAsync();
    if (contact) {
      const selectedContact = contact;
      const phoneNumber = selectedContact?.phoneNumbers?.[0]?.number;
      if (phoneNumber) {
        const cleanedNumber = phoneNumber
          .replace(/[^0-9+]/g, "")
          .replace(/^[+]?/, "");
        setPhoneNumber(cleanedNumber);
        detectOperator(cleanedNumber);
      } else {
        Alert.alert(
          "No Phone Number",
          "The selected contact has no phone number."
        );
      }
    }
  };

  const renderNetworkSkeleton = () => (
    <View
      className="flex-row p-2 bg-white rounded-xl items-center justify-between mb-4"
      style={[shadowStyle]}
    >
      {[1, 2, 3, 4].map((_, index) => (
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

  const renderNetworkProviders = () => (
    <View
      className="flex-row p-2 bg-white rounded-xl items-center justify-between mb-4"
      style={[shadowStyle]}
    >
      <TouchableOpacity
        onPress={() => setSelectedOperator("Airtel")}
        style={[selectedOperator === "Airtel" && styles.selectedOperator]}
      >
        <View>
          <Airtel />
          {selectedOperator === "Airtel" && (
            <TickCircle
              size={18}
              variant="Bold"
              color="#fff"
              style={{ zIndex: 1, position: "absolute", top: 0, right: 0 }}
            />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelectedOperator("Mtn")}
        style={[selectedOperator === "Mtn" && styles.selectedOperator]}
      >
        <View>
          <Mtn />
          {selectedOperator === "Mtn" && (
            <TickCircle
              size={18}
              variant="Bold"
              color="#fff"
              style={{ zIndex: 1, position: "absolute", top: 0, right: 0 }}
            />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelectedOperator("9Mobile")}
        style={[selectedOperator === "9Mobile" && styles.selectedOperator]}
      >
        <View>
          <Eti />
          {selectedOperator === "9Mobile" && (
            <TickCircle
              size={18}
              variant="Bold"
              color="#fff"
              style={{ zIndex: 1, position: "absolute", top: 0, right: 0 }}
            />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelectedOperator("Glo")}
        style={[selectedOperator === "Glo" && styles.selectedOperator]}
      >
        <View>
          <Glo />
          {selectedOperator === "Glo" && (
            <TickCircle
              size={18}
              variant="Bold"
              color="#fff"
              style={{ zIndex: 1, position: "absolute", top: 0, right: 0 }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <View style={styles.header}>
            <BackButton navigation={navigation} />
            <RegularText color="black" size="large">
              Airtime Top-up
            </RegularText>
          </View>
          <View className="">
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "Local" && styles.activeTab]}
                onPress={() => setActiveTab("Local")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Local" && styles.activeTabText,
                  ]}
                  allowFontScaling={false}
                >
                  Local
                </Text>
                {activeTab === "Local" && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "International" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("International")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "International" && styles.activeTabText,
                  ]}
                  allowFontScaling={false}
                >
                  International
                </Text>
                {activeTab === "International" && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
              {activeTab === "Local" ? (
                <View>
                  <View>
                    <RegularText
                      color="black"
                      marginBottom={8}
                      allowFontScaling={false}
                    >
                      Saved Beneficiaries
                    </RegularText>
                    {isBeneficiariesLoading ? (
                      <View className="flex-row mb-2 gap-1">
                        <Skeleton
                          width={100}
                          height={25}
                          style={{
                            backgroundColor: COLORS.grey100,
                            borderRadius: 10,
                          }}
                          skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                          animation="wave"
                        />
                        <Skeleton
                          width={100}
                          height={25}
                          style={{
                            backgroundColor: COLORS.grey100,
                            borderRadius: 10,
                          }}
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
                              {beneficiary.number}
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
                    <Label text="Select Network Provider" marked={false} />
                    {isBeneficiariesLoading
                      ? renderNetworkSkeleton()
                      : renderNetworkProviders()}

                    <Label text="Phone Number" marked={false} />
                    <PhoneNumberInput
                      value={phoneNumber}
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                        detectOperator(text);
                      }}
                      countryCode={"+234"}
                      onContactPress={handleContactPress}
                    />
                  </View>

                  <View className="mt-4">
                    <CurrencyInput
                      value={amount}
                      error={amountError}
                      errorMessage="Amount must be at least 100"
                      onChange={(text) => {
                        setAmount(text);
                        setAmountError(false);
                      }}
                    />
                  </View>

                  <View className="bg-[#EEEBF9] rounded-xl">
                    <View className="p-4">
                      <RegularText color="black">Topup</RegularText>
                      <View className="flex-row flex-wrap">
                        {amounts.map((amount, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => setAmount(amount.toString())}
                            className="bg-white rounded p-2 m-2"
                          >
                            <RegularText color="black">₦{amount}</RegularText>
                          </TouchableOpacity>
                        ))}
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
                        trackColor={{
                          false: COLORS.grey100,
                          true: COLORS.violet200,
                        }}
                        thumbColor={
                          saveBeneficiary ? COLORS.violet400 : COLORS.white
                        }
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                    </View>
                  </View>
                  <Button
                    title="Proceed"
                    style={{
                      backgroundColor: isButtonDisabled
                        ? COLORS.violet200
                        : COLORS.violet400,
                      marginTop: SPACING * 2,
                    }}
                    onPress={handleProceed}
                    disabled={isButtonDisabled}
                    textColor="#fff"
                  />
                </View>
              ) : (
                <View className="justify-center items-center">
                  <ComingSoon />
                  <Text style={styles.comingsoonText}>
                    We are creating something amazing. Stay tuned!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AirtimeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING * 3,
  },
  leftIcon: { marginRight: SPACING },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
    marginLeft: SPACING,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: SPACING,
  },
  tab: { alignItems: "center", flex: 1 },
  tabText: {
    fontSize: RFValue(14),
    color: "#9BA1A8",
    fontFamily: "Outfit-Regular",
  },
  activeTab: { alignItems: "center" },
  activeTabText: { color: COLORS.violet400 },
  activeTabIndicator: {
    height: 2,
    backgroundColor: COLORS.violet400,
    marginTop: 4,
    width: "100%",
  },
  tabContent: { marginTop: SPACING, fontFamily: "Outfit-Regular" },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING,
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(12),
    borderRadius: 10,
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    fontSize: RFValue(12),
    height: Platform.OS === "ios" ? 30 : 33,
    fontFamily: "Outfit-Regular",
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginTop: 8 },
  topupText: { fontFamily: "Outfit-Regular" },
  amountText: { fontFamily: "Outfit-Regular" },
  beneficiaryText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  selectedOperator: { opacity: 0.5 },
  comingsoonText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
    textAlign: "center",
  },
  naira: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.small,
  },
});
