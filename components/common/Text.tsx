import React, { ReactNode } from "react";
import { Text, TextProps, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { COLORS } from "../../constants/ui";

const fontColors = {
  primary: COLORS.brand.primary,
  dark: COLORS.text.dark,
  black: COLORS.text.black,
  light: COLORS.text.light,
  grey: COLORS.brand.background,
  error: COLORS.error.secondary,
  lightGrey: COLORS.grey[300],
  mediumGrey: COLORS.grey[400],
  white: "#fff",
};

const fontSize = {
  large: RFValue(16),
  xlarge: RFValue(20),
  xxlarge: RFValue(24),
  base: RFValue(12),
  medium: RFValue(14),
  small: RFValue(10),
  xsmall: RFValue(8),
  xxsmall: RFValue(6),
};

interface CustomTextProps extends TextProps {
  children: ReactNode;
  color:
    | "primary"
    | "dark"
    | "black"
    | "light"
    | "white"
    | "grey"
    | "lightGrey"
    | "error"
    | "mediumGrey";
  size?:
    | "large"
    | "xlarge"
    | "xxlarge"
    | "base"
    | "small"
    | "xsmall"
    | "xxsmall"
    | "medium";
  center?: boolean;
  capitalize?: boolean;
  underline?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

export function MediumText({
  children,
  color,
  size = "base",
  center,
  capitalize,
  underline,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: CustomTextProps) {
  return (
    <Text
      style={{
        fontFamily: "Outfit-Medium",
        color: fontColors[color],
        fontSize: fontSize[size],
        textAlign: center ? "center" : "left",
        textTransform: capitalize ? "capitalize" : "none",
        textDecorationLine: underline ? "underline" : "none",
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      }}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
}

export function LightText({
  children,
  color,
  size = "base",
  center,
  capitalize,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: CustomTextProps) {
  return (
    <Text
      style={{
        fontFamily: "Outfit-Light",
        color: fontColors[color],
        fontSize: fontSize[size],
        textAlign: center ? "center" : "left",
        textTransform: capitalize ? "capitalize" : "none",
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      }}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
}

export function RegularText({
  children,
  color,
  size = "base",
  center,
  capitalize,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: CustomTextProps) {
  return (
    <Text
      style={{
        fontFamily: "Outfit-Regular",
        color: fontColors[color],
        fontSize: fontSize[size],
        textAlign: center ? "center" : "left",
        textTransform: capitalize ? "capitalize" : "none",
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      }}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
}

export function BoldText({
  children,
  color,
  size = "base",
  center,
  capitalize,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: CustomTextProps) {
  return (
    <Text
      style={{
        fontFamily: "Outfit-Bold",
        color: fontColors[color],
        fontSize: fontSize[size],
        textAlign: center ? "center" : "left",
        textTransform: capitalize ? "capitalize" : "none",
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      }}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
}

interface HeadTextProps {
  title: string;
  description: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

export function HeadText({
  title,
  description,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: HeadTextProps) {
  return (
    <View style={{ marginTop, marginBottom, marginLeft, marginRight }}>
      <BoldText color="black" size="xlarge">
        {title}
      </BoldText>
      <MediumText color="light">{description}</MediumText>
    </View>
  );
}
