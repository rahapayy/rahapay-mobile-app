import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../../constants/SPACING";
import COLORS from "../../../../constants/colors";

interface VerificationInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
  secureTextEntry?: boolean;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  length,
  value,
  onChange,
  secureTextEntry = false,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>(new Array(length).fill(null));
  const [inputFocused, setInputFocused] = useState(new Array(length).fill(false));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (text: string, index: number) => {
    if (/^\d{0,1}$/.test(text)) {
      const newValue = [...value];
      newValue[index] = text;
      onChange(newValue);

      if (text !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && value[index] === '') {
      const newValue = [...value];
      newValue[index - 1] = '';
      onChange(newValue);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (text: string) => {
    if (text.length === length && /^\d+$/.test(text)) {
      onChange(text.split(''));
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <View style={styles.inputRow}>
      {value.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.inputBox,
            inputFocused[index] && styles.inputBoxFocused,
          ]}
          keyboardType="numeric"
          value={digit}
          secureTextEntry={secureTextEntry}
          allowFontScaling={false}
          onChangeText={(text) => {
            if (text.length > 1) {
              handlePaste(text);
            } else {
              handleInput(text, index);
            }
          }}
          onKeyPress={(event) => handleKeyPress(event, index)}
          onFocus={() => setInputFocused((prev) => {
            const newFocused = [...prev];
            newFocused[index] = true;
            return newFocused;
          })}
          onBlur={() => setInputFocused((prev) => {
            const newFocused = [...prev];
            newFocused[index] = false;
            return newFocused;
          })}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBox: {
    width: 40,
    height: 40,
    textAlign: 'center',
    borderRadius: 10,
    margin: SPACING / 3,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    fontSize: RFValue(10),
    fontWeight: 'bold',
  },
  inputBoxFocused: {
    borderColor: COLORS.violet400,
    borderWidth: 1,
  },
});

export default VerificationInput;
