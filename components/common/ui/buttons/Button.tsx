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
import { MediumText } from "../../Text";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textColor?: string;
  isLoading?: boolean;
  borderOnly?: boolean;
  subBrand?: boolean;
  icon?: React.ReactNode; // Single icon prop
  iconPosition?: "left" | "right"; // Specify icon position
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textColor = "black",
  isLoading = false,
  disabled,
  borderOnly = false,
  subBrand = false,
  icon,
  iconPosition = "left", // Default to left
  ...rest
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        borderOnly && styles.borderOnlyButton,
        subBrand && styles.subBrandButton,
        style,
        disabled && { opacity: 0.5 },
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...rest}
    >
      <View style={styles.contentContainer}>
        {icon && iconPosition === "left" && (
          <View style={styles.icon}>{icon}</View>
        )}
        {isLoading ? (
          <ActivityIndicator size="small" color={borderOnly ? COLORS.violet400 : "#fff"} style={styles.spinner} />
        ) : (
          <MediumText
            color={borderOnly ? "primary" : "white"}
            style={[styles.buttonText, { color: borderOnly ? COLORS.violet400 : textColor }]}
          >
            {title}
          </MediumText>
        )}
        {icon && iconPosition === "right" && (
          <View style={styles.icon}>{icon}</View>
        )}
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
  icon: {
    marginHorizontal: 5,
  },
  spinner: {
    marginRight: 8,
  },
});
