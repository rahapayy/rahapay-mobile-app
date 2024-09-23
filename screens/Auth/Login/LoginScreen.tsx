import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../context/AuthContext";
import { logError } from "../../../utils/errorLogger";
import { AxiosError } from "axios";

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State to manage focus of each input
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const { login } = useContext(AuthContext);

  // Utility functions
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

    setErrorMessage(null); // Clear any previous error messages
    setIsLoading(true);
    try {
      await login(id, password);
      handleShowFlash({
        message: "Logged in successfully!",
        type: "success",
      });
      // navigation.navigate("AppStack");
    } catch (error: unknown) {
      console.error("Login Error:", error); // Log for debugging

      let errorMessage = "An error occurred. Please try again.";

      if (error instanceof AxiosError) {
        // Handle Axios errors specifically
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
      logError(error); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("CreateAccountScreen");
  };

  const isFormComplete = id.trim && password.trim;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText} allowFontScaling={false}>
              Log in
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Welcome back, let’s sign in to your account!
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-10">
              <Text style={styles.label} allowFontScaling={false}>
                Email or Phone Number
              </Text>
              <TextInput
                style={[styles.textInput, isIdFocused && styles.focusedInput]}
                placeholder="Email or Phone Number"
                placeholderTextColor={"#BABFC3"}
                allowFontScaling={false}
                value={id}
                onChangeText={setId}
                autoCapitalize="none"
                onFocus={() => setIsIdFocused(true)}
                onBlur={() => setIsIdFocused(false)}
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
              <Text style={styles.label} allowFontScaling={false}>
                Password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  isPasswordFocused && styles.focusedInput, // Apply focus style if focused
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  secureTextEntry={showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  autoComplete="off"
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
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ResetPasswordScreen")}
              className="mt-4"
            >
              <Text style={styles.forgotPasswordText} allowFontScaling={false}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title={"Log in"}
              onPress={handleLogin}
              isLoading={isLoading} // Show loading indicator when logging in
              style={[
                styles.proceedButton,
                !isFormComplete && styles.proceedButtonDisabled,
              ]}
              textColor="#fff"
              disabled={!isFormComplete || isLoading}
            />
            <View className="flex-row justify-center items-center mt-6">
              <Text style={styles.dont} allowFontScaling={false}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.signup} allowFontScaling={false}>
                  Sign up Here
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  label: {
    fontFamily: "Outfit-Medium",
    marginBottom: 10,
    fontSize: RFValue(10),
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
    fontFamily: "Outfit-Regular",
  },
  focusedInput: {
    borderColor: COLORS.violet600,
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  forgotPasswordText: {
    fontFamily: "Outfit-Medium",
    color: COLORS.violet600,
    fontSize: RFValue(12),
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
  dont: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
  },
  signup: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(12),
    color: COLORS.violet600,
  },
});
