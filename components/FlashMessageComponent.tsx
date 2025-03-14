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
import { Ionicons } from "@expo/vector-icons"; // For icons (checkmark and close)
import { RegularText } from "./common/Text";

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
      ? "#E7F9E7" // Light green for success (similar to the image)
      : message.type === "info" || message.type === "default"
      ? COLORS.info
      : COLORS.error;

  // Define text/icon color based on message type
  const iconColor =
    message.type === "success"
      ? "#28A745" // Green for success (similar to the image)
      : message.type === "info" || message.type === "default"
      ? COLORS.info
      : COLORS.error;

  return (
    <View style={{ paddingHorizontal: SPACING }}>
      <Animated.View
        style={{
          marginTop: SPACING * 5,
          paddingHorizontal: SPACING * 2,
          paddingVertical: SPACING * 1.5,
          backgroundColor: backgroundColor,
          borderRadius: 15, // Rounded corners like in the image
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between", // Space between icon, text, and close button
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
          elevation: 5, // Add shadow for Android
          shadowColor: "#000", // Add shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        {/* Left Icon with Sparkles */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: iconColor,
              borderRadius: 20,
              padding: 5,
              marginRight: SPACING,
            }}
          >
            <Ionicons name="checkmark" size={RFValue(8)} color="#fff" />
          </View>
          {/* Sparkle effect (simulated with small icons) */}
          <Ionicons
            name="sparkles"
            size={RFValue(8)}
            color={iconColor}
            style={{ position: "absolute", top: -5, left: -5 }}
          />
          <Ionicons
            name="sparkles"
            size={RFValue(8)}
            color={iconColor}
            style={{ position: "absolute", bottom: -5, left: 0 }}
          />
        </View>

        {/* Message Text */}
        <Text
          allowFontScaling={false}
          style={{
            fontSize: RFValue(14),
            color: iconColor, // Match text color with icon
            fontFamily: "Outfit-Regular",
            flex: 1, // Take remaining space
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
          <Ionicons
            name="close"
            size={RFValue(16)}
            color="#333" // Dark gray for the close icon
          />
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
