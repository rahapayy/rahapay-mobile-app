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

interface BasicInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "off" | "password";
  autoCorrect?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: ViewStyle;
  inputStyle?: TextStyle;
  icon?: React.ReactNode;
}

const BasicInput: React.FC<BasicInputProps> = ({
  value,
  onChangeText,
  placeholder,
  onBlur,
  secureTextEntry = false,
  autoCapitalize = "none",
  autoComplete = "off",
  autoCorrect = false,
  keyboardType = "default",
  style,
  inputStyle,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <View
      style={[styles.inputContainer, isFocused && styles.focusedInput, style]}
    >
      {icon}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#BABFC3"
        allowFontScaling={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={showPassword}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          {showPassword ? (
            <EyeSlash color="#000" size={20} />
          ) : (
            <Eye color="#000" size={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#BABFC3",
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
});

export default BasicInput;
