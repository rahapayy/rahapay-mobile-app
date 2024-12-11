import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SPACING } from "../constants/ui";
import COLORS from "../constants/colors";

interface OtpInputProps {
  boxes: string[];
  boxRefs: React.MutableRefObject<(TextInput | null)[]>;
  handleInput: (text: string, index: number) => void;
  handlePaste: (text: string) => void;
  handleKeyPress: (index: number, event: any) => void;
  boxIsFocused: boolean[];
  setBoxIsFocused: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const OtpInput: React.FC<OtpInputProps> = ({
  boxes,
  boxRefs,
  handleInput,
  handlePaste,
  handleKeyPress,
  boxIsFocused,
  setBoxIsFocused,
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        {boxes.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (boxRefs.current[index] = ref)}
            style={[
              styles.inputBox,
              boxIsFocused[index] && styles.inputBoxFocused,
            ]}
            keyboardType="numeric"
            value={value}
            secureTextEntry
            allowFontScaling={false}
            onChangeText={(text) => {
              if (text.length > 1) {
                handlePaste(text);
              } else {
                handleInput(text, index);
              }
            }}
            onFocus={() =>
              setBoxIsFocused((prevState) => [
                ...prevState.slice(0, index),
                true,
                ...prevState.slice(index + 1),
              ])
            }
            onBlur={() =>
              setBoxIsFocused((prevState) => [
                ...prevState.slice(0, index),
                false,
                ...prevState.slice(index + 1),
              ])
            }
            onKeyPress={(event) => handleKeyPress(index, event)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center" as const,
    paddingVertical: SPACING * 2,
    borderRadius: 15,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center" as const,
  },
  inputBox: {
    flex: 1,
    textAlign: "center",
    width: 55,
    height: 55,
    borderRadius: 8,
    margin: SPACING / 2,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    fontSize: RFValue(19),
    fontWeight: "bold",
  } as TextStyle,
  inputBoxFocused: {
    borderColor: COLORS.violet400,
    borderWidth: 1,
  } as TextStyle,
});

export default OtpInput;
