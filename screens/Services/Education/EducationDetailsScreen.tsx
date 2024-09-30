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
import { RootStackParamList } from "../../../types/RootStackParams";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
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
  const [quantity, setQuantity] = useState(1);

  const isButtonDisabled = !phoneNumber;

  const handleSubmit = () => {
    navigation.navigate("ReviewEducationSummaryScreen", {
      exam,
      plan_id,
      amount,
      serviceType,
      phoneNumber,
      quantity,
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
          <View className="bg-white shadow-md rounded-lg py-4 px-4">
            <Text style={styles.label} allowFontScaling={false}>
              Quantity
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              placeholderTextColor={"#DFDFDF"}
              value={quantity.toString()}
              onChangeText={(text) => setQuantity(parseInt(text) || 1)}
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

            <Text style={styles.label} allowFontScaling={false}>
              Service
            </Text>
            <View style={styles.input}>
              <Text
                style={{ fontFamily: "Outfit-Regular", color: COLORS.black300 }}
                allowFontScaling={false}
              >
                {serviceType} - {amount}
              </Text>
            </View>
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
            marginTop: SPACING * 4,
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
