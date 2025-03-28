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

const ChangePinScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "ChangePin">;
}> = ({ navigation }) => {
  const route =
    useRoute<
      RouteProp<
        { params: { type: "transactionPin" | "securityPin" } },
        "params"
      >
    >();
  const pinType = route.params.type;
  const pinLength = pinType === "transactionPin" ? 4 : 6;

  const [formValues, setFormValues] = useState({
    currPin: Array(pinLength).fill(""),
    newPin: Array(pinLength).fill(""),
    confirmPin: Array(pinLength).fill(""),
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(
    value: string[],
    fieldKey: keyof typeof formValues
  ) {
    setFormValues({ ...formValues, [fieldKey]: value });
  }

  async function handleButtonClick() {
    const currPinStr = formValues.currPin.join("");
    const newPinStr = formValues.newPin.join("");
    const confirmPinStr = formValues.confirmPin.join("");

    if (newPinStr !== confirmPinStr) {
      handleShowFlash({
        message: "New PIN must match confirmation PIN",
        type: "danger",
      });
      return;
    }

    if (
      currPinStr.length !== pinLength ||
      newPinStr.length !== pinLength ||
      confirmPinStr.length !== pinLength
    ) {
      handleShowFlash({
        message: `Please enter a ${pinLength}-digit PIN for all fields`,
        type: "danger",
      });
      return;
    }

    setIsLoading(true);
    try {
      await services.userService.updateCredentials({
        type: pinType,
        current: currPinStr,
        new: newPinStr,
      });
      handleShowFlash({
        message: `${
          pinType === "transactionPin" ? "Transaction" : "Security"
        } PIN changed successfully!`,
        type: "success",
      });
      navigation.goBack();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      console.error("Failed to update PIN:", errorMessage);
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
                <ArrowLeft color={"#000"} size={24} />
              </TouchableOpacity>
              <RegularText color="black" size="large">
                Change{" "}
                {pinType === "transactionPin" ? "Transaction" : "Security"} PIN
              </RegularText>
            </View>
            <View className="flex-1">
              <View style={styles.inputContainer}>
                <Label text="Current PIN" marked={false} />
                <View className="justify-start items-start">
                  <OtpInput
                    length={pinLength}
                    value={formValues.currPin}
                    onChange={(value) => handleInputChange(value, "currPin")}
                    secureTextEntry
                    autoFocus={true}
                    disabled={isLoading}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Label text="New PIN" marked={false} />
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
              <View style={styles.inputContainer}>
                <Label text="Confirm New PIN" marked={false} />
                <View className="justify-start items-start">
                  <OtpInput
                    length={pinLength}
                    value={formValues.confirmPin}
                    onChange={(value) => handleInputChange(value, "confirmPin")}
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
                formValues.currPin.some((digit) => !digit) ||
                formValues.newPin.some((digit) => !digit) ||
                formValues.confirmPin.some((digit) => !digit) ||
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
