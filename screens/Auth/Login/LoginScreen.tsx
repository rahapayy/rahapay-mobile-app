import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { services } from "@/services";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import {
  BoldText,
  LightText,
  MediumText,
  RegularText,
  SemiBoldText,
} from "../../../components/common/Text";
import Label from "../../../components/common/ui/forms/Label";
import BasicInput from "../../../components/common/ui/forms/BasicInput";
import { ILoginDto } from "../../../services/dtos";
import { useAuth } from "@/services/AuthContext";
import { getItem, setItem, removeItem } from "@/utils/storage";
import Divider from "@/components/Divider";
import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";

const validationSchema = Yup.object().shape({
  id: Yup.string()
    .test("email-or-phone", "Enter a valid email or phone number", (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0][0-9]{10}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    })
    .required("Email or phone number is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { setIsAuthenticated, setUserInfo, setIsFreshLogin } = useAuth();
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  const handleLogin = async (
    values: { id: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    try {
      const payload: ILoginDto = {
        id: values.id,
        password: values.password,
      };

      const response = await services.authService.login(payload);
      console.log("Login response:", response);

      // Clear all lock-related state before setting new tokens
      await Promise.all([
        removeItem("IS_LOCKED"),
        removeItem("BACKGROUND_TIMESTAMP"),
        removeItem("WAS_TERMINATED"),
        removeItem("LOCK_TIMESTAMP"),
      ]);
      console.log("Cleared lock-related storage");

      // Set new tokens after clearing lock state
      await Promise.all([
        setItem("ACCESS_TOKEN", response.data.accessToken, true),
        setItem("REFRESH_TOKEN", response.data.refreshToken, true),
      ]);
      console.log("Set ACCESS_TOKEN and REFRESH_TOKEN");

      const userResponse = await services.authServiceToken.getUserDetails();
      setIsAuthenticated(true);
      setUserInfo(userResponse.data);
      setIsFreshLogin(true);
      console.log("Login successful, set isFreshLogin: true");

      handleShowFlash({
        message: "Login successful! Welcome back!",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      console.error("Login error:", errorMessage);
      console.error(error);
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 p-4">
          <View className="mt-20">
            <SemiBoldText color="black" size="xlarge" marginBottom={5}>
              Welcome Back
            </SemiBoldText>
            <LightText color="mediumGrey" size="base">
              Let's sign in to your account! 🚀
            </LightText>
          </View>

          {!showBiometricPrompt ? (
            <Formik
              initialValues={{ id: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  style={{ flex: 1 }}
                >
                  <View className="flex-1">
                    <View className="mt-10">
                      <Label text="Email or Phone Number" marked={false} />
                      <BasicInput
                        value={values.id}
                        onChangeText={handleChange("id")}
                        placeholder="Email or Phone Number"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                      />
                      {touched.id && errors.id && (
                        <Text style={styles.errorText}>{errors.id}</Text>
                      )}
                    </View>

                    <View className="mt-4">
                      <Label text="Password" marked={false} />
                      <BasicPasswordInput
                        value={values.password}
                        onChangeText={handleChange("password")}
                        placeholder="Password"
                      />
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ResetPasswordScreen")}
                      className="mt-4 justify-center items-end"
                    >
                      <MediumText color="primary" size="small">
                        Forgot Password?
                      </MediumText>
                    </TouchableOpacity>
                    <Divider length={3} />
                    <View className="justify-center items-center">
                      <Button
                        title="Login"
                        onPress={handleSubmit}
                        isLoading={isSubmitting}
                        style={styles.proceedButton}
                        textColor="#fff"
                        disabled={isSubmitting}
                      />
                    </View>
                    <View className="flex-row justify-center items-center mt-6">
                      <LightText color="mediumGrey" size="small">
                        Don't have an account?{" "}
                      </LightText>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CreateAccountScreen")
                        }
                      >
                        <BoldText color="primary" size="small">
                          Create Account
                        </BoldText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              )}
            </Formik>
          ) : (
            <View className="flex-1 justify-center items-center">
              <LightText color="mediumGrey" size="base">
                Authenticating with Face ID...
              </LightText>
              <TouchableOpacity
                onPress={() => setShowBiometricPrompt(false)}
                className="mt-4"
              >
                <RegularText color="primary" size="base">
                  Use Password Instead
                </RegularText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  proceedButton: {
    marginTop: SPACING * 4,
  },
  faceIdButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#5136C1",
  },
  errorText: {
    color: COLORS.red300,
    fontSize: RFValue(10),
    marginTop: 5,
    fontFamily: "Outfit-Regular",
  },
});
