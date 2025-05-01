import React, { useState } from "react";
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import FONT_SIZE from "../../../constants/font-size";
import { services } from "../../../services/apiClient";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthStackParamList } from "../../../types/RootStackParams"; // Ensure this path is correct
import BackButton from "../../../components/common/ui/buttons/BackButton";
import {
  LightText,
  MediumText,
  SemiBoldText,
} from "../../../components/common/Text";
import { BasicPasswordInput } from "../../../components/common/ui/forms/BasicPasswordInput";
import Label from "../../../components/common/ui/forms/Label";
import { IResetPasswordDto } from "@/services/dtos"; // Ensure this path is correct

// Define the props type explicitly
type CreateNewPasswordScreenProps = {
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "CreateNewPasswordScreen"
  >;
  route: {
    params: { resetToken: string };
  };
};

// Define the component without React.FC for better type control
const CreateNewPasswordScreen = ({
  navigation,
  route,
}: CreateNewPasswordScreenProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleButtonClick = async () => {
    if (password !== confirmPassword) {
      handleShowFlash({
        message: "Passwords do not match",
        type: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Making request with resetToken:", route.params.resetToken);
      const payload: IResetPasswordDto = {
        resetToken: route.params.resetToken,
        password: password,
      };

      const response = await services.authService.resetPassword(payload);
      console.log(response);

      handleShowFlash({
        message: "Password reset successfully!",
        type: "success",
      });
      navigation.navigate("LoginScreen");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      console.error("error:", errorMessage);
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
        <BackButton
          navigation={navigation as NativeStackNavigationProp<any, "">}
        />

        <View className="mt-4">
          <SemiBoldText color="black" size="xlarge" marginBottom={5}>
            Create New Password
          </SemiBoldText>
          <LightText color="mediumGrey" size="base">
            Enter new password to recover account
          </LightText>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="mt-4">
              <Label marked={false} text="Password" />
              <BasicPasswordInput
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
              />

              <View className="mt-4">
                <Label marked={false} text="Confirm Password" />
                <BasicPasswordInput
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>
          </ScrollView>

          <Button
            title={"Reset Password"}
            onPress={handleButtonClick}
            className="mt-6"
            textColor="#fff"
            isLoading={isSubmitting}
            disabled={isSubmitting || !password || !confirmPassword}
            style={
              isSubmitting || !password || !confirmPassword
                ? styles.disabledButton
                : null
            }
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreateNewPasswordScreen;

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
  proceedButton: {
    marginTop: SPACING * 4,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
  },
  forgotPasswordText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet600,
    fontSize: FONT_SIZE.medium,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
});
