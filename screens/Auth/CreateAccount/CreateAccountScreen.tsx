import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../../context/AuthContext";
import { AxiosError } from "axios";

const CreateAccountScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const countryCode = "+234";
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const [metRequirements, setMetRequirements] = useState<Set<number>>(
    new Set()
  );

  const { onboarding } = useContext(AuthContext);

  const [showEmailSection, setShowEmailSection] = useState(false);
  const [showPhoneSection, setShowPhoneSection] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showConfirmPasswordSection, setShowConfirmPasswordSection] =
    useState(false);

  const passwordRequirements = [
    { text: "At least 8 characters", regex: /.{8,}/ },
    { text: "At least one uppercase letter", regex: /[A-Z]/ },
    { text: "At least one lowercase letter", regex: /[a-z]/ },
    { text: "At least one number", regex: /[0-9]/ },
    { text: "At least one special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  const validatePassword = (password: string) => {
    return passwordRequirements.every((requirement) =>
      requirement.regex.test(password)
    );
  };

  const isFormComplete =
    fullName.trim() &&
    email.trim() &&
    phoneNumber.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    countryCode;

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleButtonClick = async () => {
    if (isFormComplete) {
      if (!validatePassword(password)) {
        setPasswordError("Password does not meet all requirements");
        return;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        return;
      }

      setIsLoading(true);
      try {
        const userInfo = await onboarding(
          email.trim(),
          password.trim(),
          countryCode,
          fullName.trim(),
          phoneNumber.trim(),
          referral.trim()
        );

        // Get the user ID from the response
        const userId = userInfo?.data?.id;
        console.log("User ID:", userId);

        navigation.navigate("VerifyEmailScreen", {
          email,
          id: userId,
        });
      } catch (error: unknown) {
        console.error("Onboarding Error:", error);

        if (error instanceof AxiosError) {
          // Server responded with a status other than 2xx
          const errorMessage =
            error.response?.data?.message ||
            "An error occurred during account creation.";
          handleShowFlash({
            message: errorMessage,
            type: "danger",
          });
        } else if (error instanceof Error) {
          // Generic error
          handleShowFlash({
            message: "An unexpected error occurred: " + error.message,
            type: "danger",
          });
        } else {
          // Catch-all for unexpected error types
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
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setShowEmailSection(value.trim() !== "");
    if (value.trim() === "") {
      setShowPhoneSection(false);
      setShowPasswordSection(false);
      setShowConfirmPasswordSection(false);
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setShowPhoneSection(value.trim() !== "");
    if (value.trim() === "") {
      setShowPasswordSection(false);
      setShowConfirmPasswordSection(false);
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    setShowPasswordSection(value.trim() !== "");
    if (value.trim() === "") {
      setShowConfirmPasswordSection(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setShowConfirmPasswordSection(value.trim() !== "");
    if (value.trim() === "") {
      setConfirmPassword("");
    }
    if (password !== value) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // Update password requirements status
    const newMetRequirements = new Set<number>();
    passwordRequirements.forEach((req, index) => {
      if (req.regex.test(value)) {
        newMetRequirements.add(index);
      }
    });
    setMetRequirements(newMetRequirements);

    // Determine if all requirements are met
    const allRequirementsMet = passwordRequirements.every((req, index) =>
      newMetRequirements.has(index)
    );
    setShowRequirements(!allRequirementsMet && value.length > 0);

    // Update password error if necessary
    if (validatePassword(value)) {
      setPasswordError("");
    } else {
      setPasswordError("Password does not meet all requirements");
    }

    // Ensure confirm password section is visible if password is not empty
    if (value) {
      setShowConfirmPasswordSection(true);
    } else {
      setShowConfirmPasswordSection(false);
    }
  };

  const handleReferralChange = (value: string) => {
    setReferral(value);
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
      >
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText} allowFontScaling={false}>
              Let's Get Started 🎉
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Just a few more details to set up your account.
            </Text>
          </View>
          <View className="mt-10">
            <Text style={styles.label} allowFontScaling={false}>
              First & Last name
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g John Doe"
              allowFontScaling={false}
              placeholderTextColor={"#BABFC3"}
              value={fullName}
              onChangeText={handleFullNameChange}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {showEmailSection && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Text style={styles.label} allowFontScaling={false}>
                Email Address
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g johndoe@email.com"
                placeholderTextColor={"#BABFC3"}
                allowFontScaling={false}
                value={email}
                onChangeText={handleEmailChange}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animatable.View>
          )}

          {showPhoneSection && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Text style={styles.label} allowFontScaling={false}>
                Phone Number
              </Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Image
                    source={require("../../../assets/images/flag-for-nigeria.png")}
                    alt=""
                    className="w-6 h-6"
                  />
                  <View>
                    <Text style={styles.numberText} allowFontScaling={false}>
                      {" "}
                      +234{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.vertical} />
                <TextInput
                  style={styles.input}
                  placeholder="8038929383"
                  placeholderTextColor="#BABFC3"
                  keyboardType="numeric"
                  allowFontScaling={false}
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </Animatable.View>
          )}
          {showPasswordSection && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Text style={styles.label} allowFontScaling={false}>
                Create Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={showPassword}
                  autoComplete="off"
                  textContentType="none"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <EyeSlash color="#000" size={20} />
                  ) : (
                    <Eye color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>
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

          {showConfirmPasswordSection && (
            <Animatable.View
              animation={"fadeIn"}
              duration={600}
              className="mt-4"
            >
              <Text style={styles.label} allowFontScaling={false}>
                Re-type Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={"#BABFC3"}
                  secureTextEntry={showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  allowFontScaling={false}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? (
                    <EyeSlash color="#000" size={20} />
                  ) : (
                    <Eye color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </Animatable.View>
          )}

          <View className="mt-4">
            <Text style={styles.label} allowFontScaling={false}>
              Referral
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Referral (Optional)"
              placeholderTextColor={"#BABFC3"}
              allowFontScaling={false}
              value={referral}
              onChangeText={handleReferralChange}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
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
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(18),
    marginBottom: 6,
  },
  subText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
    color: "#0000008F",
  },
  label: {
    fontFamily: "Outfit-Medium",
    marginBottom: 10,
    fontSize: RFValue(10),
  },
  vertical: {
    backgroundColor: COLORS.black100,
    width: 1,
    height: "100%",
    marginHorizontal: SPACING,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: RFValue(10),
    fontFamily: "Outfit-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(12),
    borderRadius: 10,
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    fontSize: RFValue(10),
    fontFamily: "Outfit-Medium",
  },
  numberText: {
    fontFamily: "Outfit-Regular",
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
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
});
