import React, { useState } from "react";
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
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
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import FONT_SIZE from "../../../constants/font-size";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { RootStackParamList } from "../../../types/RootStackParams";

type CreateNewPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateNewPasswordScreen">;
  route: { params: { resetToken: string } };
};

const CreateNewPasswordScreen: React.FC<CreateNewPasswordScreenProps> = ({ navigation, route }) => {
  const { resetToken } = route.params;

  const [showPassword, setShowPassword] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const togglePasswordVisibility2 = () => setShowPassword2((prev) => !prev);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useApi.patch("/auth/reset-password");

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
      console.log("Making request with resetToken:", resetToken);
      await mutateAsync({ password, resetToken });
      handleShowFlash({
        message: "Password reset successfully!",
        type: "success",
      });
      navigation.navigate("LoginScreen");
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message: string;
      };
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText} allowFontScaling={false}>
              Create Password
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Enter new password to recover account
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor={"#BABFC3"}
                  secureTextEntry={showPassword}
                  allowFontScaling={false}
                  value={password}
                  onChangeText={setPassword}
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

              <View className="mt-4">
                <Text style={styles.label} allowFontScaling={false}>
                  Confirm Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor={"#BABFC3"}
                    secureTextEntry={showPassword2}
                    allowFontScaling={false}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility2}>
                    {showPassword2 ? (
                      <EyeSlash color="#000" size={20} />
                    ) : (
                      <Eye color="#000" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
      </ScrollView>
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
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    fontSize: RFValue(12),
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
  forgotPasswordText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet600,
    fontSize: FONT_SIZE.medium,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
});
