import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import useApi, { services } from "../../../services/apiClient";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import Label from "../../../components/common/ui/forms/Label";
import { LightText, MediumText } from "../../../components/common/Text";
import BasicInput from "../../../components/common/ui/forms/BasicInput";
import { Formik } from "formik";
import * as Yup from "yup";
import { IForgotPasswordDto } from "@/services/dtos";

const ResetPasswordScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
  });

  const handleButtonClick = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const payload: IForgotPasswordDto = {
        email: values.email,
      };

      const response = await services.authService.forgotPassword(payload);
      console.log(response);
      

      handleShowFlash({
        message: "Password reset OTP sent to your email",
        type: "success",
      });

      navigation.navigate("EnterCodeScreen", { email: values.email });
    } catch (error) {
      const err = error as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
          status?: number;
        };
        message: string;
      };
      let errorMessage = "An error occurred";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (err.response?.status === 400) {
        errorMessage = "User not found";
      }

      console.error("API Error:", err.response?.data || err.message);
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, flex: 1 }}>
        <BackButton navigation={navigation} />
        <View style={{ marginTop: 16 }}>
          <MediumText color="black" size="xlarge" marginBottom={5}>
            Reset Password
          </MediumText>
          <LightText color="mediumGrey" size="base">
            Enter your email address to receive the code
          </LightText>
        </View>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleButtonClick}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
              >
                <View className="flex-1">
                  <View className="mt-10">
                    <Label text="Email Address" marked={false} />
                    <BasicInput
                      placeholder="Enter your email address"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errors.email && (
                      <Text style={{ color: "red", marginTop: 8 }}>
                        {errors.email}
                      </Text>
                    )}
                  </View>
                </View>
              </KeyboardAvoidingView>

              <View>
                <Button
                  title={"Reset Password"}
                  onPress={handleSubmit}
                  style={[
                    styles.proceedButton,
                    (!values.email || isLoading) && styles.disabledButton,
                  ]}
                  textColor="#fff"
                  isLoading={isLoading}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  proceedButton: {
    marginTop: SPACING * 2,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
});
