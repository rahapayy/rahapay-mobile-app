import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import COLORS from "../config/colors";
import { RFValue } from "react-native-responsive-fontsize";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textColor?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textColor = "black",
  isLoading = false,
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
      <View style={styles.contentContainer}>
        {isLoading && (
          <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
        )}
        <Text
          style={[styles.buttonText, { color: textColor }]}
          allowFontScaling={false}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.violet400,
    width: 0.92 * windowWidth,
    height: 0.06 * windowHeight,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    marginRight: 8,
  },
});
