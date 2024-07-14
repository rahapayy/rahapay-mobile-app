import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../../../assets/svg/logo.svg";
import Biometrics from "../../../assets/svg/biometrics.svg";
import { Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import Button from "../../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../context/AuthContext";

const WelcomeBackScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    async function getInfo() {
      const user = await AsyncStorage.getItem("userDetails");
      if (user) {
        setUserInfo(JSON.parse(user));
      }
    }

    return () => {
      getInfo();
    };
  }, []);

  const { login } = useContext(AuthContext);

  async function handleLogin() {
    setIsLoading(true);
    try {
      await login(userInfo?.email ?? userInfo?.phoneNumber, password);
      // Handle successful login
      // Save the token or any necessary data from response.data
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
        err.response?.data?.message || err.message || "An error occurred";
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
      console.error("Error logging in", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View className="h-[40vh] flex-col items-center justify-center">
            <Logo />
          </View>
          <View className="px-4">
            <Text style={styles.welcomeText}>
              Welcome back, {userInfo?.fullName}
            </Text>
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
            <View className="mt-8">
              <Button
                title={"Log in"}
                onPress={handleLogin}
                textColor="#fff"
                isLoading={isLoading} // Show loading indicator when logging in
                disabled={
                  !userInfo?.email ||
                  !userInfo?.phoneNumber ||
                  !password ||
                  isLoading
                }
              />
            </View>
            <View className="mt-10 mb-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text style={styles.switchAccount}>
                  Not {userInfo?.fullName}?{" "}
                  <Text
                    style={styles.switchAccountText}
                    allowFontScaling={false}
                  >
                    Switch Account
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center gap-2">
              <Biometrics />
              <Text style={styles.switchAccount}>Use fingerprint instead</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeBackScreen;

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: RFValue(24),
    fontWeight: "500",
    fontFamily: "Outfit-Regular",
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
  forgotPasswordText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet600,
    fontSize: RFValue(12),
  },
  switchAccount: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    textAlign: "center",
  },
  switchAccountText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet600,
    fontSize: RFValue(14),
  },
});
