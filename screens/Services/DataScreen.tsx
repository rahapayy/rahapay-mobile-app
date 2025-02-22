import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  Switch,
  FlatList,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowDown2,
  ArrowLeft,
  ProfileCircle,
  TickCircle,
} from "iconsax-react-native";
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
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(false);

  // Fetch airtime beneficiaries
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsBeneficiariesLoading(true);
      try {
        const response = await services.beneficiaryService.getBeneficiaries(
          "data"
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

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setPhoneNumber(beneficiary.number); // Use 'number' instead of 'phoneNumber'
    if (beneficiary.networkType) {
      setSelectedOperator(beneficiary.networkType);
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

  // Fetch data plans when operator changes
  useEffect(() => {
    const fetchDataPlans = async () => {
      if (!selectedOperator) return;

      setLoading(true);
      setError(null);
      try {
        const response = await services.dataService.getDataPlans(
          selectedOperator
        );
        setDataPlans(response);
      } catch (err) {
        setError("Failed to load data plans. Please try again.");
        console.error("Error fetching data plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPlans();
  }, [selectedOperator]);
  // Check if all required fields are filled
  const isButtonDisabled = !selectedOperator || !phoneNumber || !selectedPlan;

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

  type OperatorType = "Airtel" | "Mtn" | "9Mobile" | "Glo";

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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
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
                {beneficiaries.length > 0 && (
                  <View>
                    <Text style={styles.headText} allowFontScaling={false}>
                      Saved Beneficiaries
                    </Text>
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
                    ) : (
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
                    )}
                  </View>
                )}

                <View className="mb-4">
                  <Text style={styles.label} allowFontScaling={false}>
                    Phone Number
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter phone number"
                      placeholderTextColor="#9BA1A8"
                      allowFontScaling={false}
                      value={phoneNumber}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                        detectOperator(text);
                      }}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {/* <TouchableOpacity>
                      <ProfileCircle color={COLORS.violet400} />
                    </TouchableOpacity> */}
                  </View>
                </View>

                {/* Select Network Provider */}
                <Text style={styles.headText} allowFontScaling={false}>
                  Select Network Provider
                </Text>
                <View className="flex-row p-2 bg-white rounded-xl  items-center justify-between">
                  <TouchableOpacity
                    onPress={() => setSelectedOperator("Airtel")}
                    style={[
                      selectedOperator === "Airtel" && styles.selectedOperator,
                    ]}
                  >
                    <View>
                      <Airtel />
                      {selectedOperator === "Airtel" && (
                        <TickCircle
                          size={18}
                          variant="Bold"
                          color="#fff"
                          style={{
                            zIndex: 1,
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedOperator("Mtn")}
                    style={[
                      selectedOperator === "Mtn" && styles.selectedOperator,
                    ]}
                  >
                    <View>
                      <Mtn />
                      {selectedOperator === "Mtn" && (
                        <TickCircle
                          size={18}
                          variant="Bold"
                          color="#fff"
                          style={{
                            zIndex: 1,
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedOperator("9Mobile")}
                    style={[
                      selectedOperator === "9Mobile" && styles.selectedOperator,
                    ]}
                  >
                    <View>
                      <Eti />
                      {selectedOperator === "9Mobile" && (
                        <TickCircle
                          size={18}
                          variant="Bold"
                          color="#fff"
                          style={{
                            zIndex: 1,
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedOperator("Glo")}
                    style={[
                      selectedOperator === "Glo" && styles.selectedOperator,
                    ]}
                  >
                    <View>
                      <Glo />
                      {selectedOperator === "Glo" && (
                        <TickCircle
                          size={18}
                          variant="Bold"
                          color="#fff"
                          style={{
                            zIndex: 1,
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Inputs */}
                <View className="mb-6">
                  <View className="mt-4">
                    <Text style={styles.label} allowFontScaling={false}>
                      Plan
                    </Text>
                    <TouchableOpacity
                      style={[!selectedOperator && {}]}
                      className="p-3 flex-row items-center border border-gray-300 rounded-xl"
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

                {/* Save as Beneficiary Toogle */}
                <View className="mb-4">
                  <View className="flex-row items-center gap-2 mt-2">
                    <Text
                      style={styles.beneficiaryText}
                      allowFontScaling={false}
                    >
                      Save as beneficiary
                    </Text>
                    <Switch />
                  </View>
                </View>
              </View>
            </View>
            <Button
              title={"Proceed"}
              className="mt-10"
              style={{
                backgroundColor: isButtonDisabled
                  ? COLORS.violet200
                  : COLORS.violet400,
              }}
              onPress={() => {
                if (selectedPlan) {
                  navigation.navigate("ReviewDataSummaryScreen", {
                    selectedOperator,
                    selectedPlan,
                    phoneNumber,
                  });
                }
              }}
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
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  tabContent: {
    marginTop: SPACING,
    fontFamily: "Outfit-Regular",
  },
  contentText: {
    fontSize: RFValue(18),
    fontFamily: "Outfit-Regular",
    color: "#000",
  },
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
  topupText: {
    fontFamily: "Outfit-Regular",
  },

  beneficiaryText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  selectedOperator: {
    opacity: 0.5,
  },
});
