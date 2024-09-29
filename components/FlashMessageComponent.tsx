import { View, Text, Animated } from "react-native";
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

  return (
    <View style={{ paddingHorizontal: SPACING }}>
      <Animated.View
        style={{
          marginTop: SPACING * 5,
          paddingHorizontal: SPACING,
          paddingVertical: SPACING * 2,
          backgroundColor:
            message.type === "success"
              ? COLORS.success
              : message.type === "info" || message.type === "default"
              ? COLORS.info
              : COLORS.error,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        }}
      >
        <Text
          allowFontScaling={false}
          style={{
            fontSize: RFValue(12),
            color: COLORS.white,
            // marginLeft: SPACING,
            fontFamily: "Outfit-Regular",
            // textAlign: "center",
          }}
        >
          {message.message || "An error occurred."}
        </Text>
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
