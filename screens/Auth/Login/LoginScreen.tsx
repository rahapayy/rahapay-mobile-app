import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../context/AuthContext";
import { logError } from "../../../utils/errorLogger";
import { AxiosError } from "axios";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import {
  BoldText,
  LightText,
  MediumText,
} from "../../../components/common/Text";
import Label from "../../../components/common/ui/forms/Label";
import BasicInput from "../../../components/common/ui/forms/BasicInput";

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useContext(AuthContext);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const handleLogin = async () => {
    const isEmail = isValidEmail(id);
    const isPhoneNumber = isValidPhoneNumber(id);

    if (!isEmail && !isPhoneNumber) {
      setErrorMessage("Please enter a valid email or phone number.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    try {
      await login(id, password);
      handleShowFlash({
        message: "Logged in successfully!",
        type: "success",
      });
    } catch (error: unknown) {
      console.error("Login Error:", error);

      let errorMessage = "An error occurred. Please try again.";

      if (error instanceof AxiosError) {
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            errorMessage = "User not found. Please check your credentials.";
          } else if (status === 401) {
            errorMessage = "Incorrect password. Please try again.";
          } else if (status >= 500) {
            errorMessage = "A server error occurred. Please try again later.";
          } else {
            errorMessage = "An unexpected error occurred. Please try again.";
          }
        } else {
          errorMessage = "An unexpected error occurred. Please try again.";
        }
      } else if (error instanceof Error) {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("CreateAccountScreen");
  };

  const isFormComplete = id.trim() && password.trim();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <BackButton navigation={navigation} />

          <View className="mt-8">
            <MediumText color="black" size="xlarge" marginBottom={5}>
              Login
            </MediumText>
            <LightText color="mediumGrey" size="base">
              Welcome back, let's sign in to your account!
            </LightText>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-10">
              <Label text="Email or Phone Number" marked={false} />
              <BasicInput
                value={id}
                onChangeText={setId}
                placeholder="Email or Phone Number"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
              />
              {errorMessage && (
                <Text style={styles.errorText} allowFontScaling={false}>
                  {errorMessage}
                </Text>
              )}
            </View>

            <View className="mt-4">
              <Label text="Password" marked={false} />
              <BasicInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ResetPasswordScreen")}
              className="mt-4 justify-center items-end"
            >
              <BoldText color="primary" size="base">
                Forgot Password?
              </BoldText>
            </TouchableOpacity>

            <Button
              title={"Login"}
              onPress={handleLogin}
              isLoading={isLoading}
              style={[
                styles.proceedButton,
                !isFormComplete && styles.proceedButtonDisabled,
              ]}
              textColor="#fff"
              disabled={!isFormComplete || isLoading}
            />
          </KeyboardAvoidingView>

          <View className="flex-row justify-center items-center mt-6">
            <LightText color="mediumGrey" size="base">
              Don't have an account?{" "}
            </LightText>
            <TouchableOpacity onPress={handleCreateAccount}>
              <BoldText color="primary" size="base">
                Create Account
              </BoldText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  proceedButton: {
    marginTop: SPACING * 4,
  },
  errorText: {
    color: COLORS.red300,
    fontSize: RFValue(10),
    marginTop: 5,
    fontFamily: "Outfit-Regular",
  },
  proceedButtonDisabled: {
    backgroundColor: COLORS.violet200,
  },
});
