import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AxiosError } from "axios";
import BasicInput from "../../../components/common/ui/forms/BasicInput";
import Label from "../../../components/common/ui/forms/Label";
import {
  BoldText,
  LightText,
  MediumText,
  SemiBoldText,
} from "../../../components/common/Text";
import PhoneNumberInput from "../../../components/common/ui/forms/PhoneNumberInput";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { IOnboardingDto } from "@/services/dtos";
import { services } from "@/services";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CreateAccountScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  referral: Yup.string(),
});

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  navigation,
}) => {
  const [showRequirements, setShowRequirements] = useState(false);
  const [metRequirements, setMetRequirements] = useState<Set<number>>(
    new Set()
  );
  const [visibleSections, setVisibleSections] = useState({
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });
  const countryCode = "+234";

  const passwordRequirements = useMemo(
    () => [{ text: "At least 8 characters", regex: /.{8,}/ }],
    []
  );

  const handlePasswordChange = useCallback(
    (value: string, setFieldValue: (field: string, value: any) => void) => {
      setFieldValue("password", value);
      const newMetRequirements = new Set<number>();
      passwordRequirements.forEach((req, index) => {
        if (req.regex.test(value)) newMetRequirements.add(index);
      });
      setMetRequirements(newMetRequirements);
      setShowRequirements(
        value.length > 0 &&
          newMetRequirements.size < passwordRequirements.length
      );
      setVisibleSections((prev) => ({
        ...prev,
        confirmPassword: value !== "",
      }));
    },
    [passwordRequirements]
  );

  const renderInputField = useCallback(
    (
      label: string,
      field: string,
      placeholder: string,
      formikProps: any,
      secureTextEntry: boolean = false,
      optional: boolean = false
    ) => (
      <View className="mt-4">
        <Label text={label} marked={false} />
        <BasicInput
          value={formikProps.values[field]}
          onChangeText={formikProps.handleChange(field)}
          onBlur={formikProps.handleBlur(field)}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
        {formikProps.touched[field] && formikProps.errors[field] && (
          <Text style={styles.errorText}>{formikProps.errors[field]}</Text>
        )}
      </View>
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1">
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          referral: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload: IOnboardingDto = {
              email: values.email.trim(),
              password: values.password.trim(),
              countryCode,
              fullName: values.fullName.trim(),
              phoneNumber: values.phoneNumber.trim(),
              referral: values.referral.trim(),
            };

            const response = await services.authService.onboarding(payload);
            const userId = response.data.id;

            await AsyncStorage.setItem(
              "ONBOARDING_STATE",
              JSON.stringify({
                email: values.email,
                userId,
                step: "verifyEmail",
              })
            );

            handleShowFlash({
              message: "Sign up successful! Please verify your email.",
              type: "success",
            });
            navigation.navigate("VerifyEmailScreen", {
              email: values.email,
              id: userId,
            });
          } catch (error: unknown) {
            if (error instanceof AxiosError) {
              const errorMessage = error.response?.data?.message;
              if (error.response?.status === 409) {
                handleShowFlash({
                  message:
                    "This email is already registered. Please verify it.",
                  type: "info",
                });
                navigation.navigate("VerifyEmailScreen", {
                  email: values.email,
                  id: error.response?.data?.id || "",
                });
              } else {
                handleShowFlash({
                  message:
                    errorMessage ||
                    "An error occurred during account creation.",
                  type: "danger",
                });
              }
            } else {
              handleShowFlash({
                message: "An unexpected error occurred. Please try again.",
                type: "danger",
              });
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {(formikProps) => (
          <View className="flex-1 p-4">
            <ProgressIndicator
              navigation={navigation}
              currentStep={0}
              totalSteps={3}
            />
            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              enableOnAndroid={true}
              extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
              showsVerticalScrollIndicator={false}
            >
              <View className="mt-8 mb-4">
                <SemiBoldText color="black" size="xlarge" marginBottom={5}>
                  Let's Get Started 🎉
                </SemiBoldText>
                <LightText color="mediumGrey" size="base">
                  Just a few more details to set up your account.
                </LightText>
              </View>
              {renderInputField(
                "Full Name",
                "fullName",
                "e.g John Doe",
                formikProps
              )}
              {renderInputField(
                "Email Address",
                "email",
                "e.g johndoe@email.com",
                formikProps
              )}
              <View className="mt-4">
                <Label text="Phone Number" marked={false} />
                <PhoneNumberInput
                  value={formikProps.values.phoneNumber}
                  onChangeText={(value: string) =>
                    formikProps.setFieldValue("phoneNumber", value)
                  }
                  countryCode={countryCode}
                />
                {formikProps.touched.phoneNumber &&
                  formikProps.errors.phoneNumber && (
                    <Text style={styles.errorText}>
                      {formikProps.errors.phoneNumber}
                    </Text>
                  )}
              </View>
              <View className="mt-4">
                <Label text="Create Password" marked={false} />
                <BasicInput
                  value={formikProps.values.password}
                  onChangeText={(value) =>
                    handlePasswordChange(value, formikProps.setFieldValue)
                  }
                  placeholder="Password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                />
                {formikProps.touched.password &&
                  formikProps.errors.password && (
                    <Text style={styles.errorText}>
                      {formikProps.errors.password}
                    </Text>
                  )}
                {showRequirements && (
                  <View style={styles.requirementsContainer}>
                    {passwordRequirements.map((requirement, index) => (
                      <View
                        key={index}
                        style={[
                          styles.requirementItem,
                          metRequirements.has(index)
                            ? styles.requirementMet
                            : styles.requirementNotMet,
                        ]}
                      >
                        <Text
                          style={[
                            styles.requirementIcon,
                            metRequirements.has(index)
                              ? styles.requirementMetIcon
                              : styles.requirementNotMetIcon,
                          ]}
                          allowFontScaling={false}
                        >
                          {metRequirements.has(index) ? "✓" : "✗"}
                        </Text>
                        <Text
                          style={[
                            styles.requirementText,
                            metRequirements.has(index)
                              ? styles.requirementMetText
                              : styles.requirementNotMetText,
                          ]}
                          allowFontScaling={false}
                        >
                          {requirement.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              {renderInputField(
                "Re-type Password",
                "confirmPassword",
                "Confirm Password",
                formikProps,
                true
              )}
              {renderInputField(
                "Referral",
                "referral",
                "Referral (Optional)",
                formikProps,
                false,
                true
              )}
              <Button
                title="Proceed"
                onPress={() => formikProps.handleSubmit()}
                isLoading={formikProps.isSubmitting}
                style={[
                  styles.proceedButton,
                  !formikProps.isValid && styles.proceedButtonDisabled,
                ]}
                textColor="#fff"
                disabled={!formikProps.isValid || formikProps.isSubmitting}
              />
              <View style={styles.alreadyHaveAccountContainer}>
                <MediumText color="mediumGrey" size="base">
                  Already have an account?{" "}
                </MediumText>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <BoldText color="primary" size="base">
                    Login
                  </BoldText>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  proceedButton: { marginTop: SPACING * 5 },
  proceedButtonDisabled: { backgroundColor: COLORS.violet200 },
  errorText: {
    color: COLORS.red300,
    fontSize: RFValue(12),
    marginTop: SPACING,
  },
  requirementsContainer: {
    marginTop: SPACING,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  requirementNotMet: { backgroundColor: "#FFEBEE", borderColor: "#FF8A80" },
  requirementMet: { backgroundColor: "#E8F5E9", borderColor: "#A5D6A7" },
  requirementIcon: { marginRight: 4, fontSize: RFValue(12) },
  requirementNotMetIcon: { color: "#D32F2F" },
  requirementMetIcon: { color: "#4CAF50" },
  requirementText: { fontSize: RFValue(10), fontFamily: "Outfit-Regular" },
  requirementNotMetText: { color: "#D32F2F" },
  requirementMetText: { color: "#4CAF50" },
  alreadyHaveAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING * 2,
  },
});
