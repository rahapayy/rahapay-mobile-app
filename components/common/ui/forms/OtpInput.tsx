import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../../constants/SPACING";
import COLORS from "../../../../constants/colors";

interface OtpInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  onComplete?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  value,
  onChange,
  secureTextEntry = false,
  autoFocus = true, // Changed default to true for auto keyboard
  disabled = false,
  error = false,
  onComplete,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>(Array(length).fill(null));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Auto-focus first input and show keyboard on mount
  useEffect(() => {
    if (autoFocus && !disabled) {
      // Focus the first input
      inputRefs.current[0]?.focus();
      // Ensure keyboard is shown (redundant on most platforms, but safe)
      Keyboard.dismiss(); // Reset any existing keyboard state
      setTimeout(() => inputRefs.current[0]?.focus(), 100); // Small delay to ensure focus
    }
  }, [autoFocus, disabled]);

  // Trigger onComplete when OTP is fully entered
  useEffect(() => {
    if (value.every((digit) => digit !== "") && onComplete) {
      onComplete(value.join(""));
    }
  }, [value, onComplete]);

  const handleInput = (text: string, index: number) => {
    if (!/^\d?$/.test(text) || disabled) return;

    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (disabled) return;

    const key = event.nativeEvent.key;
    if (key === "Backspace" && value[index] === "" && index > 0) {
      const newValue = [...value];
      newValue[index - 1] = "";
      onChange(newValue);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: any) => {
    if (disabled) return;

    const text = Platform.OS === "web" ? event.nativeEvent.text : event;
    if (text.length >= length && /^\d+$/.test(text)) {
      const newValue = text.slice(0, length).split("");
      onChange(newValue);
      inputRefs.current[length - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    if (!disabled) {
      setFocusedIndex(index);
    }
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.inputBox,
              focusedIndex === index && styles.inputBoxFocused,
              error && styles.inputBoxError,
              disabled && styles.inputBoxDisabled,
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={value[index] || ""}
            secureTextEntry={secureTextEntry}
            allowFontScaling={false}
            editable={!disabled}
            onChangeText={(text) => handleInput(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            onSubmitEditing={() => {
              if (index < length - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
            accessibilityLabel={`OTP digit ${index + 1}`}
            returnKeyType={index === length - 1 ? "done" : "next"}
            blurOnSubmit={index === length - 1}
          />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING / 2,
  },
  inputBox: {
    width: RFValue(45),
    height: RFValue(45),
    textAlign: "center",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.grey100,
    fontSize: RFValue(16),
    fontFamily: "System",
    color: COLORS.black400,
    backgroundColor: "none",
  },
  inputBoxFocused: {
    borderColor: COLORS.violet400,
  },
  inputBoxError: {
    borderColor: COLORS.red500,
  },
  inputBoxDisabled: {
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.grey100,
    opacity: 0.6,
  },
});

export default OtpInput;
