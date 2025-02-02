import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState, useCallback, useMemo } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../../services/AuthContext";
import { AxiosError } from "axios";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import BasicInput from "../../../components/common/ui/forms/BasicInput";
import Label from "../../../components/common/ui/forms/Label";
import {
  BoldText,
  LightText,
  MediumText,
} from "../../../components/common/Text";
import PhoneNumberInput from "../../../components/common/ui/forms/PhoneNumberInput";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionDivider from "../../../components/SectionDivider";
import ProgressIndicator from "../../../components/ProgressIndicator";

interface CreateAccountScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
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
  const { onboarding } = useContext(AuthContext);

  const passwordRequirements = useMemo(
    () => [
      { text: "At least 8 characters", regex: /.{8,}/ },
      { text: "At least one uppercase letter", regex: /[A-Z]/ },
      { text: "At least one lowercase letter", regex: /[a-z]/ },
      { text: "At least one number", regex: /[0-9]/ },
      {
        text: "At least one special character",
        regex: /[!@#$%^&*(),.?":{}|<>]/,
      },
    ],
    []
  );

  const handlePasswordChange = useCallback(
    (value: string, setFieldValue: (field: string, value: any) => void) => {
      setFieldValue("password", value);

      const newMetRequirements = new Set<number>();
      passwordRequirements.forEach((req, index) => {
        if (req.regex.test(value)) {
          newMetRequirements.add(index);
        }
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
            const userInfo = await onboarding(
              values.email.trim(),
              values.password.trim(),
              countryCode,
              values.fullName.trim(),
              values.phoneNumber.trim(),
              values.referral.trim()
            );

            const userId = userInfo?.data?.id;
            handleShowFlash({
              message: "Sign up successful! Please verify your email.",
              type: "success",
            });
            navigation.navigate("VerifyEmailScreen", {
              email: values.email,
              id: userId,
            });
          } catch (error: unknown) {
            console.error("Onboarding Error:", error);
            if (error instanceof AxiosError) {
              handleShowFlash({
                message:
                  error.response?.data?.message ||
                  "An error occurred during account creation.",
                type: "danger",
              });
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
          <View className="flex-1 px-4">
            {/* <View className="flex-row justify-between items-center">
              <BackButton navigation={navigation} />

              <View className="flex-row gap-2">
                <View className="w-1 h-1 bg-gray-300 p-2 rounded-full" />

                <View className="w-1 h-1 bg-gray-300 p-2 rounded-full" />

                <View className="w-1 h-1 bg-gray-300 p-2 rounded-full" />

                <View className="w-1 h-1 bg-gray-300 p-2 rounded-full" />
              </View>

              <LightText color="light">1/4</LightText>
            </View> */}

            <ProgressIndicator
              navigation={undefined}
              currentStep={0}
              totalSteps={4}
            />

            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              enableOnAndroid={true}
              extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
              showsVerticalScrollIndicator={false}
            >
              <View className="mt-8 mb-4">
                <MediumText color="black" size="xlarge" marginBottom={5}>
                  Let's Get Started 🎉
                </MediumText>
                <LightText color="mediumGrey" size="base">
                  Just a few more details to set up your account.
                </LightText>
              </View>

              <View>
                {renderInputField(
                  "Full Name",
                  "fullName",
                  "e.g John Doe",
                  formikProps
                )}
              </View>

              {formikProps.values.fullName && (
                <Animatable.View animation={"fadeIn"} duration={600}>
                  {renderInputField(
                    "Email Address",
                    "email",
                    "e.g johndoe@email.com",
                    formikProps
                  )}
                </Animatable.View>
              )}

              {(formikProps.values.email || visibleSections.phone) && (
                <Animatable.View
                  animation={"fadeIn"}
                  duration={600}
                  className="mt-4"
                >
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
                </Animatable.View>
              )}

              {(formikProps.values.phoneNumber || visibleSections.password) && (
                <Animatable.View
                  animation={"fadeIn"}
                  duration={600}
                  className="mt-4"
                >
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
                </Animatable.View>
              )}

              {(formikProps.values.password ||
                visibleSections.confirmPassword) && (
                <Animatable.View
                  animation={"fadeIn"}
                  duration={600}
                  // className="mt-2"
                >
                  {renderInputField(
                    "Re-type Password",
                    "confirmPassword",
                    "Confirm Password",
                    formikProps,
                    true
                  )}
                </Animatable.View>
              )}

              {renderInputField(
                "Referral",
                "referral",
                "Referral (Optional)",
                formikProps,
                false,
                true
              )}
            </KeyboardAwareScrollView>

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
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  proceedButton: {
    marginTop: SPACING * 2,
  },
  proceedButtonDisabled: {
    backgroundColor: COLORS.violet200,
  },
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
  requirementNotMet: {
    backgroundColor: "#FFEBEE",
    borderColor: "#FF8A80",
  },
  requirementMet: {
    backgroundColor: "#E8F5E9",
    borderColor: "#A5D6A7",
  },
  requirementIcon: {
    marginRight: 4,
    fontSize: RFValue(12),
  },
  requirementNotMetIcon: {
    color: "#D32F2F",
  },
  requirementMetIcon: {
    color: "#4CAF50",
  },
  requirementText: {
    fontSize: RFValue(10),
    fontFamily: "Outfit-Regular",
  },
  requirementNotMetText: {
    color: "#D32F2F",
  },
  requirementMetText: {
    color: "#4CAF50",
  },
  alreadyHaveAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING * 2,
  },
});
