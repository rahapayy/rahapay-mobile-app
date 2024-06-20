import { View, Text } from "react-native";
import React from "react";
import SPACING from "../config/SPACING";
import COLORS from "../config/colors";
import {
  Message,
  MessageComponentProps,
  MessageType,
  showMessage,
} from "react-native-flash-message";
import { RFValue } from "react-native-responsive-fontsize";

const FlashMessageComponent = ({ message }: MessageComponentProps) => {
  return (
    <View
      style={{
        paddingHorizontal: SPACING,
      }}
    >
      <View
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
        }}
      >
        <Text
          allowFontScaling={false}
          style={{
            fontSize: RFValue(12),
            color: COLORS.white,
            marginLeft: SPACING,
            fontFamily: "Outfit-Regular",
            textAlign: "center",
          }}
        >
          {message.message || "An error occurred."}
        </Text>
      </View>
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
