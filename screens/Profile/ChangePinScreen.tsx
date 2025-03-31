import {
  SafeAreaView,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import COLORS from "../../constants/colors";
import Button from "../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { RegularText } from "../../components/common/Text";
import OtpInput from "../../components/common/ui/forms/OtpInput";
import Label from "../../components/common/ui/forms/Label";
import { services } from "@/services";
import { Platform } from "react-native";
import { AxiosError } from "axios";

// Define the expected error response structure from the API
interface ErrorResponse {
  message: string | string[];
}

// Define props type for the component
interface ChangePinScreenProps {
  navigation: NativeStackNavigationProp<{ ChangePin: { type: "transactionPin" } }, "ChangePin">;
}

// Define the form values type
interface FormValues {
  otp: string[];
  newPin: string[];
}

const ChangePinScreen: React.FC<ChangePinScreenProps> = ({ navigation }) => {
  const pinLength = 4; // Fixed for transactionPin
  const otpLength = 6; // Assuming OTP is 6 digits, adjust if different

  const [formValues, setFormValues] = useState<FormValues>({
    otp: Array(otpLength).fill(""),
    newPin: Array(pinLength).fill(""),
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(value: string[], fieldKey: keyof FormValues) {
    setFormValues((prev) => ({ ...prev, [fieldKey]: value }));
  }

  async function handleButtonClick() {
    const otpStr = formValues.otp.join("");
    const newPinStr = formValues.newPin.join("");

    if (otpStr.length !== otpLength) {
      handleShowFlash({
        message: `Please enter a ${otpLength}-digit OTP`,
        type: "danger",
      });
      return;
    }

    if (newPinStr.length !== pinLength) {
      handleShowFlash({
        message: `Please enter a ${pinLength}-digit PIN`,
        type: "danger",
      });
      return;
    }

    setIsLoading(true);
    try {
      await services.userService.verifyTransactionPinReset({
        otp: otpStr,
        transactionPin: newPinStr,
      });
      handleShowFlash({
        message: "Transaction PIN changed successfully!",
        type: "success",
      });
      navigation.goBack();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message instanceof Array
          ? axiosError.response.data.message[0]
          : axiosError.response?.data?.message || "An unexpected error occurred";
      console.error("Failed to update transaction PIN:", errorMessage);
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ padding: 16, flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.leftIcon}
              >
                <ArrowLeft color="#000" size={24} />
              </TouchableOpacity>
              <RegularText color="black" size="large">
                Change Transaction PIN
              </RegularText>
            </View>
            <View className="flex-1">
              <View style={styles.inputContainer}>
                <Label text="OTP" marked={false} />
                <View className="justify-start items-start">
                  <OtpInput
                    length={otpLength}
                    value={formValues.otp}
                    onChange={(value) => handleInputChange(value, "otp")}
                    secureTextEntry={false}
                    autoFocus={true}
                    disabled={isLoading}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Label text="New Transaction PIN" marked={false} />
                <View className="justify-start items-start">
                  <OtpInput
                    length={pinLength}
                    value={formValues.newPin}
                    onChange={(value) => handleInputChange(value, "newPin")}
                    secureTextEntry
                    autoFocus={false}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
            <Button
              title="Confirm"
              onPress={handleButtonClick}
              isLoading={isLoading}
              disabled={
                formValues.otp.some((digit) => !digit) ||
                formValues.newPin.some((digit) => !digit) ||
                isLoading
              }
              style={{ marginTop: SPACING * 4 }}
              textColor="#fff"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ChangePinScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  inputContainer: {
    flexDirection: "column",
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: SPACING * 2,
  },
});