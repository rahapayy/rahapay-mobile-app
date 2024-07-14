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
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateAccountScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const countryCode = "+234";
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const [metRequirements, setMetRequirements] = useState<Set<number>>(
    new Set()
  );

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
        const response = await mutateAsync({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          countryCode,
          password: password.trim(),
        });

        handleShowFlash({
          message: "Account created successfully!",
          type: "success",
        });

        navigation.navigate("VerifyEmailScreen", {
          email,
          id: "",
          // id: response.data.data.id,
        });
      } catch (error) {
        const err = error as {
          response?: { data?: { message?: string } };
          message: string;
        };
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        console.error("API Error:", err.response?.data || err.message);

        handleShowFlash({
          message: errorMessage,
          type: "danger",
        });
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

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password !== value) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const { mutateAsync } = useApi.post("/auth/onboarding");

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
              Create an Account
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Let’s set up your account in minutes
            </Text>
          </View>
          <View className="mt-10">
            <Text style={styles.label} allowFontScaling={false}>
              Full Name
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="First & Last name"
              allowFontScaling={false}
              placeholderTextColor={"#DFDFDF"}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View className="mt-4">
            <Text style={styles.label} allowFontScaling={false}>
              Email Address
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Example@email.com"
              placeholderTextColor={"#DFDFDF"}
              allowFontScaling={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mt-4">
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
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
          <View className="mt-4">
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
                onChangeText={(value) => {
                  setPassword(value);
                  setShowRequirements(true);

                  const newMetRequirements = new Set<number>();
                  passwordRequirements.forEach((req, index) => {
                    if (req.regex.test(value)) {
                      newMetRequirements.add(index);
                    }
                  });
                  setMetRequirements(newMetRequirements);

                  if (validatePassword(value)) {
                    setPasswordError("");
                    // Don't hide requirements immediately, let them stay green for a moment
                    setTimeout(() => setShowRequirements(false), 1000);
                  } else {
                    setPasswordError("Password does not meet all requirements");
                  }
                }}
                secureTextEntry={showPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeSlash color="#000" size={20} />
                ) : (
                  <Eye color="#000" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View>
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
            </View>
          </View>

          <View className="mt-4">
            <Text style={styles.label} allowFontScaling={false}>
              Confirm Password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={showPassword}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                allowFontScaling={false}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeSlash color="#000" size={20} />
                ) : (
                  <Eye color="#000" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <View className="mt-4">
            <Text style={styles.label} allowFontScaling={false}>
              Referral
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Referral (Optional)"
              placeholderTextColor={"#DFDFDF"}
              allowFontScaling={false}
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
    fontSize: RFValue(20),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: RFValue(13),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: SPACING * 1.5,
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  vertical: {
    backgroundColor: COLORS.black100,
    width: 1,
    height: "100%",
    marginHorizontal: SPACING,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(12),
    borderRadius: 10,
    padding: SPACING * 1.5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
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
