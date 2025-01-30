import React from "react";
import { View, Platform, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  borderOnly?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  className,
  borderOnly,
}) => {
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
  });

  return (
    <View
      className={`${
        borderOnly ? "bg-transparent" : "bg-white"
      } p-4 rounded-xl border border-[#E4E7EC] ${className}`}
      style={[borderOnly ? {} : shadowStyle, style]}
    >
      {children}
    </View>
  );
};

export default Card;
