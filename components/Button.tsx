import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import COLORS from "../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../config/SPACING";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, ...rest }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...rest}
    >
      <Text style={styles.buttonText} allowFontScaling={false}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.violet400,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: 24,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(16),
    fontFamily: "Outfit-Regular",
  },
});
