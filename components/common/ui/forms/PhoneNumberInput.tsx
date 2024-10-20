import React from 'react';
import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../../constants/colors";
import SPACING from "../../../../constants/SPACING";
import BasicInput from './BasicInput';

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  countryCode: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChangeText,
  countryCode,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 10 : 10,
  },
  flag: {
    width: RFValue(24),
    height: RFValue(24),
    marginRight: SPACING / 2,
  },
  countryCodeText: {
    fontFamily: 'Outfit-Regular',
    fontSize: RFValue(12),
    color: COLORS.black500,
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#DFDFDF',
  },
  input: {
    flex: 1,
    borderWidth: 0,
  },
});

export default PhoneNumberInput;
