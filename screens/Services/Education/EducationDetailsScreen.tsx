import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStackParams";
import SPACING from "../../../config/SPACING";
import FONT_SIZE from "../../../config/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import Button from "../../../components/Button";
import { ArrowLeft } from "iconsax-react-native";

type EducationDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EducationDetailsScreen"
>;

const EducationDetailsScreen: React.FC<EducationDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { exam, plan_id, amount, serviceType } = route.params;
  const [phoneNumber, setPhoneNumber] = useState("");

  const isButtonDisabled = !phoneNumber;

  const handleSubmit = () => {
    navigation.navigate("ReviewEducationSummaryScreem", {
      exam,
      plan_id,
      amount,
      serviceType,
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
            Enter Details
          </Text>
        </View>

        <View>
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

          <Text style={styles.label} allowFontScaling={false}>
            Service
          </Text>
          <View style={styles.input}>
            <Text
              style={{ fontFamily: "Outfit-Regular", color: COLORS.black200 }}
              allowFontScaling={false}
            >
              {serviceType} - {amount}
            </Text>
          </View>
        </View>

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

export default EducationDetailsScreen;

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
