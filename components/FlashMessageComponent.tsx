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

import Happy from "./../assets/svg/happy.svg";
import Sad from "./../assets/svg/sad.svg";
import Default from "./../assets/svg/bulb.svg";

const FlashMessageComponent = ({ message }: MessageComponentProps) => {
  return (
    <View
      style={{
        paddingHorizontal: SPACING,
        paddingVertical: SPACING * 2,
        backgroundColor:
          message.type === "success"
            ? COLORS.success
            : message.type === "info" || message.type === "default"
            ? COLORS.info
            : COLORS.error,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* {message.type === "success" ? (
        <Happy />
      ) : message.type === "info" || message.type === "default" ? (
        <Default />
      ) : (
        <Sad />
      )} */}
      <Text
        style={{
          fontSize: RFValue(16),
          color: COLORS.white,
          fontWeight: "bold",
          marginLeft: SPACING,
          width: "80%",
        }}
      >
        {message.message || "An error occurred."}
      </Text>
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
