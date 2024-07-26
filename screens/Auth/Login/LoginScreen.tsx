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
  ActivityIndicator,
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

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(id, password);
      handleShowFlash({
        message: "Logged in successfully!",
        type: "success",
      });
      navigation.navigate("AppStack");
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message: string;
      };
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
      logError(err); // Log the error using your custom error logger
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("CreateAccountScreen");
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
                style={styles.textInput}
                placeholder="Email or Phone Number"
                placeholderTextColor={"#DFDFDF"}
                allowFontScaling={false}
                value={id}
                onChangeText={setId}
                autoCapitalize="none"
              />
            </View>

            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  secureTextEntry={showPassword}
                  value={password}
                  onChangeText={setPassword}
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
              style={styles.proceedButton}
              textColor="#fff"
              isLoading={isLoading} // Show loading indicator when logging in
              disabled={!id || !password || isLoading} // Disable button if id or password is empty or logging in
            />
            <Button
              title={"Create another account"}
              onPress={handleCreateAccount}
              style={{
                backgroundColor: COLORS.violet200,
                marginTop: SPACING * 2,
              }}
              textColor="#fff"
            />
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
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: 18,
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(14),
    borderRadius: 10,
    padding: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(12),
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  forgotPasswordText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet600,
    fontSize: RFValue(12),
  },
});
