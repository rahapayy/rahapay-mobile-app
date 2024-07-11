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
import {
  ArrowDown2,
  ArrowLeft,
  ProfileCircle,
  TickCircle,
} from "iconsax-react-native";
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Airtel from "../../assets/svg/air.svg";
import Mtn from "../../assets/svg/mtn.svg";
import Eti from "../../assets/svg/eti.svg";
import Glo from "../../assets/svg/glo.svg";
import Button from "../../components/Button";
import SelectDataPlanModal from "../../components/SelectDataPlanModal";

interface DataScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const DataScreen: React.FC<DataScreenProps> = ({ navigation }) => {
  const [selectedOperator, setSelectedOperator] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectPackage = (
    plan: string,
    days: string,
    plan_id: string,
    amount: number
  ) => {
    
    // Handle the selected package
    console.log({ plan, days, plan_id, amount });
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
                      Plan
                    </Text>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => setModalVisible(true)}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: "Outfit-Regular",
                          color: "#DFDFDF",
                          fontSize: RFValue(12),
                        }}
                        allowFontScaling={false}
                      >
                        Select plan
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
              style={{
                backgroundColor: COLORS.violet200,
              }}
              onPress={() => {
                navigation.navigate("ReviewSummaryScreen");
              }}
              textColor="#fff"
            />

            <SelectDataPlanModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              route={{
                params: {
                  selectedOperator,
                  onSelectPackage,
                },
              }}
              navigation={navigation}
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
    padding: 14,
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

  beneficiaryText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  selectedOperator: {
    opacity: 0.5,
  },
});
