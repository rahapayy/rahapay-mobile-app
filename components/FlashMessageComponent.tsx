import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useRef, useEffect } from "react";
import SPACING from "../constants/SPACING";
import COLORS from "../constants/colors";
import {
  Message,
  MessageComponentProps,
  MessageType,
  showMessage,
} from "react-native-flash-message";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons"; // For icons

const FlashMessageComponent = ({ message }: MessageComponentProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2700);

    return () => clearTimeout(timer);
  }, [slideAnim, fadeAnim]);

  // Define background color based on message type
  const backgroundColor =
    message.type === "success"
      ? "#E7F9E7" // Light green for success
      : message.type === "info" || message.type === "default"
      ? COLORS.info
      : "#FEE2E2"; // Light red for error

  // Define text/icon color based on message type
  const textIconColor =
    message.type === "success"
      ? "#28A745" // Dark green for success
      : message.type === "info" || message.type === "default"
      ? "#fff" // Blue for info
      : "#DC2626"; // Dark red for error

  // Define icon based on message type
  const iconName =
    message.type === "success"
      ? "checkmark-circle" // Success: checkmark in a circle
      : message.type === "info" || message.type === "default"
      ? "information-circle" // Info/Default: info symbol
      : "alert-circle"; // Error: alert/warning symbol

  return (
    <View style={{ paddingHorizontal: SPACING }}>
      <Animated.View
        style={{
          marginTop: SPACING * 5,
          paddingHorizontal: SPACING * 2,
          paddingVertical: SPACING * 1.5,
          backgroundColor: backgroundColor,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        {/* Left Icon with Sparkles (only for success) */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={iconName}
            size={RFValue(20)} // Slightly larger for visibility
            color={textIconColor}
            style={{ marginRight: SPACING }}
          />
          {/* Sparkle effect (only for success) */}
          {message.type === "success" && (
            <>
              <Ionicons
                name="sparkles"
                size={RFValue(8)}
                color={textIconColor}
                style={{ position: "absolute", top: -5, left: -5 }}
              />
              <Ionicons
                name="sparkles"
                size={RFValue(8)}
                color={textIconColor}
                style={{ position: "absolute", bottom: -5, left: 0 }}
              />
            </>
          )}
        </View>

        {/* Message Text */}
        <Text
          allowFontScaling={false}
          style={{
            fontSize: RFValue(14),
            color: textIconColor,
            fontFamily: "Outfit-Regular",
            flex: 1,
            textAlign: "left",
          }}
        >
          {message.message || "An error occurred."}
        </Text>

        {/* Close Button */}
        <TouchableOpacity
          onPress={() => {
            Animated.parallel([
              Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start();
          }}
        >
          <Ionicons name="close" size={RFValue(16)} color="#333" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export const handleShowFlash = ({
  message,
  description,
  type,
}: Partial<Message> & { type?: MessageType }) => {
  showMessage({
    message: message || "Error",
    animated: true,
    animationDuration: 500,
    autoHide: true,
    duration: 3000,
    description: description || "Something went wrong",
    type: type || "default",
  });
};

export default FlashMessageComponent;
