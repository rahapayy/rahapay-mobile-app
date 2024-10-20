import {
  Platform,
  SafeAreaView,
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
import { AuthContext } from "../../../context/AuthContext";
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

interface CreateAccountScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  navigation,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    referral: "",
  });
  const countryCode = "+234";
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    confirmPassword: "",
    password: "",
  });
  const [showRequirements, setShowRequirements] = useState(false);
  const [metRequirements, setMetRequirements] = useState<Set<number>>(
    new Set()
  );

  const { onboarding } = useContext(AuthContext);

  const [visibleSections, setVisibleSections] = useState({
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

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

  const validatePassword = useCallback(
    (password: string) => {
      return passwordRequirements.every((requirement) =>
        requirement.regex.test(password)
      );
    },
    [passwordRequirements]
  );

  const isFormComplete = useMemo(
    () => 
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      countryCode,
    [formData, countryCode]
  );

  const handleButtonClick = useCallback(async () => {
    if (isFormComplete) {
      if (!validatePassword(formData.password)) {
        setErrors((prev) => ({
          ...prev,
          password: "Password does not meet all requirements",
        }));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        return;
      }

      setIsLoading(true);
      try {
        const userInfo = await onboarding(
          formData.email.trim(),
          formData.password.trim(),
          countryCode,
          formData.fullName.trim(),
          formData.phoneNumber.trim(),
          formData.referral.trim()
        );

        const userId = userInfo?.data?.id;
        console.log("User ID:", userId);

        navigation.navigate("VerifyEmailScreen", {
          email: formData.email,
          id: userId,
        });
      } catch (error: unknown) {
        console.error("Onboarding Error:", error);

        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message ||
            "An error occurred during account creation.";
          handleShowFlash({ message: errorMessage, type: "danger" });
        } else if (error instanceof Error) {
          handleShowFlash({
            message: "An unexpected error occurred: " + error.message,
            type: "danger",
          });
        } else {
          handleShowFlash({
            message: "An unexpected error occurred. Please try again.",
            type: "danger",
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      handleShowFlash({
        message: "Please fill in all required fields",
        type: "warning",
      });
    }
  }, [
    isFormComplete,
    formData,
    validatePassword,
    countryCode,
    onboarding,
    navigation,
  ]);

  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (field === "fullName") {
        setVisibleSections((prev) => ({ ...prev, email: value.trim() !== "" }));
      } else if (field === "email") {
        setVisibleSections((prev) => ({ ...prev, phone: value.trim() !== "" }));
      } else if (field === "phoneNumber") {
        setVisibleSections((prev) => ({
          ...prev,
          password: value.trim() !== "",
        }));
      } else if (field === "password") {
        handlePasswordChange(value);
      } else if (field === "confirmPassword") {
        handleConfirmPasswordChange(value);
      }
    },
    []
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, password: value }));

      const newMetRequirements = new Set<number>();
      passwordRequirements.forEach((req, index) => {
        if (req.regex.test(value)) {
          newMetRequirements.add(index);
        }
      });
      setMetRequirements(newMetRequirements);

      const allRequirementsMet = passwordRequirements.every((_, index) =>
        newMetRequirements.has(index)
      );
      setShowRequirements(!allRequirementsMet && value.length > 0);

      if (validatePassword(value)) {
        setErrors((prev) => ({ ...prev, password: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "Password does not meet all requirements",
        }));
      }

      setVisibleSections((prev) => ({
        ...prev,
        confirmPassword: value !== "",
      }));

      if (formData.confirmPassword) {
        if (formData.confirmPassword !== value) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
      }
    },
    [formData.confirmPassword, passwordRequirements, validatePassword]
  );

  const handleConfirmPasswordChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, confirmPassword: value }));
      if (formData.password !== value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    },
    [formData.password]
  );

  const renderInputField = useCallback(
    (
      label: string,
      field: string,
      placeholder: string,
      keyboardType: string = "default",
      secureTextEntry: boolean = false,
      optional: boolean = false
    ) => (
      <View className="mt-4">
        <Label text={label} marked={!optional} />
        <BasicInput
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) =>
            handleInputChange(field as keyof typeof formData, value)
          }
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
      </View>
    ),
    [formData, handleInputChange]
  );

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
      >
        <View className="flex-1 px-4">
          <BackButton navigation={navigation} />

          <View className="mt-8 mb-4">
            <MediumText color="black" size="xlarge" marginBottom={5}>
              Let's Get Started 🎉
            </MediumText>
            <LightText color="mediumGrey" size="base">
              Just a few more details to set up your account.
            </LightText>
          </View>

          {renderInputField("First & Last name", "fullName", "e.g John Doe")}

          {visibleSections.email && (
            <Animatable.View animation={"fadeIn"} duration={600}>
              {renderInputField(
                "Email Address",
                "email",
                "e.g johndoe@email.com"
              )}
            </Animatable.View>
          )}

          {visibleSections.phone && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Label text="Phone Number" marked={false} />
              <PhoneNumberInput
                value={formData.phoneNumber}
                onChangeText={(value: string) =>
                  handleInputChange("phoneNumber", value)
                }
                countryCode={countryCode}
              />
            </Animatable.View>
          )}

          {visibleSections.password && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Label text="Create Password" marked={false} />
              <BasicInput
                value={formData.password}
                onChangeText={(value) => handlePasswordChange(value)}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
              />
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
                      >
                        {requirement.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Animatable.View>
          )}

          {visibleSections.confirmPassword && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Label text="Re-type Password" marked={false} />
              <BasicInput
                value={formData.confirmPassword}
                onChangeText={(value) => handleConfirmPasswordChange(value)}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </Animatable.View>
          )}

          {renderInputField("Referral", "referral", "Referral (Optional)", "default", false, true)}

          <Button
            title="Proceed"
            onPress={handleButtonClick}
            isLoading={isLoading}
            style={[
              styles.proceedButton,
              !isFormComplete && styles.proceedButtonDisabled,
            ]}
            textColor="#fff"
            disabled={!isFormComplete || isLoading}
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  proceedButton: {
    marginTop: SPACING * 4,
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
    fontSize: RFValue(12),
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
