import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../../constants/colors";
import SPACING from "../../../../constants/SPACING";
import BasicInput from "./BasicInput";
import { ContactIcon } from "../icons";
// import ContactIcon from "@/assets/svg/mage_contact-book-fill.svg";

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  countryCode: string;
  contactIcon?: React.ReactNode; // Optional prop for custom icon
  onContactPress?: () => void; // Optional callback for icon press
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChangeText,
  countryCode,
  contactIcon = <ContactIcon width={36} height={36} fill={COLORS.violet400} />, // Default to ContactIcon if not provided
  onContactPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.countryCodeContainer}>
          <Image
            source={require("../../../../assets/images/flag-for-nigeria.png")}
            style={styles.flag}
          />
          <Text style={styles.countryCodeText}>{countryCode}</Text>
        </View>
        <View style={styles.separator} />
        <BasicInput
          value={value}
          onChangeText={onChangeText}
          placeholder="8038929383"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      {contactIcon && (
        <TouchableOpacity onPress={onContactPress} style={styles.iconContainer}>
          {contactIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 10,
    overflow: "hidden",
    flex: 1, // Ensures the input takes available space
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 10 : 10,
  },
  flag: {
    width: RFValue(24),
    height: RFValue(24),
    marginRight: SPACING / 2,
  },
  countryCodeText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: COLORS.black500,
  },
  separator: {
    width: 1,
    height: "70%",
    backgroundColor: "#DFDFDF",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 0,
  },
  iconContainer: {
    marginLeft: SPACING / 3, // Space between input and icon
    padding: SPACING / 2, // Optional padding for touch area
  },
});

export default PhoneNumberInput;
