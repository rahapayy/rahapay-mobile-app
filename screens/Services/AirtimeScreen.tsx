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
import { ArrowLeft, Profile, ProfileCircle } from "iconsax-react-native";
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Airtel from "../../assets/svg/air.svg";
import Mtn from "../../assets/svg/mtn.svg";
import Eti from "../../assets/svg/eti.svg";
import Glo from "../../assets/svg/glo.svg";
import Button from "../../components/Button";

const AirtimeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Local");
  const [amount, setAmount] = useState("");

  const amounts = [50, 100, 200, 500, 1000, 2000, 3000, 5000];

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
                  <Text style={styles.headText} allowFontScaling={false}>
                    Saved Beneficiaries
                  </Text>
                  <View className="flex-row mb-4 gap-2">
                    <View className="bg-[#EEEBF9] p-3 rounded-2xl">
                      <Text>My number</Text>
                    </View>
                    <View className="bg-[#EEEBF9] p-3 rounded-2xl">
                      <Text>+234 0862753934</Text>
                    </View>
                  </View>

                  {/* Select Network Provider */}
                  <Text style={styles.headText} allowFontScaling={false}>
                    Select Network Provider
                  </Text>
                  <View className="flex-row p-2 bg-white rounded-xl  items-center justify-between">
                    <TouchableOpacity>
                      <Airtel />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Mtn />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Eti />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Glo />
                    </TouchableOpacity>
                  </View>

                  {/* Inputs */}
                  <View>
                    <View className="mt-4">
                      <Text style={styles.label} allowFontScaling={false}>
                        Phone Number
                      </Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter phone number"
                          placeholderTextColor="#BABFC3"
                          allowFontScaling={false}
                        />
                        <TouchableOpacity>
                          <ProfileCircle color={COLORS.violet400} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View className="mt-4">
                      <Text style={styles.label} allowFontScaling={false}>
                        Amount
                      </Text>
                      <View style={styles.inputContainer}>
                        <Text>₦ </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Amount"
                          placeholderTextColor="#BABFC3"
                          allowFontScaling={false}
                          value={amount}
                          onChangeText={(text) => setAmount(text)}
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
              ) : (
                // International tab
                <View>
                  <Text style={styles.headText} allowFontScaling={false}>
                    Saved Beneficiaries
                  </Text>
                  <View className="flex-row mb-4 gap-2">
                    <View className="bg-[#EEEBF9] p-3 rounded-2xl">
                      <Text>My number</Text>
                    </View>
                    <View className="bg-[#EEEBF9] p-3 rounded-2xl">
                      <Text>+234 0862753934</Text>
                    </View>
                  </View>

                  <View className="mt-4 mb-6">
                    <Text style={styles.label} allowFontScaling={false}>
                      Phone Number
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        placeholderTextColor="#BABFC3"
                        allowFontScaling={false}
                      />
                      <TouchableOpacity>
                        <ProfileCircle color={COLORS.violet400} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
            <Button
              title={"Proceed"}
              style={{
                backgroundColor: COLORS.violet200,
              }}
              onPress={() => {
                navigation.navigate("ReviewSummaryScreen");
              }}
              textColor="#fff"
            />
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
    // paddingHorizontal: SPACING * 2,
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
    padding: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(12),
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
});
