import React, { useEffect, useRef, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import Button from "../../../components/common/ui/buttons/Button";
import { services } from "../../../services/apiClient";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import {
  LightText,
  MediumText,
  SemiBoldText,
} from "../../../components/common/Text";
import { IVerifyResetDto } from "@/services/dtos";
import OtpInput from "@/components/common/ui/forms/OtpInput";

type EnterCodeScreenRouteParams = {
  email: string;
};

const EnterCodeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const route =
    useRoute<RouteProp<{ params: EnterCodeScreenRouteParams }, "params">>();
  const email = route.params.email;

  const [boxes, setBoxes] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const boxRefs = useRef<Array<TextInput | null>>(new Array(6).fill(null));
  const [boxIsFocused, setBoxIsFocused] = useState(new Array(6).fill(false));
  const [resendCountdown, setResendCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // const requestOtpHandler = async () => {
  //   setIsSubmitting(true);
  //   setResendCountdown(60); // Reset countdown when Resend OTP is clicked
  //   try {
  //     await services.authService.resendOtp(id);
  //     handleShowFlash({
  //       message: "OTP sent to your email successfully!",
  //       type: "success",
  //     });
  //     setIsOtpRequested(true);
  //   } catch (error) {
  //     const err = error as {
  //       response?: { data?: { message?: string } };
  //       message: string;
  //     };
  //     const errorMessage =
  //       err.response?.data?.message || err.message || "An error occurred";
  //     handleShowFlash({
  //       message: errorMessage,
  //       type: "danger",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleButtonClick = async () => {
    const otp = boxes.join("");
    if (otp.length === 6) {
      setIsSubmitting(true);
      try {
        const payload: IVerifyResetDto = {
          otp,
        };

        const response = await services.authService.verifyResetOtp(payload);

        console.log("API Response:", response.data);
        handleShowFlash({
          message: "OTP verified successfully!",
          type: "success",
        });

        const resetToken = response.data.resetToken;

        console.log("Received resetToken:", resetToken);
        if (!resetToken) {
          throw new Error("Reset token is missing from the response");
        }
        navigation.navigate("CreateNewPasswordScreen", {
          resetToken: resetToken,
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message instanceof Array
            ? error.response.data.message[0]
            : error.response?.data?.message || "An unexpected error occurred";
        console.error("Login error:", errorMessage);
        handleShowFlash({
          message: errorMessage,
          type: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleShowFlash({
        message: "Please enter the complete OTP",
        type: "warning",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 16 }}>
        <View>
          <BackButton navigation={navigation} />
          <View style={{ marginTop: 16 }}>
            <SemiBoldText color="black" size="xlarge" marginBottom={5}>
              Enter Code
            </SemiBoldText>
            <LightText color="mediumGrey" size="base">
              Enter the code sent to {email}
            </LightText>
          </View>

          <OtpInput
            value={boxes}
            length={6}
            onChange={setBoxes}
            secureTextEntry
            autoFocus={true}
          />
          <View className="justify-center items-center mt-6">
            <LightText color="light">Didn't receive an OTP?</LightText>

            {/* <TouchableOpacity
              onPress={requestOtpHandler}
              disabled={resendCountdown > 0}
            >
              <View style={styles.countdownContainer}>
                <RegularText color="black" size="medium">
                  {resendCountdown > 0
                    ? `Resend OTP (${resendCountdown}s)`
                    : "Resend OTP"}
                </RegularText>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>

        <Button
          title={"Proceed"}
          onPress={handleButtonClick}
          style={{ marginTop: "auto" }}
          textColor="#fff"
          isLoading={isSubmitting}
          // disabled={isSubmitting || boxes.some((box) => !box)}
        />
      </View>
    </SafeAreaView>
  );
};

export default EnterCodeScreen;

const styles = StyleSheet.create({
  countdownContainer: {
    marginTop: SPACING * 2,
    backgroundColor: COLORS.violet200,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderRadius: 4,
  },
});
