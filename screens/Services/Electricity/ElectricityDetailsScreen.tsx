import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../../components/Button";
import { RootStackParamList } from "../../../navigation/RootStackParams";

type ElectricityDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ElectricityDetailsScreen"
>;

const ElectricityDetailsScreen: React.FC<ElectricityDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { disco, planId, meterType } = route.params as {
    disco: string;
    planId: string;
    meterType: string;
  };

  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const isButtonDisabled = !meterNumber || !phoneNumber || !amount;

  const handleSubmit = () => {
    // Navigate to review screen with all details
    navigation.navigate("ReviewElectricitySummaryScreen", {
      disco,
      planId,
      meterType,
      meterNumber,
      amount,
      phoneNumber,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color={"#000"} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerText]} allowFontScaling={false}>
            Electricity Details
          </Text>
        </View>

        <Text style={styles.label} allowFontScaling={false}>
          Meter Number
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your meter number"
          placeholderTextColor={"#DFDFDF"}
          value={meterNumber}
          onChangeText={setMeterNumber}
          keyboardType="numeric"
          allowFontScaling={false}
        />
        <Text style={styles.label} allowFontScaling={false}>
          Amount
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor={"#DFDFDF"}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          allowFontScaling={false}
        />
        <Text style={styles.label} allowFontScaling={false}>
          Phone Number
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={"#DFDFDF"}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          allowFontScaling={false}
        />

        <Button
          textColor="#fff"
          onPress={handleSubmit}
          title={"Proceed"}
          disabled={isButtonDisabled}
          style={{
            backgroundColor: isButtonDisabled
              ? COLORS.violet200
              : COLORS.violet400,
            marginTop: SPACING * 2,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ElectricityDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING * 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING * 3,
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
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: SPACING,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 8,
    padding: SPACING * 1.4,
    marginBottom: SPACING * 2,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  button: {
    backgroundColor: COLORS.violet400,
    padding: SPACING * 2,
    borderRadius: 8,
    marginTop: SPACING * 2,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    textAlign: "center",
  },
});
