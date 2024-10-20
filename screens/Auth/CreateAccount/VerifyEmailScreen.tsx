import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
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
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import { LightText, MediumText } from "../../../components/common/Text";

type VerifyEmailScreenRouteParams = {
  email: string;
  id: string;
};

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

  const [boxes, setBoxes] = useState(["", "", "", "", "", ""]);
  const boxRefs = useRef<Array<TextInput | null>>(new Array(6).fill(null));
  const [boxIsFocused, setBoxIsFocused] = useState(new Array(6).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const { verifyEmail, resendOtp, refreshAccessToken } =
    useContext(AuthContext);

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

  const handleInput = (text: string, index: number) => {
    if (/^\d{0,1}$/.test(text)) {
      const newBoxes = [...boxes];
      newBoxes[index] = text;
      setBoxes(newBoxes);

      const allBoxesCleared = newBoxes.every((box) => box === "");

      if (text === "" && index > 0) {
        boxRefs.current[index - 1]?.focus();
      } else if (index < 5 && !allBoxesCleared) {
        boxRefs.current[index + 1]?.focus();
      } else if (allBoxesCleared) {
        boxRefs.current[0]?.focus();
      }
    }
  };

  const handlePaste = (text: string) => {
    if (/^\d{6}$/.test(text)) {
      const newBoxes = text.split("");
      setBoxes(newBoxes);
      boxRefs.current[5]?.focus();
    }
  };

  const handleKeyPress = (index: number, event: any) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      const newBoxes = [...boxes];
      newBoxes[index - 1] = "";
      setBoxes(newBoxes);
      boxRefs.current[index - 1]?.focus();
    }
  };

  const handleButtonClick = async () => {
    const otp = boxes.join("");
    setIsLoading(true);
    if (otp.length === 6) {
      setIsSubmitting(true);
      try {
        await verifyEmail(otp)
          .then((response) => {
            refreshAccessToken(response.data.refreshToken)
              .then(async (response) => {
                await AsyncStorage.setItem(
                  "access_token",
                  response.accessToken
                );
                handleShowFlash({
                  message: "Email verified successfully!",
                  type: "success",
                });
                navigation.navigate("CreateTransactionPinScreen");
              })
              .catch((err) => console.log({ refreshError: err }));
          })
          .catch((err) => console.log({ verifyErr: err }));
      } catch (error) {
        const err = error as {
          response?: { data?: { message?: string; code?: string } };
          message: string;
        };
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";

        if (err.response?.data?.code === "INVALID_OTP") {
          handleShowFlash({
            message: "The OTP you entered is incorrect. Please try again.",
            type: "danger",
          });
        } else {
          handleShowFlash({
            message: errorMessage,
            type: "danger",
          });
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
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOtp(id);
      handleShowFlash({
        message: "OTP resent successfully!",
        type: "success",
      });
      setResendCountdown(60);
    } catch (error) {
      console.log("Resend OTP Error:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message: string;
      };
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      console.log(errorMessage);

      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="p-4">
          <BackButton navigation={navigation} />

          <View className="mt-4">
            <MediumText color="black" size="xlarge" marginBottom={5}>
              Verify Email Address
            </MediumText>
            <LightText color="mediumGrey" size="base">
              Enter the OTP sent to {email}
            </LightText>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              {boxes.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (boxRefs.current[index] = ref)}
                  style={[
                    styles.inputBox,
                    boxIsFocused[index] && styles.inputBoxFocused,
                  ]}
                  keyboardType="numeric"
                  value={value}
                  secureTextEntry
                  allowFontScaling={false}
                  onChangeText={(text) => {
                    if (text.length > 1) {
                      handlePaste(text);
                    } else {
                      handleInput(text, index);
                    }
                  }}
                  onFocus={() =>
                    setBoxIsFocused((prevState) => [
                      ...prevState.slice(0, index),
                      true,
                      ...prevState.slice(index + 1),
                    ])
                  }
                  onBlur={() =>
                    setBoxIsFocused((prevState) => [
                      ...prevState.slice(0, index),
                      false,
                      ...prevState.slice(index + 1),
                    ])
                  }
                  onKeyPress={(event) => handleKeyPress(index, event)}
                />
              ))}
            </View>
          </View>

          <Button
            title={"Verify Account"}
            onPress={handleButtonClick}
            className="mt-4"
            textColor="#fff"
            isLoading={isLoading}
            disabled={isSubmitting || !isInputFilled || isLoading}
            style={
              isSubmitting || !isInputFilled ? styles.disabledButton : null
            }
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
      </ScrollView>
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
  inputBoxFocused: {
    borderColor: COLORS.violet400,
    borderWidth: 1,
  },
  otpText: {
    fontSize: RFValue(13),
    fontFamily: "Outfit-Regular",
  },
  countdownContainer: {
    marginTop: SPACING * 2,
    backgroundColor: COLORS.violet200,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderRadius: 4,
  },
  countdownText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
});
