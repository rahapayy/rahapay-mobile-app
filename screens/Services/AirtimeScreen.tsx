import React, { useState } from "react";
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
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ProfileCircle, TickCircle } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Airtel from "../../assets/svg/air.svg";
import Mtn from "../../assets/svg/mtn.svg";
import Eti from "../../assets/svg/eti.svg";
import Glo from "../../assets/svg/glo.svg";
import Button from "../../components/common/ui/buttons/Button";
import ComingSoon from "../../assets/svg/Coming Soon.svg";
import useApi from "../../utils/api";

const AirtimeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Local");
  const [amount, setAmount] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { mutateAsync } = useApi.post("/beneficiary/me?service=airtime");

  const amounts = [50, 100, 200, 500, 1000, 2000, 3000, 5000];

  // Check if all required fields are filled
  const isButtonDisabled = !selectedOperator || !phoneNumber || !amount;

  const handleProceed = () => {
    // Validate and sanitize the amount
    const sanitizedAmount = parseFloat(amount);

    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    navigation.navigate("ReviewAirtimeSummaryScreen", {
      selectedOperator,
      phoneNumber,
      amount: sanitizedAmount,
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Airtime Top-up
            </Text>
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
                // Local tab
                <View>
                  {/* <Text style={styles.headText} allowFontScaling={false}>
                    Saved Beneficiaries
                  </Text>
                  <View className="flex-row mb-4 gap-2">
                    <TouchableOpacity className="bg-[#EEEBF9] p-3 rounded-2xl">
                      <Text>My number</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#EEEBF9] p-3 rounded-2xl">
                      <Text>+234 0862753934</Text>
                    </TouchableOpacity>
                  </View> */}

                  <View className="mt-2 mb-4">
                    <Text style={styles.label} allowFontScaling={false}>
                      Phone Number
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        placeholderTextColor="#BABFC3"
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
                      <TouchableOpacity>
                        <ProfileCircle color={COLORS.violet400} />
                      </TouchableOpacity>
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
                        selectedOperator === "Airtel" &&
                          styles.selectedOperator,
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
                        selectedOperator === "9Mobile" &&
                          styles.selectedOperator,
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
                  <View>
                    <View className="mt-4">
                      <Text style={styles.label} allowFontScaling={false}>
                        Amount
                      </Text>
                      <View style={styles.inputContainer}>
                        <Text style={styles.naira} allowFontScaling={false}>
                          ₦{" "}
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Amount"
                          placeholderTextColor="#BABFC3"
                          allowFontScaling={false}
                          value={amount}
                          keyboardType="numeric"
                          onChangeText={(text) => setAmount(text)}
                          autoComplete="off"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>
                  </View>
                  {/* Top up suggestion box */}
                  <View className="bg-[#EEEBF9] rounded-xl mt-4">
                    <View className="p-4">
                      <Text style={styles.topupText} allowFontScaling={false}>
                        Topup
                      </Text>

                      {/* Top up amount */}
                      <View className="flex-row flex-wrap">
                        {amounts.map((amount, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => setAmount(amount.toString())}
                            className={"bg-white rounded p-2 m-2"}
                          >
                            <Text
                              style={styles.amountText}
                              allowFontScaling={false}
                            >
                              ₦{amount}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Save as Beneficiary Toogle */}
                  {/* <View className="mb-4">
                    <View className="flex-row items-center gap-2 mt-2">
                      <Text
                        style={styles.beneficiaryText}
                        allowFontScaling={false}
                      >
                        Save as beneficiary
                      </Text>
                      <Switch />
                    </View>
                  </View> */}
                  <Button
                    title={"Proceed"}
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
                // International tab
                // <View>
                //   <Text style={styles.headText} allowFontScaling={false}>
                //     Saved Beneficiaries
                //   </Text>
                //   <View className="flex-row mb-4 gap-2">
                //     <View className="bg-[#EEEBF9] p-3 rounded-2xl">
                //       <Text>My number</Text>
                //     </View>
                //     <View className="bg-[#EEEBF9] p-3 rounded-2xl">
                //       <Text>+234 0862753934</Text>
                //     </View>
                //   </View>

                //   <View className="mt-4 mb-6">
                //     <Text style={styles.label} allowFontScaling={false}>
                //       Phone Number
                //     </Text>
                //     <View style={styles.inputContainer}>
                //       <TextInput
                //         style={styles.input}
                //         placeholder="Enter phone number"
                //         placeholderTextColor="#BABFC3"
                //         allowFontScaling={false}
                //       />
                //       <TouchableOpacity>
                //         <ProfileCircle color={COLORS.violet400} />
                //       </TouchableOpacity>
                //     </View>
                //   </View>
                // </View>
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
    paddingTop: Platform.OS === "ios" ? SPACING : SPACING * 2,
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
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: SPACING,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: RFValue(14),
    color: "#9BA1A8",
    fontFamily: "Outfit-Regular",
  },
  activeTab: {
    alignItems: "center",
  },
  activeTabText: {
    color: COLORS.violet400,
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: COLORS.violet400,
    marginTop: 4,
    width: "100%",
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
  amountText: {
    fontFamily: "Outfit-Regular",
  },
  beneficiaryText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  selectedOperator: {
    opacity: 0.5,
  },
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
