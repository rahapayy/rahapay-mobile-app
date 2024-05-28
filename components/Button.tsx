import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
} from "react-native";
import React from "react";
import COLORS from "../config/colors";
import { RFValue } from "react-native-responsive-fontsize";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textColor = "black",
  ...rest
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Adjust these styles according to screen width and height
  const buttonWidth = screenWidth * 0.85;
  const buttonHeight = screenHeight * 0.06;
  const buttonBottomMargin = screenHeight * 0.1;
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...rest}
    >
      <Text
        style={[styles.buttonText, { color: textColor }]}
        allowFontScaling={false}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.violet400,
    width: 0.92 * windowWidth,
    height: 0.06 * windowHeight,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
  },
});
