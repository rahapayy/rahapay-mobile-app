import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../../constants/colors";
import SPACING from "../../../../constants/SPACING";

interface BasicPasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
}

export const BasicPasswordInput: React.FC<BasicPasswordInputProps> = ({
  value,
  onChangeText,
  placeholder = "Password",
  style,
  inputStyle,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused ? styles.focusedInput : undefined,
        error ? styles.errorInput : undefined,
        style,
      ]}
    >
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#BABFC3"
        allowFontScaling={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={showPassword}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        {showPassword ? (
          <Eye color={COLORS.violet400} size={20} variant="Bold" />
        ) : (
          <EyeSlash color={COLORS.violet400} size={20} variant="Bold" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#DFDFDF",
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 14 : 8,
  },
  input: {
    flex: 1,
    fontSize: RFValue(10),
    fontFamily: "Outfit-Regular",
  },
  focusedInput: {
    borderColor: COLORS.violet600,
  },
  errorInput: {
    borderColor: "red",
  },
});
