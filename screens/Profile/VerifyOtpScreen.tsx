import {
  SafeAreaView,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import BackButton from "@/components/common/ui/buttons/BackButton";
import { AppStackParamList } from "../../types/RootStackParams";

// Define the expected error response structure from the API
interface ErrorResponse {
  message: string | string[];
}

// Define props type for the component
interface VerifyOtpScreenProps {
  navigation: NativeStackNavigationProp<AppStackParamList, "VerifyOtp">;
}

// Define the form values type
interface FormValues {
  otp: string[];
}

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation }) => {
  const otpLength = 6; // Assuming OTP is 6 digits, adjust if different

  const [formValues, setFormValues] = useState<FormValues>({
    otp: Array(otpLength).fill(""),
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(value: string[]) {
    setFormValues((prev) => ({ ...prev, otp: value }));
  }

  async function handleButtonClick() {
    const otpStr = formValues.otp.join("");

    if (otpStr.length !== otpLength) {
      handleShowFlash({
        message: `Please enter a ${otpLength}-digit OTP`,
        type: "danger",
      });
      return;
    }

    setIsLoading(true);
    try {
      await services.authService.verifyResetOtp({
        otp: otpStr,
      });
      handleShowFlash({
        message: "OTP verified successfully!",
        type: "success",
      });
      navigation.navigate("ChangePinScreen", {
        type: "transactionPin",
        otp: otpStr,
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message instanceof Array
          ? axiosError.response.data.message[0]
          : axiosError.response?.data?.message ||
            "An unexpected error occurred";
      console.error("Failed to verify OTP:", errorMessage);
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
          <View style={styles.header}>
            <BackButton navigation={navigation} />
            <RegularText color="black" size="large" marginLeft={10}>
              Verify OTP
            </RegularText>
          </View>
          <View style={{ padding: 16, flex: 1 }}>
            <View className="flex-1">
              <View style={styles.inputContainer}>
                <Label text="OTP" marked={false} />
                <View className="justify-start items-start">
                  <OtpInput
                    length={otpLength}
                    value={formValues.otp}
                    onChange={(value) => handleInputChange(value)}
                    secureTextEntry={false}
                    autoFocus={true}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
            <Button
              title="Verify"
              onPress={handleButtonClick}
              isLoading={isLoading}
              disabled={formValues.otp.some((digit) => !digit) || isLoading}
              style={{ marginTop: SPACING * 4 }}
              textColor="#fff"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
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
