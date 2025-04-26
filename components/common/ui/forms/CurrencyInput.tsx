import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import Label from "./Label";
import { COLORS } from "@/constants/ui";
import { RegularText, SemiBoldText } from "../../Text";
import { RFValue } from "react-native-responsive-fontsize";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  error,
  errorMessage,
}) => {
  const handleChangeText = (text: string) => {
    // Remove any non-numeric characters
    const sanitizedText = text.replace(/[^0-9]/g, "");

    // Store the raw value (without commas) in the state
    onChange(sanitizedText);
  };

  // Format the displayed value with commas
  const formatWithCommas = (value: string): string => {
    if (!value) return "";

    // Convert to number and format with commas
    const number = parseInt(value, 10);
    return number.toLocaleString("en-US");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.errorInput]}>
        <SemiBoldText color="black" marginRight={8} size="large">
          ₦
        </SemiBoldText>
        <TextInput
          style={[styles.input]}
          placeholder="100 - 500,000"
          placeholderTextColor="#BABFC3"
          keyboardType="numeric"
          value={formatWithCommas(value)}
          onChangeText={handleChangeText}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error && errorMessage && (
        <RegularText color="error" marginTop={5} size="small">
          {errorMessage}
        </RegularText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: RFValue(20),
    fontFamily: "Outfit-Regular",
  },
  errorInput: {
    borderColor: COLORS.error.primary,
  },
});

export default CurrencyInput;
