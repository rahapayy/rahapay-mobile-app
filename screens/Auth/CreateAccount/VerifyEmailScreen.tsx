import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { ArrowLeft } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from '@react-navigation/native';
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../config/SPACING";
import COLORS from "../../../config/colors";
import Button from "../../../components/Button";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";

type VerifyEmailRouteProp = RouteProp<{ params: { email: string } }, 'params'>;

const VerifyEmailScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const route = useRoute<VerifyEmailRouteProp>();
  const email = route.params.email;
  const [boxes, setBoxes] = useState(["", "", "", "", ""]);
  const boxRefs = useRef<Array<TextInput | null>>(new Array(5).fill(null));
  const [boxIsFocused, setBoxIsFocused] = useState(new Array(5).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (text: string, index: number) => {
    if (/^\d{0,1}$/.test(text)) {
      const newBoxes = [...boxes];
      newBoxes[index] = text;
      setBoxes(newBoxes);

      const allBoxesCleared = newBoxes.every((box) => box === "");

      if (text === "" && index > 0) {
        boxRefs.current[index - 1]?.focus();
      } else if (index < 4 && !allBoxesCleared) {
        boxRefs.current[index + 1]?.focus();
      } else if (allBoxesCleared) {
        boxRefs.current[0]?.focus();
      }
    }
  };

  const { mutateAsync: verifyOtp } = useApi.post("/auth/verify-email");

  const handleButtonClick = async () => {
    const otp = boxes.join("");

    if (otp.length === 5) {
      setIsSubmitting(true);
      try {
        const response = await verifyOtp({ otp, email });
        handleShowFlash({
          message: "Email verified successfully!",
          type: "success",
        });
        navigation.navigate("CreateTagScreen");
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message: string };
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
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
    <SafeAreaView>
      <ScrollView>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText} allowFontScaling={false}>
              Verify Email Address
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Enter the OTP sent to {email}
            </Text>
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
                  value={value ? "*" : ""}
                  allowFontScaling={false}
                  onChangeText={(text) => handleInput(text, index)}
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
                />
              ))}
            </View>
          </View>

          <Button
            title={"Verify Account"}
            onPress={handleButtonClick}
            className="mt-4"
            textColor="#fff"
            disabled={isSubmitting}
          />

          <View className="justify-center items-center mt-6">
            <Text style={styles.otpText} allowFontScaling={false}>
              Didn’t receive an OTP?
            </Text>

            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText} allowFontScaling={false}>
                Resend OTP (59s)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(20),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: RFValue(13),
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING * 2,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(19),
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    textAlign: "center",
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING,
    borderRadius: 10,
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
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
  },
  countdownContainer: {
    marginTop: SPACING * 2,
    backgroundColor: COLORS.violet200,
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING * 2,
    borderRadius: 4,
  },
  countdownText: {},
});
