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
import COLORS from "../../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textColor?: string;
  isLoading?: boolean;
  borderOnly?: boolean;
  subBrand?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textColor = "black",
  isLoading = false,
  disabled,
  borderOnly = false,
  subBrand = false, // Default value for new prop
  ...rest
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Adjust these styles according to screen width and height
  const buttonWidth = screenWidth * 0.85;
  const buttonHeight = screenHeight * 0.06;
  const buttonBottomMargin = screenHeight * 0.1;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        borderOnly && styles.borderOnlyButton,
        subBrand && styles.subBrandButton,
        style,
        disabled && { opacity: 0.5 },
      ]}
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
  borderOnlyButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.violet400,
  },
  subBrandButton: {
    backgroundColor: COLORS.violet200,
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Medium",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    marginRight: 8,
  },
});
