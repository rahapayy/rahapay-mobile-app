import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LightText,
  MediumText,
  SemiBoldText,
} from "../../../components/common/Text";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { IVerifyEmailDto } from "@/services/dtos";
import { services } from "@/services";
import { setItem, removeItem } from "@/utils/storage";
import { useAuth } from "@/services/AuthContext";
import OtpInput from "@/components/common/ui/forms/OtpInput";
import * as Sentry from "@sentry/react-native";

type VerifyEmailScreenRouteParams = { email: string; id: string };

interface VerifyEmailScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  navigation,
}) => {
  const route =
    useRoute<RouteProp<{ params: VerifyEmailScreenRouteParams }, "params">>();
  const email = route.params.email;
  const id = route.params.id;

  const { setUserInfo, setIsFreshLogin } = useAuth();
  const [boxes, setBoxes] = useState(["", "", "", "", "", ""]);
  const boxRefs = useRef<Array<TextInput | null>>(new Array(6).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsInputFilled(boxes.every((box) => box !== ""));
  }, [boxes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    boxRefs.current[0]?.focus();
  }, []);

  const handleButtonClick = async () => {
    const otp = boxes.join("");
    setIsLoading(true);
    if (otp.length === 6) {
      setIsSubmitting(true);
      try {
        const payload: IVerifyEmailDto = { otp, email };
        const response = await services.authService.verifyEmail(payload);

        if (response?.data?.accessToken) {
          // Clear lock-related storage to prevent lock screen
          await Promise.all([
            removeItem("IS_LOCKED"),
            removeItem("BACKGROUND_TIMESTAMP"),
            removeItem("WAS_TERMINATED"),
            removeItem("LOCK_TIMESTAMP"),
          ]);
          console.log("Cleared lock-related storage in VerifyEmailScreen");

          // Set tokens
          await Promise.all([
            setItem("ACCESS_TOKEN", response.data.accessToken, true),
            setItem("REFRESH_TOKEN", response.data.refreshToken, true),
          ]);
          console.log("Set ACCESS_TOKEN and REFRESH_TOKEN");

          // Fetch user details and update auth state
          const userResponse = await services.authServiceToken.getUserDetails();
          setUserInfo(userResponse.data);
          setIsFreshLogin(true);
          console.log("Email verification successful, set isFreshLogin: true");

          await AsyncStorage.setItem(
            "ONBOARDING_STATE",
            JSON.stringify({ email, userId: id, step: "createPin" })
          );

          navigation.navigate("CreateTransactionPinScreen");
          handleShowFlash({
            message: "Your account has been successfully verified!",
            type: "success",
          });
        }
      } catch (error: any) {
        Sentry.captureException(error);
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";

        if (error.response?.data?.code === "INVALID_OTP") {
          handleShowFlash({
            message: "The OTP you entered is incorrect. Please try again.",
            type: "danger",
          });
        } else {
          handleShowFlash({ message: errorMessage, type: "danger" });
        }
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    } else {
      handleShowFlash({
        message: "Please enter the complete OTP",
        type: "warning",
      });
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await services.authService.resendOtp(id);
      handleShowFlash({ message: "OTP resent successfully!", type: "success" });
      setResendCountdown(60);
    } catch (error: any) {
      Sentry.captureException(error);
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      handleShowFlash({ message: errorMessage, type: "danger" });
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <ProgressIndicator
          navigation={navigation}
          currentStep={1}
          totalSteps={3}
        />
        <View className="mt-8">
          <SemiBoldText color="black" size="xlarge" marginBottom={5}>
            Verify Email Address
          </SemiBoldText>
          <LightText color="mediumGrey" size="base">
            Enter the OTP sent to {email}
          </LightText>
        </View>
        <View className="mt-8 mb-10">
          <OtpInput
            length={6}
            value={boxes}
            onChange={setBoxes}
            secureTextEntry
            autoFocus={true}
          />
        </View>
        <Button
          title="Verify Account"
          onPress={handleButtonClick}
          className="mt-4"
          textColor="#fff"
          isLoading={isLoading}
          disabled={isSubmitting || !isInputFilled || isLoading}
          style={isSubmitting || !isInputFilled ? styles.disabledButton : null}
        />
        <View className="justify-center items-center mt-6">
          <Text style={styles.otpText} allowFontScaling={false}>
            Didn't receive an OTP?
          </Text>
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={resendCountdown > 0}
          >
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText} allowFontScaling={false}>
                {resendCountdown > 0
                  ? `Resend OTP (${resendCountdown}s)`
                  : "Resend OTP"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING * 2,
    borderRadius: 15,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    textAlign: "center",
    width: 55,
    height: 55,
    borderRadius: 8,
    margin: SPACING / 2,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    fontSize: RFValue(19),
    fontWeight: "bold",
  },
  inputBoxFocused: { borderColor: COLORS.violet400, borderWidth: 1 },
  otpText: { fontSize: RFValue(13), fontFamily: "Outfit-Regular" },
  countdownContainer: {
    marginTop: SPACING * 2,
    backgroundColor: COLORS.violet200,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderRadius: 4,
  },
  countdownText: { fontFamily: "Outfit-Regular", fontSize: RFValue(14) },
  disabledButton: { backgroundColor: COLORS.violet200 },
});