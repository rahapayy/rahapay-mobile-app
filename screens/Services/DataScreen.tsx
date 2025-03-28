import React, { useEffect, useState } from "react";
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
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowDown2, ArrowLeft, TickCircle } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Airtel from "../../assets/svg/air.svg";
import Mtn from "../../assets/svg/mtn.svg";
import Eti from "../../assets/svg/eti.svg";
import Glo from "../../assets/svg/glo.svg";
import Button from "../../components/common/ui/buttons/Button";
import SelectDataPlanModal from "../../components/SelectDataPlanModal";
import { Skeleton } from "@rneui/base";
import { DataPlan } from "@/services/modules/data";
import { services } from "@/services";
import { RegularText } from "@/components/common/Text";
import { Beneficiary } from "@/services/modules/beneficiary";
import Label from "@/components/common/ui/forms/Label";
import BasicInput from "@/components/common/ui/forms/BasicInput";
import PhoneNumberInput from "@/components/common/ui/forms/PhoneNumberInput";

interface DataScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const DataScreen: React.FC<DataScreenProps> = ({ navigation }) => {
  const [selectedOperator, setSelectedOperator] = useState("");
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    plan: string;
    days: string;
    plan_id: string;
    amount: number;
  } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(true);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);

  const isButtonDisabled = !selectedOperator || !phoneNumber || !selectedPlan;

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
          "data"
        );
        setBeneficiaries(response.data?.beneficiaries || []);
      } catch (error) {
        console.error("Failed to fetch data beneficiaries:", error);
        setBeneficiaries([]);
      } finally {
        setIsBeneficiariesLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const fetchDataPlans = async () => {
      if (!selectedOperator) return;

      setLoading(true);
      setError(null);
      try {
        const response = await services.dataService.getDataPlans(
          selectedOperator
        );
        const validPlans = response
          .filter(
            (plan: DataPlan) =>
              plan.plan_id && plan.plan_name && plan.amount && plan.validity
          )
          .reduce((unique: DataPlan[], plan: DataPlan) => {
            return unique.some((p) => p.plan_id === plan.plan_id)
              ? unique
              : [...unique, plan];
          }, []);
        setDataPlans(validPlans);
      } catch (err) {
        setError("Failed to load data plans. Please try again.");
        console.error("Error fetching data plans:", err);
        setDataPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPlans();
  }, [selectedOperator]);

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

  const onSelectPackage = (plan: DataPlan) => {
    setSelectedPlan({
      plan: plan.plan_name,
      days: plan.validity,
      plan_id: plan.plan_id,
      amount: parseFloat(plan.amount),
    });
    setModalVisible(false);
  };

  const handleProceed = () => {
    if (!selectedPlan) return;

    // Updated navigation to use ReviewSummaryScreen with transactionType
    navigation.navigate("ReviewSummaryScreen", {
      transactionType: "data",
      selectedOperator,
      selectedPlan,
      phoneNumber,
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

  const renderNetworkSkeleton = () => (
    <View
      className="flex-row p-2 bg-white rounded-xl items-center justify-between"
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
      className="flex-row p-2 bg-white rounded-xl items-center justify-between"
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
    <SafeAreaView className="flex-1 bg-[#F7F7F7]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Buy Data Bundle
            </Text>
          </View>
          <View className="p-4">
            <View style={styles.tabContent}>
              <View>
                <View className="mb-4">
                  <RegularText color="black" marginBottom={5}>
                    Saved Beneficiaries
                  </RegularText>
                  {isBeneficiariesLoading ? (
                    <View className="flex-row mb-4 gap-1">
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
                            {beneficiary.number}{" "}
                            {beneficiary.networkType
                              ? `| ${beneficiary.networkType}`
                              : ""}
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

                <Label text="Select Network Provider" marked={false} />
                {isBeneficiariesLoading
                  ? renderNetworkSkeleton()
                  : renderNetworkProviders()}

                <View className="mt-6">
                  <Label text="Phone Number" marked={false} />
                  <PhoneNumberInput
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      detectOperator(text);
                    }}
                    countryCode={"+234"}
                  />
                </View>

                <View className="mb-2">
                  <View className="mt-4">
                    <Label text="Plan" marked={false} />
                    <TouchableOpacity
                      style={[!selectedOperator && {}]}
                      className="py-3 px-2 flex-row items-center border border-[#DFDFDF] rounded-md"
                      onPress={() => {
                        if (selectedOperator) {
                          setModalVisible(true);
                        }
                      }}
                      disabled={!selectedOperator}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: "Outfit-Regular",
                          color: selectedPlan ? "#000" : "#9BA1A8",
                          fontSize: RFValue(12),
                        }}
                        allowFontScaling={false}
                      >
                        {selectedPlan
                          ? `${selectedPlan.plan} - ${selectedPlan.days} - ${selectedPlan.amount}`
                          : "Select plan"}
                      </Text>
                      <ArrowDown2 color="#000" />
                    </TouchableOpacity>
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
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <Button
              title="Proceed"
              className="mt-10"
              style={{
                backgroundColor: isButtonDisabled
                  ? COLORS.violet200
                  : COLORS.violet400,
              }}
              onPress={handleProceed}
              disabled={isButtonDisabled}
              textColor="#fff"
            />

            <SelectDataPlanModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              dataPlans={dataPlans}
              onSelectPackage={onSelectPackage}
              isLoading={loading}
              error={error}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
  },
  leftIcon: { marginRight: SPACING },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
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
  beneficiaryText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  selectedOperator: { opacity: 0.5 },
});
